// buyandsale.controller.js (updated)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const buyAndSale = async (req, res, forcedStatus = null) => {
  try {
    const {location, minPrice, maxPrice, propertyType, page = 1} = req.query;
    const limit = 7; // 7 properties per page
    const skip = (page - 1) * limit;

    let whereClause = {
      ...(forcedStatus && { status: forcedStatus }),
    };
    
    // Handle location (case-insensitive regex)
    if (location && location.trim()) {
      whereClause.city = { $regex: new RegExp(location, "i") };
    }
    
    // Handle price range (both minPrice and maxPrice)
    if (minPrice && !isNaN(parseFloat(minPrice))) {
      whereClause.price = { ...whereClause.price, $gte: Number(minPrice) };
    }
    
    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      whereClause.price = { ...whereClause.price, $lte: Number(maxPrice) };
    }
    
    // Handle property type
    if (propertyType && propertyType.trim()) {
      whereClause.type = propertyType;
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      orderBy: { price: "desc" },
      skip: Number(skip),
      take: limit,
    });

    const total = await prisma.property.count({ where: whereClause });
    const hasMore = skip + properties.length < total;

    res.status(200).json({ properties, hasMore });
  } catch (error) {
    console.log("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};