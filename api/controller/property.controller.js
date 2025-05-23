import prisma from '../lib/prisma.js';

// Create a new property
export const createProperty = async (req, res) => {
    const { title, description, price, city, address, images, latitude, longitude, bedrooms, bathrooms, area, type, status, agentId } = req.body;

    try {
        const property = await prisma.property.create({
            data: { title, description, price, city, address, images, bedrooms, latitude, longitude, bathrooms, area, type, status, agentId },
        });
        res.status(201).json(property);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(400).json({ message: 'Error creating property', error: error.message });
    }
};

// Get properties for a specific agent
// export const getProperties = async (req, res) => {
//     try {
//         const { agentId } = req.query; // Get agentId from query parameters
//         let properties;
//         if (agentId) {
//             properties = await prisma.property.findMany({
//                 where: { agentId },
//             });
//         } else {
//             properties = await prisma.property.findMany();
//         }

//         res.json(properties);
//     } catch (error) {
//         console.error('Error fetching properties:', error);
//         res.status(500).json({ message: 'Error fetching properties', error: error.message });
//     }
// };
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export const getProperties = async (req, res) => {
    console.log("first")
    try {
        const { agentId, title } = req.query; // Get agentId and title from query parameters

        let whereClause = {};

        // Add agentId filter if provided
        if (agentId) {
            whereClause.agentId = agentId;
        }

        // Add title search filter if provided
        if (title?.trim()) {
            whereClause.title = {
                contains: title.trim(),
                mode: 'insensitive',
            };
        }

        const properties = await prisma.property.findMany({
            where: whereClause,
            select: {
                id: true,
                title: true,
                price: true,
                type: true,
                status: true,
                city: true,
                bedrooms: true,
                bathrooms: true,
                agent: { select: { name: true, email: true } },
            },
        });

        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Error fetching properties', error: error.message });
    }
};


// Get a single property by ID
export const getProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await prisma.property.findUnique({
            where: { id },
            include: { agent: { select: { id: true, name: true, phoneNumber: true, agencyName: true, avatar: true } } },
        });


        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ message: 'Error fetching property', error: error.message });
    }
};

// Update a property
export const updateProperty = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, city, address, images, bedrooms, latitude, longitude, bathrooms, area, type, status } = req.body;
    console.log("Update prop data is ", req.body);
    try {
        const property = await prisma.property.update({
            where: { id },
            data: { title, description, price, city, address, images, bedrooms, latitude, longitude, bathrooms, area, type, status },
        });
        res.json(property);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(400).json({ message: 'Error updating property', error: error.message });
    }
};

// Delete a property
// export const deleteProperty = async (req, res) => {
//     const { id } = req.params;

//     try {
//         await prisma.property.delete({ where: { id } });
//         res.json({ message: 'Property deleted' });
//     } catch (error) {
//         console.error('Error deleting property:', error);
//         res.status(400).json({ message: 'Error deleting property', error: error.message });
//     }
// };
export const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if property exists
        const property = await prisma.property.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        // Check if user is admin
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'You are not allowed to delete this property' });
        }

        // Delete associated Favorite records
        await prisma.favorite.deleteMany({
            where: { propertyId: id },
        });

        // Delete the property
        await prisma.property.delete({ where: { id } });

        res.json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ success: false, message: 'Error deleting property', error: error.message });
    }
};