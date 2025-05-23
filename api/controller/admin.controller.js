import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phoneNumber: true,
                agencyName: true,
            },
        });

        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


export const getAllProperties = async (req, res) => {
    try {
        const properties = await prisma.property.findMany({
            select: {
                id: true,
                title: true,
                price: true,
                type: true,
                status: true,
                bedrooms: true,
                bathrooms: true,
                agent: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                images: true
            },
        });
        res.json({ success: true, data: properties });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


export const updatePropertyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['FOR_SALE', 'FOR_RENT', 'SOLD', 'RENTED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const property = await prisma.property.update({
            where: { id },
            data: { status },
        });

        res.json({ success: true, data: property });
    } catch (error) {
        console.error('Error updating property status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            select: {
                id: true,
                date: true,
                timeSlot: true,
                status: true,
                property: {
                    select: {
                        title: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await prisma.property.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'You are not allowed to delete this property' });
        }

        await prisma.property.delete({ where: { id } });

        res.json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
