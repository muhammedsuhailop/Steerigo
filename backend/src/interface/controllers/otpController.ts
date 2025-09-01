import { type Request, type Response } from 'express';
import { UserModel } from '../../infrastructure/models/userModel.ts';
import { OtpModel } from '../../infrastructure/models/otpModel.ts';
import otpGenerator from 'otp-generator';
import { sendMail } from '../../infrastructure/mailer/mailer.ts';

export async function sendOtp(req:Request, res:Response){
    try {
        const {email} = req.body;
        const existing = await UserModel.findOne({email});
        if(existing){
            return res.status(400).json({message:'User already registered'})
        }

        const otp = otpGenerator.generate(4,{digits:true,upperCaseAlphabets:false,specialChars:false});

        await OtpModel.create({email,otp});
        const html = `<h3>Your OTP is ${otp}</h3>`
        await sendMail(email,'SteeriGo OTP',html);

        return res.status(200).json({message:'OTP send successfully'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}