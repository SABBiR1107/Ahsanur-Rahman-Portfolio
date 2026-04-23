import { db } from '@/db';
import { user, account } from '@/db/schema';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

async function main() {
    const userId = randomUUID();
    const hashedPassword = await bcrypt.hash('Ahs@nursabbir0', 10);
    
    const adminUser = {
        id: userId,
        email: 'ahsanursabbir@gmail.com',
        name: 'Ahsanur Sabbir',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await db.insert(user).values(adminUser);

    const adminAccount = {
        id: randomUUID(),
        accountId: 'ahsanursabbir@gmail.com',
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        scope: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await db.insert(account).values(adminAccount);
    
    console.log('✅ Admin user seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});