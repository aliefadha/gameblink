export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'SUPERADMIN'; // Use specific roles if you have them
}