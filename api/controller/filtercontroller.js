import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const filteredProperties = async (req, res) => {
  try {
    const propertiesForSale = await prisma.property.findMany({
      where: { status: "FOR_SALE" },
      orderBy: { price: "desc" },
    });

    const propertiesForRent = await prisma.property.findMany({
      where: { status: "FOR_RENT" },
      orderBy: { price: "desc" },
    });

    // Define slicing ranges (example: top 20% exclusive, next 30% premium)
    const saleExclusiveCount = Math.ceil(propertiesForSale.length * 0.2);
    const salePremiumCount = Math.ceil(propertiesForSale.length * 0.3);

    const rentExclusiveCount = Math.ceil(propertiesForRent.length * 0.2);
    const rentPremiumCount = Math.ceil(propertiesForRent.length * 0.3);

    const exclusiveSale = propertiesForSale.slice(0, saleExclusiveCount);
    const premiumSale = propertiesForSale.slice(
      saleExclusiveCount,
      saleExclusiveCount + salePremiumCount
    );

    const exclusiveRent = propertiesForRent.slice(0, rentExclusiveCount);
    const premiumRent = propertiesForRent.slice(
      rentExclusiveCount,
      rentExclusiveCount + rentPremiumCount
    );

    const recentproperties = await prisma.property.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      exclusiveSale,
      premiumSale,
      exclusiveRent,
      premiumRent,
      recent: recentproperties,
    });
  } catch (error) {
    console.log("Error fetching filtered properties:", error);
    res.status(500).json({ error: "internal server error 404" });
  }
};
