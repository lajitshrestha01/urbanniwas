import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getPropertiesByCity = async (req, res) => {
    const { city } = req.params;

    try {
        const { location, minPrice, maxPrice, propertyType, page = 1 } = req.query;
        const limit = 7;
        const skip = (page - 1) * limit;

        let whereClause = {
            city: {
                contains: city,
                mode: "insensitive",
            },

            ...(propertyType?.trim() && {
                type: propertyType.trim(),
            }),
        };

        // Price filtering logic
        if (!isNaN(parseFloat(minPrice)) || !isNaN(parseFloat(maxPrice))) {
            whereClause.price = {
                ...(minPrice && !isNaN(parseFloat(minPrice)) && {
                    gte: Number(minPrice),
                }),
                ...(maxPrice && !isNaN(parseFloat(maxPrice)) && {
                    lte: Number(maxPrice),
                }),
            };
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
        console.error("Error fetching properties:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// const {city} = req.params; 
// try {
//     const properties = await prisma.property.findMany({
//         where: {
//             city: {
//                 contains: city,
//                 mode: "insensitive",
//             },
//         },
//     });
//     res.json(properties)
// } catch (error) {
//     console.error("Error fetching Properties!!", error);
//     res.status(500).json({message: "Internal Server Error"});


// }



export default getPropertiesByCity;