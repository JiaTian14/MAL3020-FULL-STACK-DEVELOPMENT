const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const CartModel = require('./Assessment2/models/cart');  // Update the path as needed

const { v4: uuidv4 } = require('uuid');

// First define the APIError class
class APIError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.name = 'APIError';
      this.statusCode = statusCode;
    }
  }
// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const uri = "mongodb+srv://Tan:1234@assessment.2jgmj.mongodb.net/?retryWrites=true&w=majority&appName=Assessment";
let client;

// Connect to MongoDB
async function connectDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    }
    return client;
}
// 在 Mongoose 连接选置中添加
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000
})
.then(() => {
    console.log('Connected to MongoDB Atlas');

    // 测试插入文档
    const testSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model('Test', testSchema);

    const testDoc = new TestModel({ name: 'Test Document' });
    return testDoc.save();
})
.then(() => {
    console.log('Test document saved');
    mongoose.connection.close(); // 关闭连接
})
.catch(err => {
    console.error('Connection error:', err);
});
  
// Helper function for error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ---------- GET Routes ----------
// Get default homepage
app.get('/', (req, res) => res.json({ message: 'Welcome to the E-commerce API' }));

// Get user orders
app.get('/api/orders/:userId', asyncHandler(async (req, res) => {
    const client = await connectDB();
    const orders = client.db("techmart").collection("orders");
    const userOrders = await orders.find({ userId: req.params.userId }).toArray();
    res.json(userOrders);
}));


// Get user's cart
app.get('/api/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log("Received userId:", userId); // Debugging line
    try {
        const cart = await CartModel.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found for this user ID' });
        }
        res.json({ success: true, data: cart });
    

      const ObjectId = require('mongodb').ObjectId;
    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid User ID format'
        });
    }

      const client = await connectDB();
      const database = client.db("techmart");
      const carts = database.collection("carts");
      const users = database.collection("users");

      // 查询购物车数据
     


      // Fetch cart and user data
      const user = await users.findOne({ userId });
      
      if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.json({
      success: true,
      data: {
          cart,
          user: {
              userId: user.userId,
              name: user.name,
              email: user.email
          }
      }
  });
} catch (error) {
  console.error('Error fetching cart:', error);
  res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
  });
}
});


// Get checkout details
app.get('/api/checkout', asyncHandler(async (req, res) => {
    // Placeholder data for checkout
    res.json({ message: 'Checkout details here.' });
}));

// Get order history
app.get('/api/orderHistory', asyncHandler(async (req, res) => {
    const client = await connectDB();
    const orders = client.db("techmart").collection("orders");
    const allOrders = await orders.find().toArray();
    res.json(allOrders);
}));

// Get specific order
app.get('/api/orderHistory/:orderId', asyncHandler(async (req, res) => {
    const client = await connectDB();
    const orders = client.db("techmart").collection("orders");
    const order = await orders.findOne({ _id: new ObjectId(req.params.orderId) });
    if (!order) throw new Error('Order not found');
    res.json(order);
}));

// Get user profile
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }  
    const client = await connectDB();
    const database = client.db("techmart");

    const profiles = database.collection("profiles");

    // Fetch profile and user data
    const profile = await profiles.findOne({ userId });
        
    if (!profile) {
      return res.status(404).json({
          success: false,
          message: 'Profile not found'
      });
  }

  res.json({
      success: true,
      data: profile,
          
  });
} catch (error) {
  console.error('Error fetching profile:', error);
  res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
  });
}
});

// 修改获取所有产品的路由
app.get('/api/products', async (req, res) => {
    try {
        console.log('Fetching products...');
        const client = await connectDB();
        const database = client.db("techmart");
        const products = database.collection("products");

        // 获取所有产品
        const allProducts = await products.find({}).toArray();
        console.log(`Found ${allProducts.length} products`);

        // 如果没有产品，添加示例产品
        if (allProducts.length === 0) {
            const sampleProducts = [
                {
                    name: "Gaming Laptop",
                    category: "Laptops",
                    price: 1499.99,
                    stock: 10,
                    description: "High-performance gaming laptop",
                    image: "https://via.placeholder.com/300x250"
                },
                {
                    name: "iPhone 15",
                    category: "Phones",
                    price: 999.99,
                    stock: 15,
                    description: "Latest iPhone with advanced features",
                    image: "https://via.placeholder.com/300x250"
                },
                {
                    name: "Sony WH-1000XM4",
                    category: "Audio",
                    price: 349.99,
                    stock: 20,
                    description: "Premium wireless noise-cancelling headphones",
                    image: "https://via.placeholder.com/300x250"
                },
                {
                    name: "iPad Pro",
                    category: "Tablets",
                    price: 799.99,
                    stock: 12,
                    description: "Powerful tablet for professionals",
                    image: "https://via.placeholder.com/300x250"
                },
                {
                    name: "MacBook Air",
                    category: "Laptops",
                    price: 1299.99,
                    stock: 8,
                    description: "Thin and light laptop with M2 chip",
                    image: "https://via.placeholder.com/300x250"
                }
            ];

            await products.insertMany(sampleProducts);
            console.log('Added sample products');
            
            // 重新获取产品列表
            const updatedProducts = await products.find({}).toArray();
            return res.json({
                success: true,
                data: updatedProducts
            });
        }

        // 返回找到的产品
        return res.json({
            success: true,
            data: allProducts
        });

    } catch (error) {
        console.error('Error in /api/products:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
});

// 添加获取单个产品的路由
app.get('/api/products/:id', async (req, res) => {
    try {
        const client = await connectDB();
        const database = client.db("techmart");
        const products = database.collection("products");

        const product = await products.findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
});

// ---------- POST Routes ----------
// User registration endpoint
app.post('/api/users/register', asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      throw new APIError(400, 'All fields are required.');
    }
  
    const client = await connectDB();
    const database = client.db("techmart");
    const users = database.collection("users");
  
    // 检查是否已有相同的 email
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      throw new APIError(400, 'Email already in use.');
    }
  
    // 哈希处理密码
    const hashedPassword = await bcrypt.hash(password, 10);
  
     // Generate a unique userId
     const userId = uuidv4();

    // 保存用户
    const newUser = {
      userId,  
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  
    const result = await users.insertOne(newUser);
  
    res.json({
      success: true,
      message: 'User registered successfully.',
      data: { id: result.insertedId, username, email },
    });
  }));
  
