import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient; 

export const  getAgentDashbaord = async (req, res) =>{
    const {agentId} = req.params; 

    try {
        //fetch the agent with their properties

        const agent = await prisma.user.findUnique({
            where: {id: agentId},
            include:{properties: true},

        });
        if(!agent){
            return res.status(404).json({error: 'Agent not found'});
        }
        
        //calculate total properties
        const totalProperties = agent.properties.length;
        
        //calcualte total value of peroperties
        const totalValue = agent.properties.reduce((sum,property) => sum + property.price, 0);
        //calculate pending sales(for sale)
        const pendingSales = agent.properties.filter(property => property.status ==='FOR_SALE').length;

        //for recent properties 
        const recentProperties = agent.properties.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,3);

        res.json({
            totalProperties,
            totalValueOfProperty: totalValue, 
            pendingSales, 
            recentProperties, 
        });

    } catch (error) {

        res.status(500).json({error: 'Internal Server Error'});
        
    }


};