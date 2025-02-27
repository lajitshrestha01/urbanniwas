import prisma from '../lib/prisma.js';

// Create a new property
export const createProperty = async (req, res) => {
    const { title, description, price, city, address, images, bedrooms, bathrooms, area, type, status, agentId } = req.body;

    try {
        const property = await prisma.property.create({
            data: { title, description, price, city, address, images, bedrooms, bathrooms, area, type, status, agentId },
        });
        res.status(201).json(property);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(400).json({ message: 'Error creating property', error: error.message });
    }
};

// Get properties for a specific agent
export const getProperties = async (req, res) => {
    const { agentId } = req.query; // Get agentId from query parameters

    try {
        const properties = await prisma.property.findMany({
            where: agentId ? { agentId } : {}, // Fetch only agent-specific properties if agentId is provided
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
        const property = await prisma.property.findUnique({ where: { id } });

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
    const { title, description, price, city, address, images, bedrooms, bathrooms, area, type, status } = req.body;

    try {
        const property = await prisma.property.update({
            where: { id },
            data: { title, description, price, city, address, images, bedrooms, bathrooms, area, type, status },
        });
        res.json(property);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(400).json({ message: 'Error updating property', error: error.message });
    }
};

// Delete a property
export const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.property.delete({ where: { id } });
        res.json({ message: 'Property deleted' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(400).json({ message: 'Error deleting property', error: error.message });
    }
};