//post user Login
app.post('/api/users/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email); // Debug log

    if (!email || !password) {
        throw new APIError(400, 'Email and password are required.');
    }

    try {
    const client = await connectDB();
    const database = client.db("techmart");
    const users = database.collection("users");

    // 在数据库中查找用户
    const user = await users.findOne({ email });
    
    if (!user) {
        throw new APIError(404, 'User not found.');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new APIError(401, 'Invalid password.');
    }

    // Successful login response
    console.log('Login successful, sending response...');
    res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
      },
    });
} catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
        success: false,
        error: 'An error occurred during login'
    });
}
  }));
// Error handling middleware - place this after all routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (err instanceof APIError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    } else {
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});  


// 添加卖家注册路由
app.post('/api/seller/register', asyncHandler(async (req, res) => {
    const client = await connectDB();
    const database = client.db("techmart");
    const sellers = database.collection("sellers");

    const { name, email, password } = req.body;

    // 验证必填字段
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    // 检查邮箱是否已存在
    const existingSeller = await sellers.findOne({ email });
    if (existingSeller) {
        return res.status(400).json({
            success: false,
            message: 'Email already registered'
        });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新卖家
    const newSeller = {
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // 保存到数据库
    await sellers.insertOne(newSeller);

    // 返回成功消息（不包含密码）
    const sellerWithoutPassword = { ...newSeller };
    delete sellerWithoutPassword.password;

    res.status(201).json({
        success: true,
        message: 'Seller registered successfully',
        seller: sellerWithoutPassword
    });
}));

// 添加卖家登录路由
app.post('/api/seller/login', asyncHandler(async (req, res) => {
    console.log('Login request received:', req.body);  // Add this line to log the incoming request data

    const client = await connectDB();
    const database = client.db("techmart");
    const sellers = database.collection("sellers");

    const { email, password } = req.body;

    
    // 验证必填字段
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    // 查找卖家
    const seller = await sellers.findOne({ email });
    if (!seller) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, seller.password);
    if (!isValidPassword) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    // 不要在响应中包含密码
    const sellerWithoutPassword = { ...seller };
    delete sellerWithoutPassword.password;

    res.status(200).json({
        success: true,
        message: 'Login successful',
        seller: sellerWithoutPassword
    });
}));



// 添加到购物车
app.post('/api/cart/:userId/add', async (req, res) => {
  try {
      const { userId } = req.params;
      const { productId, quantity } = req.body;

      // 输入验证
      if (!userId || !productId || !quantity) {
          return res.status(400).json({
              success: false,
              message: 'Missing required fields: userId, productId, or quantity'
          });
      }

      if (quantity <= 0) {
          return res.status(400).json({
              success: false,
              message: 'Quantity must be greater than 0'
          });
      }

      const client = await connectDB();
      const database = client.db("techmart");
      const carts = database.collection("carts");
      const products = database.collection("products");

      // 获取产品信息
      const product = await products.findOne({ _id: new ObjectId(productId) });
      if (!product) {
          return res.status(404).json({
              success: false,
              message: 'Product not found'
          });
      }

      // 检查库存
      if (product.stock < quantity) {
          return res.status(400).json({
              success: false,
              message: 'Not enough stock available'
          });
      }

      // 检查购物车是否存在
      let cart = await carts.findOne({ userId });
      
      if (!cart) {
          cart = {
              userId,
              products: [],
              createdAt: new Date(),
              updatedAt: new Date()
          };
      }

      // 检查产品是否已在购物车中
      const existingProductIndex = cart.products.findIndex(p => p.productId === productId);

      if (existingProductIndex !== -1) {
          // 更新现有产品数量
          const newQuantity = cart.products[existingProductIndex].quantity + quantity;
          
          if (newQuantity > product.stock) {
              return res.status(400).json({
                  success: false,
                  message: 'Cannot add more items than available in stock'
              });
          }

          await carts.updateOne(
              { userId, "products.productId": productId },
              { 
                  $inc: { "products.$.quantity": quantity },
                  $set: { updatedAt: new Date() }
              }
          );
      } else {
          // 添加新产品
          const cartProduct = {
              productId,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category,
              quantity,
              stock: product.stock
          };

          await carts.updateOne(
              { userId },
              { 
                  $push: { products: cartProduct },
                  $set: { updatedAt: new Date() },
                  $setOnInsert: { createdAt: new Date() }
              },
              { upsert: true }
          );
      }

      // 获取更新后的购物车
      const updatedCart = await carts.findOne({ userId });

      res.json({
          success: true,
          message: 'Product added to cart successfully',
          data: updatedCart
      });

  } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({
          success: false,
          message: 'Error adding to cart',
          error: error.message
      });
  }
});

