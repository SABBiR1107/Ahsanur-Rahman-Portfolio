import { db } from '@/db';
import { certificates } from '@/db/schema';

async function main() {
    const sampleCertificates = [
        {
            title: 'AWS Certified Solutions Architect - Professional',
            issuer: 'Amazon Web Services',
            issueDate: '2022-08',
            credentialUrl: 'https://aws.amazon.com/verification/AWSCERT123456',
            description: 'Advanced certification demonstrating expertise in designing distributed systems and applications on AWS platform.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Google Cloud Professional Data Engineer',
            issuer: 'Google Cloud',
            issueDate: '2022-03',
            credentialUrl: 'https://google.com/credentials/GCPCERT789012',
            description: 'Professional certification for designing, building, and operationalizing data processing systems on Google Cloud Platform.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Deep Learning Specialization',
            issuer: 'Coursera - DeepLearning.AI',
            issueDate: '2021-09',
            credentialUrl: 'https://coursera.org/verify/DLSPEC345678',
            description: '5-course specialization covering neural networks, CNNs, RNNs, and deep learning best practices taught by Andrew Ng.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Machine Learning Engineering for Production (MLOps)',
            issuer: 'Coursera - DeepLearning.AI',
            issueDate: '2023-01',
            credentialUrl: 'https://coursera.org/verify/MLOPS901234',
            description: 'Specialization focused on deploying ML models in production, including model versioning, monitoring, and CI/CD for ML systems.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    await db.insert(certificates).values(sampleCertificates);
    
    console.log('✅ Certificates seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});