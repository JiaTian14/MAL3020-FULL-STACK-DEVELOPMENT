const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// 替换为您的 MongoDB Atlas 连接字符串
const uri = "mongodb+srv://Tan:1234@cluster0.mongodb.net/Assessment2?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// 创建 Express 应用
const app = express();
app.use(bodyParser.json());

// 数据库和集合
let db;
let User;
let cartDB;
let OrderDB;
let ProductDB;

// 初始化数据库连接
async function initDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        const database = client.db("techmart");
        const users = database.collection("users");
        const carts = database.collection("carts");
        const orders = database.collection("orders");
        const products = database.collection("products");
        const profiles = database.collection("profiles");
        const seller = database.collection("sellers");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

// 路由 1: 获取 Profile 数据
app.get('/profiles', async (req, res) => {
    try {
        const profiles = await profileCollection.find({}).toArray();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profiles" });
    }
});

// 路由 2: 获取购物车数据
app.get('/carts', async (req, res) => {
    try {
        const cartItems = await cartCollection.find({}).toArray();
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart items" });
    }
});

// 路由 3: 获取订单数据
app.get('/orders', async (req, res) => {
    try {
        const orders = await ordersCollection.find({}).toArray();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// 路由 4: 获取产品数据
app.get('/products', async (req, res) => {
    try {
        const products = await productsCollection.find({}).toArray();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// 路由 5: 用户注册并保存到 Profile 集合
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }

    try {
        const newUser = { name, email, password };
        const result = await profileCollection.insertOne(newUser);
        res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user" });
    }
});

// 路由 6: 用户登录并验证密码
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // 查找用户
        const existingUser = await profileCollection.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ error: "Email not found" });
        }

        // 假设密码是经过哈希处理的，如果是的话，你需要验证密码
        const isPasswordValid = password === existingUser.password; // 替换为 bcrypt.compare 如果使用加密密码

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // 登录成功
        res.status(200).json({
            message: "Login successful",
            userId: existingUser._id, // 返回用户 ID 或其他需要的数据
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to login" });
    }
});

// Seller registration and saving to sellers collection
app.post('/api/seller/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }

    try {
        // Check if seller already exists
        const existingSeller = await sellersCollection.findOne({ email });

        if (existingSeller) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newSeller = { name, email, password: hashedPassword };

        // Save to the sellers collection
        const result = await sellersCollection.insertOne(newSeller);

        res.status(201).json({
            message: "Seller registered successfully",
            sellerId: result.insertedId,
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to register seller" });
    }
});

// Seller login and password validation
app.post('/api/seller/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Find the seller by email
        const existingSeller = await sellersCollection.findOne({ email });

        if (!existingSeller) {
            return res.status(400).json({ error: "Email not found" });
        }

        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password, existingSeller.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Login successful
        res.status(200).json({
            message: "Login successful",
            sellerId: existingSeller._id, // Return seller ID or other needed data
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to login" });
    }
});

// 启动服务器并连接数据库
const PORT = 5501;
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await initDatabase();
});
