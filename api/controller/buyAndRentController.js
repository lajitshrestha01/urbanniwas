import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export const buyAndSale = async (req, res, forcedStatus = null) => {
//   try {
//     const { location, minPrice, maxPrice, propertyType, page = 1 } = req.query;
//     const limit = 7;
//     const skip = (page - 1) * limit;

//     let whereClause = {
//       ...(forcedStatus && { status: forcedStatus }),

//       ...(location?.trim() && {
//         city: {
//           contains: location.trim(),
//           mode: 'insensitive',
//         },
//       }),

//       ...(propertyType?.trim() && {
//         type: propertyType.trim(),
//       }),
//     };

//     // Price filtering logic
//     if (!isNaN(parseFloat(minPrice)) || !isNaN(parseFloat(maxPrice))) {
//       whereClause.price = {
//         ...(minPrice && !isNaN(parseFloat(minPrice)) && {
//           gte: Number(minPrice),
//         }),
//         ...(maxPrice && !isNaN(parseFloat(maxPrice)) && {
//           lte: Number(maxPrice),
//         }),
//       };
//     }

//     const properties = await prisma.property.findMany({
//       where: whereClause,
//       orderBy: { price: "desc" },
//       skip: Number(skip),
//       take: limit,
//     });

//     const total = await prisma.property.count({ where: whereClause });
//     const hasMore = skip + properties.length < total;

//     res.status(200).json({ properties, hasMore });
//   } catch (error) {
//     console.error("Error fetching properties:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const buyAndSale = async (req, res, forcedStatus = null) => {
  try {
    const { location, minPrice, maxPrice, propertyType, title, page = 1 } = req.query;
    const limit = 7;
    const skip = (page - 1) * limit;

    let whereClause = {
      ...(forcedStatus && { status: forcedStatus }),
      ...(location?.trim() && {
        city: {
          contains: location.trim(),
          mode: 'insensitive',
        },
      }),
      ...(propertyType?.trim() && {
        type: propertyType.trim(),
      }),
      ...(title?.trim() && {
        title: {
          contains: title.trim(),
          mode: 'insensitive',
        },
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
      orderBy: { price: 'desc' },
      skip: Number(skip),
      take: limit,
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

    const total = await prisma.property.count({ where: whereClause });
    const hasMore = skip + properties.length < total;

    res.status(200).json({ properties, hasMore });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};