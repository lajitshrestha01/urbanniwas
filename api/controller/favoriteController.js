import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addFavorite = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.role !== 'CLIENT') {
      return res.status(403).json({ message: 'Only clients can favorite properties' });
    }

    const exists = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });
    if (exists) return res.status(400).json({ message: 'Already favorited' });

    await prisma.favorite.create({
      data: { userId, propertyId },
    });
    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFavorite = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user.id;

  try {
    await prisma.favorite.delete({
      where: { userId_propertyId: { userId, propertyId } },
    });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFavorites = async (req, res) => {
  const userId = req.user.id;
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            city: true,
            images: true,
          },
        },
      },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};