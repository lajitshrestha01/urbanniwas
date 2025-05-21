import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

  // Create message
  export const createMessage = async (req, res) => {
    const { propertyId, receiverId, message } = req.body;
    const senderId = req.user.id;
    const io = req.io;

    if (!propertyId || !receiverId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        propertyId,
        message,
        seenBy: [senderId], // Sender sees it immediately
      },
      include: { 
        sender: { select: { id: true, email: true, name: true, avatar: true } },
        receiver: { select: { id: true, email: true, name: true, avatar: true } },
        property: { select: { id: true, title: true } },
      },
    });
    console.log({newMessage})

    io.to(senderId).emit('newMessage', newMessage);
    io.to(receiverId).emit('newMessage', newMessage);

    res.status(201).json(newMessage);
  };

  // Get messages for user
  export const getMessages = async (req, res) => {
    const userId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, email: true, name: true, avatar: true } },
        receiver: { select: { id: true, email: true, name: true, avatar: true } },
        property: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  };

  // Mark message as seen
  export const markMessageAsSeen = async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user.id;
    const io = req.io;

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: {
        seenBy: { push: userId },
      },
      include: { 
        sender: { select: { id: true, email: true, name: true, avatar: true } },
        receiver: { select: { id: true, email: true, name: true, avatar: true } },
        property: { select: { id: true, title: true } },
      },
    });

    io.to(updatedMessage.senderId).emit('messageSeen', updatedMessage);
    io.to(updatedMessage.receiverId).emit('messageSeen', updatedMessage);

    res.json(updatedMessage);
  };