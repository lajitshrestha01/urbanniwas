import express from 'express';
import getPropertiesByCity from '../controller/city.controller.js';
const router = express.Router();

router.get("/:city",getPropertiesByCity);

export default router;


