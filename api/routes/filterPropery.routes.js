import express from 'express';
import { filteredProperties } from '../controller/filtercontroller.js';

const router = express.Router();

router.get("/filter-properties",filteredProperties);
export default router;