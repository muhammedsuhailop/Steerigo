// src/interface/controllers/authController.ts
import { type Request, type Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import { UserModel } from '../../infrastructure/models/userModel.ts';
import { sendMail } from '../../infrastructure/mailer/mailer.ts';
import { OTP_LENGTH, BCRYPT_ROUNDS, MAX_OTP_ATTEMPTS,JWT_EXPIRES_IN,OTP_TTL_SECONDS } from '../../utils/constants.ts';

function genOtp(): string {
    return otpGenerator.generate(OTP_LENGTH, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
}

// POST /api/auth/signup-request
export async function signupRequest(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, mobile, dob, gender, address, role } = req.body;

    try {
        // If a verified user exists -> reject
        const existingVerified = await UserModel.findOne({ email, isVerified: true });
        if (existingVerified) return res.status(400).json({ message: 'User already registered' });

        // Hash password immediately
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // Generate OTP and hash it
        const otp = genOtp();
        const otpHash = await bcrypt.hash(otp, BCRYPT_ROUNDS);
        const otpExpires = new Date(
            Date.now() + (parseInt(OTP_TTL_SECONDS || '90', 10) * 1000)
        );

        // Upsert (create new or update existing unverified user)
        await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    name,
                    email,
                    mobile: mobile || undefined,
                    dob: dob ? new Date(dob) : undefined,
                    gender: gender || undefined,
                    address: address || undefined,
                    password: passwordHash,
                    role: role || 'Rider',
                    status: 'Pending Verification',
                    isVerified: false,
                    otpHash,
                    otpExpires,
                    otpAttempts: 0
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send OTP email
        const html = `<p>Your SteeriGo signup OTP is <b>${otp}</b>. It expires in ${OTP_TTL_SECONDS || '300'} seconds.</p>`;
        await sendMail(email, 'SteeriGo Signup OTP', html);

        return res.status(200).json({ message: 'OTP sent to email' });
    } catch (err: any) {
        if (err.code === 11000)
            return res.status(400).json({ message: 'Email or mobile already in use' });
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

// POST /api/auth/signup-verify
export async function signupVerify(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, otp } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'No signup request found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        // Check expiry
        if (!user.otpExpires || user.otpExpires.getTime() < Date.now()) {
            return res.status(400).json({ message: 'OTP expired. Request a new one.' });
        }

        // Check attempts
        if ((user.otpAttempts || 0) >= MAX_OTP_ATTEMPTS) {
            return res
                .status(429)
                .json({ message: 'Maximum OTP attempts exceeded. Request new OTP.' });
        }

        // Compare OTP
        const match = await bcrypt.compare(otp, user.otpHash || '');
        if (!match) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;
            await user.save();
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP ok -> mark verified, clear otp fields
        user.isVerified = true;
        user.status = 'Active';
        user.otpHash = null;
        user.otpExpires = null;
        user.otpAttempts = 0;
        await user.save();

        // Issue JWT
        const jwtSecret: Secret = process.env.JWT_SECRET as string;
        const jwtExpiresIn = (JWT_EXPIRES_IN ?? '1d') as '30m' | '1h' | '1d' | '7d';

        const options: SignOptions = {
            expiresIn: jwtExpiresIn
        };

        const token = jwt.sign(
            { userId: user._id.toString(), role: user.role },
            jwtSecret,
            options
        );



        return res.status(201).json({
            message: 'Signup completed',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user || !user.isVerified)
            return res
                .status(401)
                .json({ message: 'Invalid credentials or email not verified' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const jwtSecret: Secret = process.env.JWT_SECRET as string;
        const jwtExpiresIn = (JWT_EXPIRES_IN ?? '1d') as '30m' | '1h' | '1d' | '7d';

        const options: SignOptions = {
            expiresIn: jwtExpiresIn
        };

        const token = jwt.sign(
            { userId: user._id.toString(), role: user.role },
            jwtSecret,
            options
        );


        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}
