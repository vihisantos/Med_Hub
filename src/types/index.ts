export interface Experience {
    id: string;
    hospital: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'doctor' | 'nurse' | 'hospital' | 'admin';
    coren?: string;
    crm?: string;
    registration?: string;
    avatar_url?: string;
    phone?: string;
    bio?: string;
    specialties?: string[];
    experiences?: Experience[];
    location?: string;
    is_verified?: boolean;
    subscription_tier?: 'free' | 'gold' | 'platinum';
}
