import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getPropertiesByCity = async (req, res) =>{
    const {city} = req.params; 
    try {
        const properties = await prisma.property.findMany({
            where: {
                city: {
                    contains: city,
                    mode: "insensitive",
                },
            },
        });
        res.json(properties)
    } catch (error) {
        console.error("Error fetching Properties!!", error);
        res.status(500).json({message: "Internal Server Error"});

        
    }


}

export default getPropertiesByCity;