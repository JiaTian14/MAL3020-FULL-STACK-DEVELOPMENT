const { MongoClient } = require('mongodb');

let client;
let db;

beforeAll(async () => {
    const uri = "mongodb+srv://Tan:1234@assessment.2jgmj.mongodb.net/?retryWrites=true&w=majority&appName=Assessment";
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    global.__MONGO_DB__ = db; // Make the db accessible globally
});

afterAll(async () => {
    if (client) {
        await client.close();
    }
});
