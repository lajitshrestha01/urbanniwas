import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create booking
export const createBooking = async (req, res) => {
  const { propertyId, date, timeSlot } = req.body;
  const userId = req.user.id;

  if (!propertyId || !date || !timeSlot) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      propertyId,
      date: new Date(date),
      timeSlot,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  });

  if (existingBooking) {
    return res.status(400).json({ error: 'Time slot unavailable' });
  }

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      propertyId,
      date: new Date(date),
      timeSlot,
      status: 'PENDING',
    },
    include: { property: true, user: true },
  });

  res.status(201).json(booking);
};

// Get bookings for user
export const getUserBookings = async (req, res) => {
  const userId = req.user.id;
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(bookings);
};

// Get bookings for agent
export const getAgentBookings = async (req, res) => {
  const agentId = req.user.id;
  const bookings = await prisma.booking.findMany({
    where: { property: { agentId } },
    include: { property: true, user: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(bookings);
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const agentId = req.user.id;

  if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { property: true },
  });

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (booking.property.agentId !== agentId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { status },
    include: { property: true, user: true },
  });

  res.json(updatedBooking);
};

// Cancel booking (user or agent)
export const cancelBooking = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { property: true },
  });

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (booking.userId !== userId && booking.property.agentId !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await prisma.booking.delete({ where: { id } });
  res.status(204).send();
};
