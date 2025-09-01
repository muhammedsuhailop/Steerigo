export type UserRole = 'Rider' | 'Driver' | 'Admin';


export interface User {
id?: string;
name: string;
email: string;
mobile?: string;
dob?: Date | string;
gender?: string;
address?: string;
status: 'Active' | 'Suspended' | 'Deleted' | 'Pending Verification';
role: UserRole;
createdAt?: Date;
updatedAt?: Date;
}