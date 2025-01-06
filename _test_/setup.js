const { MongoClient } = require('mongodb');

let client;
let db;

beforeAll(async () => {
    MONGODB_URI= "mongodb://localhost:27017/testDatabase";
    require('dotenv').config();
    const uri = process.env.MONGODB_URI || "mongodb+srv://Tan:1234@assessment.2jgmj.mongodb.net/?retryWrites=true&w=majority&appName=Assessment";

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
