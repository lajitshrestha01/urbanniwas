import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const  fillteredProperties = async (req,res) =>{
    try {
        //fetching properties grouped by status
        const propertiesForSale = await prisma.property.findMany({
            where: {status: "FOR_SALE"}, 
            orderBy: {price: "desc"},
        });

        const propertiesForRent = await prisma.property.findMany({
            where: {status: "FOR_RENT"},
            orderBy: {price: "desc"},
        });

        //defining the range for exclusive and premium listing 

        const rangeForSaleExclusive = Math.ceil(propertiesForSale.length * 1);
        const rangeForSalePremium = Math.ceil(propertiesForSale.length * 1);
        const rangeForRentExclusive = Math.ceil(propertiesForRent.length * 1);
        const rangeForRentPremium = Math.ceil(propertiesForRent.length * 1);

        //fetching recent properties(latest10)

        const recentproperties = await prisma.property.findMany({
            take: 10, 
            orderBy: {createdAt: "desc"},

        });

        //filtering exlcusive and premium properties based on pricer range 
        const exclusiveSale = propertiesForSale.slice(0,rangeForSaleExclusive);
        const premiumSale = propertiesForSale.slice(0,rangeForSalePremium);
        const exclusiveRent = propertiesForRent.slice(0,rangeForRentExclusive);
        const premiumRent = propertiesForSale.slice(0,rangeForRentPremium);

        res.status(200).json({
            exclusiveSale,
            premiumSale,
            exclusiveRent,
            premiumRent,
            recent: recentproperties, 
        })

        
    } catch (error) {

        console.log('Error fecthing filtered properties: ', error);
        res.status(500).json({error: "internal server error 404"});

        
    }


};

