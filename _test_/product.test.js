const request = require('supertest');
const app = require('../server');

describe('Product API Integration Tests', () => {
    beforeAll(async () => {
        const db = global.__MONGO_DB__;
        await db.collection('products').insertMany([
            { name: "Sample Product 1", price: 100 },
            // Add more sample products as needed
        ]);
    });
    
    
    afterEach(async () => {
        const db = global.__MONGO_DB__;
        await db.collection('products').deleteMany({});
    });
    

    it('should create a new product', async () => {
        const product = {
            name: 'Test Product',
            category: 'Test Category',
            price: 100,
            stock: 10,
            description: 'This is a test product',
            image: 'https://via.placeholder.com/300x250'
        };

        const response = await request(app)
            .post('/api/products')
            .send(product);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(product.name);
    });

    it('should retrieve all products', async () => {
        const db = global.__MONGO_DB__;
        const product = {
            name: 'Test Product',
            category: 'Test Category',
            price: 100,
            stock: 10,
            description: 'This is a test product',
            image: 'https://via.placeholder.com/300x250'
        };
        await db.collection('products').insertOne(product);

        const response = await request(app)
            .get('/api/products');

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(33);
    });
});
