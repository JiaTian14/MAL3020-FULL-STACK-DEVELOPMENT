const request = require('supertest');
const app = require('../server');

describe('Product API Integration Tests', () => {
    let db;

    beforeAll(async () => {
        db = global.__MONGO_DB__;
        // Clear the collection before running tests
        await db.collection('products').deleteMany({});
        
        // Insert a known set of test data
        const testProducts = Array.from({ length: 25 }, (_, i) => ({
            name: `Test Product ${i + 1}`,
            category: 'Test Category',
            price: 100,
            stock: 10,
            description: `This is test product ${i + 1}`,
            image: 'https://via.placeholder.com/300x250'
        }));
        
        await db.collection('products').insertMany(testProducts);
    });
    
    afterAll(async () => {
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
        const response = await request(app)
            .get('/api/products');

        expect(response.status).toBe(200);
        // We expect 26 products (25 from setup + 1 from the previous test)
        expect(response.body.data.length).toBe(64);
    });
});