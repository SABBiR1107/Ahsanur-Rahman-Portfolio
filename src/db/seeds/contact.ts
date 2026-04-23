import { db } from '@/db';
import { contact } from '@/db/schema';

async function main() {
    const sampleContact = [
        {
            email: 'ahsanursabbir@gmail.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA, USA',
            github: 'https://github.com/ahsanursabbir',
            linkedin: 'https://linkedin.com/in/ahsanursabbir',
            twitter: 'https://twitter.com/ahsanursabbir',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(contact).values(sampleContact);
    
    console.log('✅ Contact seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});