import { db } from '@/db';
import { education } from '@/db/schema';

async function main() {
    const sampleEducation = [
        {
            institution: 'Massachusetts Institute of Technology',
            degree: 'Master of Science',
            field: 'Data Science',
            startDate: '2019-09',
            endDate: '2021-05',
            description: 'Focused on machine learning, statistical modeling, and big data analytics. Completed thesis on deep learning applications in natural language processing.',
            location: 'Cambridge, MA, USA',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2015-09',
            endDate: '2019-05',
            description: 'Comprehensive study of algorithms, data structures, software engineering, and database systems. Minor in Mathematics.',
            location: 'Berkeley, CA, USA',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            institution: 'Stanford Online',
            degree: 'Professional Certificate',
            field: 'Machine Learning Engineering',
            startDate: '2021-06',
            endDate: '2021-12',
            description: 'Advanced coursework in ML ops, model deployment, and production systems for machine learning applications.',
            location: 'Online',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(education).values(sampleEducation);
    
    console.log('✅ Education seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});