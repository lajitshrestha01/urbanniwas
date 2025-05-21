import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoute from './routes/auth.route.js';
import propertyRoutes from './routes/property.routes.js';
import userRoutes from './routes/agentProfile.js';
import agentRoutes from './routes/user.route.js';
import cityRoutes from './routes/city.routes.js';
import favoriteRoutes from './routes/favorites.routes.js';
import filterRoutes from './routes/filterPropery.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import messageRoutes from './routes/message.routes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout:20000,
  pingInterval:25000,
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/properties', propertyRoutes);
app.use('/api/filter', filterRoutes);
app.use('/api/user', userRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/properties/city', cityRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', (req, res, next) => {
  req.io = io; // Pass io to message routes
  next();
}, messageRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.join(socket.handshake.auth.userId); // Join user-specific room
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});