import { db } from '@/db';
import { projects } from '@/db/schema';

async function main() {
    const sampleProjects = [
        {
            title: 'Customer Churn Prediction System',
            description: 'Built an end-to-end ML pipeline using Python, TensorFlow, and FastAPI to predict customer churn with 92% accuracy. Deployed on AWS with automated model retraining.',
            technologies: 'Python, TensorFlow, FastAPI, PostgreSQL, AWS, Docker',
            imageUrl: 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Churn+Prediction',
            githubUrl: 'https://github.com/ahsanursabbir/churn-prediction',
            liveUrl: 'https://churn-predictor.demo.com',
            featured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Real-time Data Analytics Dashboard',
            description: 'Developed a real-time analytics dashboard processing streaming data using Apache Kafka and React. Visualizes key business metrics with sub-second latency.',
            technologies: 'Python, Apache Kafka, Django, React, PostgreSQL, Redis',
            imageUrl: 'https://via.placeholder.com/800x600/E24A90/FFFFFF?text=Analytics+Dashboard',
            githubUrl: 'https://github.com/ahsanursabbir/analytics-dashboard',
            liveUrl: 'https://analytics.demo.com',
            featured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'NLP Sentiment Analysis API',
            description: 'RESTful API for sentiment analysis using transformer models (BERT). Processes text data and returns sentiment scores with 95% accuracy across multiple languages.',
            technologies: 'Python, PyTorch, FastAPI, Docker, BERT, MongoDB',
            imageUrl: 'https://via.placeholder.com/800x600/90E24A/FFFFFF?text=Sentiment+API',
            githubUrl: 'https://github.com/ahsanursabbir/sentiment-api',
            liveUrl: 'https://sentiment-api.demo.com',
            featured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'E-commerce Recommendation Engine',
            description: 'Built a collaborative filtering recommendation system for an e-commerce platform. Increased click-through rate by 35% using matrix factorization and neural collaborative filtering.',
            technologies: 'Python, TensorFlow, Django, PostgreSQL, Celery, Redis',
            imageUrl: 'https://via.placeholder.com/800x600/E2904A/FFFFFF?text=Recommendation+Engine',
            githubUrl: 'https://github.com/ahsanursabbir/recommendation-engine',
            liveUrl: null,
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'Automated Data Pipeline ETL',
            description: 'Designed and implemented automated ETL pipelines for data warehousing. Processes 50GB+ data daily with error handling, logging, and monitoring using Airflow.',
            technologies: 'Python, Apache Airflow, PostgreSQL, AWS S3, Snowflake',
            imageUrl: 'https://via.placeholder.com/800x600/4AE290/FFFFFF?text=ETL+Pipeline',
            githubUrl: 'https://github.com/ahsanursabbir/etl-pipeline',
            liveUrl: null,
            featured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(projects).values(sampleProjects);
    
    console.log('✅ Projects seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});