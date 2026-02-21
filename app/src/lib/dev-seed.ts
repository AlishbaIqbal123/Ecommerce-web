import { registerWithEmail } from './firebase/auth';

export const DEMO_ACCOUNTS = [
    {
        email: 'admin@demo.com',
        password: 'password123',
        displayName: 'Admin User',
        role: 'admin' as const,
    },
    {
        email: 'vendor@demo.com',
        password: 'password123',
        displayName: 'Vendor User',
        role: 'vendor' as const,
    },
    {
        email: 'customer@demo.com',
        password: 'password123',
        displayName: 'Regular Customer',
        role: 'user' as const,
    },
];

export async function seedDemoAccounts() {
    let createdCount = 0;
    for (const account of DEMO_ACCOUNTS) {
        try {
            await registerWithEmail(account.email, account.password, account.displayName, account.role);
            createdCount++;
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                console.log(`${account.email} already exists in Auth. The user document will be automatically verified or recreated upon their next login.`);
            } else {
                console.error(`Failed to create ${account.email}:`, error);
            }
        }
    }
    return createdCount;
}
