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

// Create Express app
const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development, specific ones in production
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'https://your-production-url.com',
        'http://localhost:3000',
        'http://localhost:3001'
      ].filter(Boolean);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    } else {
      return callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'token',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'LMS Backend Server is running on Vercel!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'LMS API is working',
    status: 'success',
    endpoints: {
      users: '/api/users',
      courses: '/api/courses', 
      admin: '/api/admin',
      instructor: '/api/instructor',
      questions: '/api/questions'
    }
  });
});

// Database connection with better error handling
let dbConnectionPromise = null;

const connectDB = async () => {
  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }
  
  dbConnectionPromise = (async () => {
    try {
      const { conn } = await import('./database/db.js');
      await conn();
      console.log('✅ Database connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      dbConnectionPromise = null; // Reset on failure
      throw new Error(`Database connection failed: ${error.message}`);
    }
  })();
  
  return dbConnectionPromise;
};

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    await connectDB();
    res.json({ 
      message: 'Database connection successful',
      status: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message,
      status: 'disconnected'
    });
  }
});

// Route loading with better error handling
let routesLoaded = false;
let routeLoadingPromise = null;

const loadRoutes = async () => {
  if (routesLoaded) return;
  if (routeLoadingPromise) return routeLoadingPromise;
  
  routeLoadingPromise = (async () => {
    try {
      console.log('🔄 Loading routes...');
      
      // Import all routes
      const [
        { default: userRoutes },
        { default: courseRoutes },
        { default: adminRoutes },
        { default: instructorRoutes },
        { default: questionRoutes }
      ] = await Promise.all([
        import('./routes/user.js').catch(e => ({ default: null, error: e })),
        import('./routes/course.js').catch(e => ({ default: null, error: e })),
        import('./routes/admin.js').catch(e => ({ default: null, error: e })),
        import('./routes/instructor.js').catch(e => ({ default: null, error: e })),
        import('./routes/CourseQ.js').catch(e => ({ default: null, error: e }))
      ]);

      // Mount routes with error checking
      if (userRoutes) app.use('/api', userRoutes);
      if (courseRoutes) app.use('/api', courseRoutes);
      if (adminRoutes) app.use('/api', adminRoutes);
      if (instructorRoutes) app.use('/api', instructorRoutes);
      if (questionRoutes) app.use('/api', questionRoutes);
      
      routesLoaded = true;
      console.log('✅ All routes loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading routes:', error);
      routeLoadingPromise = null; // Reset on failure
      throw error;
    }
  })();
  
  return routeLoadingPromise;
};

// API status endpoint
app.get('/api/status', async (req, res) => {
  try {
    const dbStatus = await connectDB().then(() => 'connected').catch(() => 'disconnected');
    const routeStatus = routesLoaded ? 'loaded' : 'not loaded';
    
    res.json({
      status: 'ok',
      database: dbStatus,
      routes: routeStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(err.status || 500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong on our end' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /api',
      'GET /api/status',
      'GET /api/test-db'
    ]
  });
});

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    // Initialize database and routes
    await Promise.all([
      connectDB(),
      loadRoutes()
    ]);
    
    // Handle the request through Express
    return app(req, res);
    
  } catch (error) {
    console.error('🚨 Handler initialization error:', error);
    
    return res.status(500).json({
      message: 'Server initialization failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Local development server
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  
  const startLocalServer = async () => {
    try {
      console.log('🚀 Starting local development server...');
      
      // Initialize everything
      await connectDB();
      await loadRoutes();
      
      // Start server
      app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/status`);
      });
      
    } catch (error) {
      console.error('❌ Failed to start local server:', error);
      process.exit(1);
    }
  };
  
  startLocalServer();
}