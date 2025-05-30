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
import { conn } from './database/db.js';

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

// Initialize Express app
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    process.env.FRONTEND_URL || 'https://your-production-url.com' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
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

// Routes
import adminRoutes from './routes/admin.js';
import courseRoutes from './routes/course.js';
import questionRoutes from './routes/CourseQ.js';
import instructorRoutes from './routes/instructor.js';
import userRoutes from './routes/user.js';

app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);
app.use('/api', instructorRoutes);
app.use('/api', questionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    await conn();
    isConnected = true;
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

// For Vercel serverless functions
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  
  const startServer = async () => {
    try {
      await connectDB();
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