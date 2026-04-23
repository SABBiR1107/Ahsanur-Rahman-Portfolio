import { db } from '@/db';
import { skills } from '@/db/schema';

async function main() {
    const sampleSkills = [
        {
            name: 'Python',
            category: 'hard',
            proficiency: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'R',
            category: 'hard',
            proficiency: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'SQL',
            category: 'hard',
            proficiency: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Machine Learning',
            category: 'hard',
            proficiency: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Data Analysis',
            category: 'hard',
            proficiency: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'TensorFlow',
            category: 'hard',
            proficiency: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Django',
            category: 'hard',
            proficiency: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'FastAPI',
            category: 'hard',
            proficiency: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'PostgreSQL',
            category: 'hard',
            proficiency: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Git',
            category: 'hard',
            proficiency: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Docker',
            category: 'hard',
            proficiency: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Communication',
            category: 'soft',
            proficiency: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Problem Solving',
            category: 'soft',
            proficiency: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Leadership',
            category: 'soft',
            proficiency: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            name: 'Team Collaboration',
            category: 'soft',
            proficiency: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(skills).values(sampleSkills);
    
    console.log('✅ Skills seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});