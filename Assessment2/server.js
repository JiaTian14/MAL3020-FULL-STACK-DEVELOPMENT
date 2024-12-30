const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const session = require('express-session');

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
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
        console.log('Connected to MongoDB');
    }
    return client;
}

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
    try {
        const { userId } = req.params;
        console.log('Received userId:', userId);

        // Check if the userId is valid
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User  ID is required'
            });
        }

        // Find the user by userId
        const user = await users.findOne({ userId: userId });
        console.log('Found user:', user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User  not found'
            });
        }

        // Find the cart for the user
        const cart = await carts.findOne({ userId: userId });
        console.log('Found cart:', cart);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Return the cart data
        return res.json({
            success: true,
            data: {
                cart,
                user: {
                    userId: user._id.toString(),
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Error retrieving cart data:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
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
// Register a new user
app.post('/api/register', asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new APIError(400, 'All fields are required.');
  }
    const client = await connectDB();
    const users = client.db("techmart").collection("users");
    const existingUser = await users.findOne({ email });
    if (existingUser) {
    throw new APIError(400, 'Email already in use.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
     // 保存用户
  const newUser = {
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

// User login
app.post('/api/users/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
    const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const client = await connectDB();
        const database = client.db("techmart");

        const users = database.collection("users");
        const profiles = database.collection("profiles");
        const carts = database.collection("carts");
        
        // 生成唯一 userId
        const userId = uuidv4();

        // 检查 email 是否已存在
        // const existingUser = await users.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Email already exists',
        //     });
        // }

        // 使用 bcrypt 比较密码
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validation:', isPasswordValid ? 'Valid' : 'Invalid');

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 创建用户
        const newUser = {
          userId,
          name,
          email,
          createdAt: new Date(),
      };
      await users.insertOne(newUser);

      // 在 profiles 集合中创建 profile 数据
      const newProfile = {
          userId,
          name,
          email,
          createdAt: new Date(),
          bio: '',
          avatar: '',
      };
      await profiles.insertOne(newProfile);

      // 在 carts 集合中初始化空购物车
      const newCart = {
          userId,
          products: [],
          createdAt: new Date(),
      };
      await carts.insertOne(newCart);

      res.status(201).json({
          success: true,
          message: 'User, profile, and cart created successfully',
          data: {
              user: newUser,
              profile: newProfile,
              cart: newCart,
          },
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

// 添加到购物车
app.post('/api/users/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const client = await connectDB();
        const database = client.db("techmart");
        const users = database.collection("users");
        
        // Find user by email
        const user = await users.findOne({ email });
        
        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validation:', isPasswordValid ? 'Valid' : 'Invalid');

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Prepare user data to send back (excluding sensitive information)
        const userData = {
            userId: user.userId,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        };

        // Send successful response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
});

// 更新购物车商品数量
app.post('/api/cart/:userId/update', async (req, res) => {
  try {
      const { userId } = req.params;
      const { productId, newQuantity } = req.body;

      // 输入验证
      if (!userId || !productId || typeof newQuantity !== 'number') {
          return res.status(400).json({
              success: false,
              message: 'Missing or invalid required fields'
          });
      }

      if (newQuantity < 0) {
          return res.status(400).json({
              success: false,
              message: 'Quantity cannot be negative'
          });
      }

      const client = await connectDB();
      const database = client.db("techmart");
      const carts = database.collection("carts");
      const products = database.collection("products");

      // 检查产品库存
      const product = await products.findOne({ _id: new ObjectId(productId) });
      if (!product) {
          return res.status(404).json({
              success: false,
              message: 'Product not found'
          });
      }

      if (newQuantity > product.stock) {
          return res.status(400).json({
              success: false,
              message: 'Requested quantity exceeds available stock'
          });
      }

      if (newQuantity === 0) {
          // 如果数量为0，删除商品
          await carts.updateOne(
              { userId },
              { 
                  $pull: { products: { productId } },
                  $set: { updatedAt: new Date() }
              }
          );
      } else {
          // 更新数量
          await carts.updateOne(
              { userId, "products.productId": productId },
              { 
                  $set: { 
                      "products.$.quantity": newQuantity,
                      updatedAt: new Date()
                  }
              }
          );
      }

      // 获取更新后的购物车
      const updatedCart = await carts.findOne({ userId });

      res.json({
          success: true,
          message: 'Cart updated successfully',
          data: updatedCart
      });

  } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({
          success: false,
          message: 'Error updating cart',
          error: error.message
      });
  }
});

// 从购物车中移除商品
app.delete('/api/cart/:userId/remove', async (req, res) => {
  try {
      const { userId } = req.params;
      const { productId } = req.body;

      // 输入验证
      if (!userId || !productId) {
          return res.status(400).json({
              success: false,
              message: 'User ID and Product ID are required'
          });
      }

      const client = await connectDB();
      const database = client.db("techmart");
      const carts = database.collection("carts");

      await carts.updateOne(
          { userId },
          { 
              $pull: { products: { productId } },
              $set: { updatedAt: new Date() }
          }
      );

      // 获取更新后的购物车
      const updatedCart = await carts.findOne({ userId });

      res.json({
          success: true,
          message: 'Product removed from cart successfully',
          data: updatedCart
      });

  } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({
          success: false,
          message: 'Error removing product from cart',
          error: error.message
      });
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
    const users = client.db("techmart").collection("users");
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

// 添加卖家注册路由
app.post('/api/sellers/register', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering seller'
        });
    }
});

// Use express-session middleware
app.use(session({
    secret: 'b896fc7c8b4e3b764cf45744bd24e02a99a03cd1b784209c1fc282e19a9b1b10',  // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true for HTTPS
}));

// 添加卖家登录路由
app.post('/api/sellers/login', asyncHandler(async (req, res) => {
  const client = await connectDB();
  const database = client.db("techmart");
  const sellers = database.collection("sellers");
  
  const { email, password } = req.body;

  // 查找卖家
  const seller = await sellers.findOne({ email });
  if (!seller) {
    throw new APIError(401, 'Invalid email or password');
  }

  // 验证密码
  const isValidPassword = await bcrypt.compare(password, seller.password);
  if (!isValidPassword) {
    throw new APIError(401, 'Invalid email or password');
  }

  // 不要在响应中包含密码
  const sellerWithoutPassword = { ...seller };
  delete sellerWithoutPassword.password;

// Save seller's ID in the session
req.session.sellerId = seller._id;

  res.json({
    success: true,
    message: 'Login successful'
  });
}));


// API endpoint to fetch dashboard data for the logged-in seller
app.get('/api/sellers/dashboard', async (req, res) => {
    const sellerId = req.session.sellerId;  // Assuming seller ID is stored in session
    
    if (!sellerId) {
        return res.status(401).json({ message: 'You are not logged in' });
    }

    try {
        const client = await connectDB();
        const database = client.db("techmart");

        const sellerObjectId = new ObjectId(sellerId);

        // Fetch total sales (sum of all order totals for this seller)
        const ordersCollection = database.collection('orders');
        const productsCollection = database.collection('products');

        const totalSalesResult = await ordersCollection.aggregate([
            { $match: { sellerId: sellerObjectId } },
            { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
        ]).toArray();
        const [totalOrders, totalProducts, distinctCustomers, recentOrders] = await Promise.all([
            ordersCollection.countDocuments({ sellerId: sellerObjectId }),
            productsCollection.countDocuments({ sellerId: sellerObjectId }),
            ordersCollection.distinct('customerName', { sellerId: sellerObjectId }),
            ordersCollection.find({ sellerId: sellerObjectId })
                .sort({ createdAt: -1 })
                .limit(5)
                .toArray()
        ]); 
        await client.close();

        // Send the dashboard data as a response
        res.json({
            totalSales: totalSalesResult[0]?.totalSales || 0,
            totalOrders,
            totalProducts,
            totalCustomers: distinctCustomers.length,
            recentOrders
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ 
            message: 'Failed to load dashboard data',
            error: error.message 
        });
    }
});

// Update product endpoint
app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category, image } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, stock, category, image },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
});


// DELETE a product by ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
});


app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);

        // Save the new product to the database
        const savedProduct = await newProduct.save();

        res.status(201).json({ success: true, data: savedProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Failed to add product' });
    }
});

// Get all orders for seller
app.get('/api/orders', asyncHandler(async (req, res) => {
    try {
        const client = await connectDB(); // Connect to DB
        const orders = client.db("techmart").collection("orders");
        const allOrders = await orders.find().toArray(); // Fetch all orders
        res.json(allOrders); // Send the orders as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
}));



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
