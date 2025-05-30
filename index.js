// import { v2 as cloudinary } from 'cloudinary';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import express from 'express';
// import Razorpay from 'razorpay';
// import { conn } from './database/db.js';

// // Load environment variables
// dotenv.config();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Razorpay instance
// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middlewares
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' ? 'https://your-production-url.com' : '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
// }));
// app.use(express.json({ limit: '10mb' })); // For JSON payloads
// app.use(express.urlencoded({ limit: '10mb', extended: true })); // For form data

// // Health check endpoint
// app.get('/', (req, res) => {
//   res.send('Server is working');
// });

// // Routes
// import adminRoutes from './routes/admin.js';
// import courseRoutes from './routes/course.js';
// import questionRoutes from './routes/CourseQ.js';
// import instructorRoutes from './routes/instructor.js';
// import userRoutes from './routes/user.js';


// app.use('/api', userRoutes);
// app.use('/api', courseRoutes);
// app.use('/api', adminRoutes);
// app.use("/api",instructorRoutes)
// app.use("/api",questionRoutes)


// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Server error:', err.stack);
//   res.status(500).json({ message: 'Internal Server Error', error: err.message });
// });

// // Start server and connect to DB
// const startServer = async () => {
//   try {
//     await conn();
//     console.log('Database connected');
//     app.listen(PORT, () => {
//       console.log(`Server running @ http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// startServer();





// import { v2 as cloudinary } from 'cloudinary';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import express from 'express';
// import Razorpay from 'razorpay';
// import serverless from 'serverless-http';
// import { conn } from './database/db.js';

// // Load environment variables
// dotenv.config();

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Razorpay
// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' ? 'https://your-production-url.com' : '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// // Routes
// import adminRoutes from './routes/admin.js';
// import courseRoutes from './routes/course.js';
// import questionRoutes from './routes/CourseQ.js';
// import instructorRoutes from './routes/instructor.js';
// import userRoutes from './routes/user.js';

// app.get('/', (req, res) => {
//   res.send('Server is working');
// });

// app.use('/api', userRoutes);
// app.use('/api', courseRoutes);
// app.use('/api', adminRoutes);
// app.use('/api', instructorRoutes);
// app.use('/api', questionRoutes);

// // Error handler
// app.use((err, req, res, next) => {
//   console.error('Server error:', err.stack);
//   res.status(500).json({ message: 'Internal Server Error', error: err.message });
// });

// // Database connection - moved outside handler for connection reuse
// let isConnected = false;

// const connectDB = async () => {
//   if (!isConnected) {
//     try {
//       await conn();
//       isConnected = true;
//       console.log('Database connected');
//     } catch (error) {
//       console.error('Database connection failed:', error);
//       throw error;
//     }
//   }
// };

// // Lambda handler
// const handler = async (event, context) => {
//   // Ensure database connection
//   await connectDB();
  
//   // Use serverless-http to wrap Express app
//   const serverlessHandler = serverless(app);
//   return await serverlessHandler(event, context);
// };

// // Export both named and default for flexibility
// export { handler };
// export default handler;

import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import Razorpay from 'razorpay';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Razorpay instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Database connection handling
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    // Import database connection dynamically to avoid issues
    const { conn } = await import('./database/db.js');
    cachedDb = await conn();
    console.log('Database connected successfully');
    return cachedDb;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}

// Initialize Express app
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://your-production-url.com']
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Dynamic route imports to avoid circular dependency issues
const setupRoutes = async () => {
  try {
    const [
      { default: userRoutes },
      { default: courseRoutes },
      { default: adminRoutes },
      { default: instructorRoutes },
      { default: questionRoutes }
    ] = await Promise.all([
      import('./routes/user.js'),
      import('./routes/course.js'),
      import('./routes/admin.js'),
      import('./routes/instructor.js'),
      import('./routes/CourseQ.js')
    ]);

    app.use('/api', userRoutes);
    app.use('/api', courseRoutes);
    app.use('/api', adminRoutes);
    app.use('/api', instructorRoutes);
    app.use('/api', questionRoutes);
  } catch (error) {
    console.error('Error setting up routes:', error);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

// Handle 404 for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Vercel serverless handler
const handler = async (req, res) => {
  try {
    // Ensure database connection
    await connectToDatabase();
    
    // Setup routes if not already done
    await setupRoutes();
    
    // Handle the request
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      message: 'Server initialization failed',
      error: error.message
    });
  }
};

// Export for Vercel
export default handler;

// For local development
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  
  const startServer = async () => {
    try {
      await connectToDatabase();
      await setupRoutes();
      
      app.listen(PORT, () => {
        console.log(`Server running @ http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}