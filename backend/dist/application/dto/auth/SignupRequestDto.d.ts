import { UserRole } from "@shared/constants/AuthConstants";
export declare class SignupRequestDto {
    private email;
    private name;
    private password;
    private mobile;
    private role;
    constructor(data: {
        email: string;
        name: string;
        password: string;
        mobile: string;
        role: UserRole;
    });
    static fromRequest(data: {
        email: string;
        name: string;
        password: string;
        mobile: string;
        role: UserRole;
    }): SignupRequestDto;
    getEmailValue(): string;
    getName(): string;
    getPassword(): string;
    getMobile(): string;
    getRole(): UserRole;
}
//# sourceMappingURL=SignupRequestDto.d.ts.map