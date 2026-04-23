import { db } from '@/db';
import { hero } from '@/db/schema';

async function main() {
    const sampleHero = {
        name: 'Ahsanur Sabbir',
        title: 'Data Scientist & Backend Developer',
        description: 'Passionate about leveraging data science and machine learning to solve complex problems. Experienced in building scalable backend systems and deploying production-ready ML models.',
        imageUrl: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/unnamed-1761520980132.png?width=8000&height=8000&resize=contain',
        availableForWork: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await db.insert(hero).values([sampleHero]);
    
    console.log('✅ Hero seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});