// 更新购物车商品数量
app.post('/api/cart/:userId/update', async (req, res) => {
      const { userId } = req.params;
      const { productId, newQuantity } = req.body;

      try {
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const product = cart.products.find(p => p.productId.toString() === productId);
        if (product) {
            product.quantity = quantity;
            await cart.save();
            return res.json({ success: true });
        }

        return res.status(404).json({ success: false, message: 'Product not found in cart' });
    } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ success: false, message: 'Failed to update cart' });
    }
});

// 从购物车中移除商品
app.post('/api/cart/:userId/remove', async (req, res) => {
      const { userId } = req.params;
      const { productId } = req.body;

      try {
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();
        return res.json({ success: true });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
    }
});

// Submit checkout
app.post('/api/checkout/submit', asyncHandler(async (req, res) => {
    const client = await connectDB();
    const orders = client.db("techmart").collection("orders");
    const result = await orders.insertOne(req.body);
    res.json({ message: 'Order submitted successfully', orderId: result.insertedId });
}));

// Update profile
app.post('/api/profile/update', async (req, res) => {
    try {
        const { userId, updateData } = req.body;
        console.log('Updating profile for user:', userId);
        console.log('Update data:', updateData);

        const client = await connectDB();
        const database = client.db("techmart");
        const users = database.collection("users");
        const profiles = database.collection("profiles");

        // 如果包含密码，需要加密
        if (updateData.password && updateData.password.trim() !== '') {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(updateData.password, salt);
          updateData.password = hashedPassword;
      } else {
          // 如果密码为空，删除密码字段
          delete updateData.password;
      }

        // 确保 userId 是有效的 ObjectId
        const userObjectId = new ObjectId(userId);

        // 更新用户数据
        const result = await users.findOneAndUpdate(
            { _id: userObjectId },
            { 
              $set: {
                  ...updateData,
                  updatedAt: new Date()
              }
          },
          { returnDocument: 'after' } // 返回更新后的文档
        );

        if (!result.value) {
          console.log('User not found:', userId);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

         // 返回更新后的用户数据（不包含密码）
         const updatedUser = result.value;
         delete updatedUser.password;
 
         console.log('Profile updated successfully:', updatedUser);

         
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating profile: ' + error.message
        });
    }
});

// Change password
app.post('/api/profile/changePassword', asyncHandler(async (req, res) => {
    const client = await connectDB();
    const database = client.db("techmart");
    const users = database.collection("users");
    const profiles = database.collection("profiles");
    const { userId, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await users.updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } });
    res.json({ message: 'Password changed successfully' });
}));


app.post('/api/users', async (req, res) => {
    try {
        const {name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required user information'
            });
        }

        const client = await connectDB();
        const database = client.db("techmart");

        // Collections
        const users = database.collection("users");
        const profiles = database.collection("profiles");
        const carts = database.collection("carts");

        // Generate userId - This can be a unique identifier (using MongoDB's ObjectId or custom ID generation)
        const userId = new ObjectId().toString(); // If using MongoDB ObjectId

        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        const newUser = {name, email, createdAt: new Date() };
        await users.insertOne(newUser);

        res.status(201).json({
          success: true,
          data: { user: result.ops[0] },
      });

      // Create cart for the user
      const newCart = {
        userId: userId,
        products: [],
        createdAt: new Date()
    };
    await carts.insertOne(newCart);

    // Create profile for the user
    const newProfile = {
        userId: userId,
        name,
        email,
        createdAt: new Date(),
        avatar: ''
    };
    await profiles.insertOne(newProfile);

    res.status(201).json({
            success: true,
            message: 'User, cart, and profile created successfully',
            data: {
                user: newUser,
                cart: newCart,
                profile: newProfile
            }
        });
        
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
          success: false,
          message: 'Error creating user',
          error: error.message,
      });
  }
});


// ---------- Error Handling ----------
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: err.message });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;

// 在服务器启动时添加示例产品
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});
