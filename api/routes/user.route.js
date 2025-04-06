import { Router } from "express"
import { getAgentDashbaord } from "../controller/agent.controller.js"

const router = Router();

router.get('/dashboard/:agentId', getAgentDashbaord);

export default router;