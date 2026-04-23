import { db } from '@/db';
import { experience } from '@/db/schema';

async function main() {
    const sampleExperience = [
        {
            company: 'DataTech Solutions',
            position: 'Senior Data Scientist',
            startDate: '2022-01',
            endDate: null,
            description: 'Leading a team of 5 data scientists in developing ML models for customer churn prediction and recommendation systems. Reduced churn rate by 25% through advanced analytics and model deployment.',
            location: 'San Francisco, CA',
            current: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            company: 'CloudScale Analytics',
            position: 'Backend Engineer',
            startDate: '2020-06',
            endDate: '2021-12',
            description: 'Designed and implemented RESTful APIs using FastAPI and Django. Built scalable data pipelines processing 10M+ records daily. Optimized database queries resulting in 40% performance improvement.',
            location: 'New York, NY',
            current: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            company: 'AI Innovations Inc',
            position: 'Data Analyst',
            startDate: '2019-06',
            endDate: '2020-05',
            description: 'Performed statistical analysis and data visualization using Python and R. Created dashboards for business intelligence using Tableau and Power BI. Collaborated with cross-functional teams to deliver data-driven insights.',
            location: 'Boston, MA',
            current: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(experience).values(sampleExperience);
    
    console.log('✅ Experience seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});