import express from 'express';
import { createProperty, getProperties, getProperty, updateProperty, deleteProperty } from '../controller/property.controller.js';
import { buyAndSale } from '../controller/buyAndRentController.js';

const router = express.Router();

router.post('/', createProperty);
router.get('/',getProperties);
router.get("/buy",(req, res) => buyAndSale(req, res, "FOR_SALE"));
router.get("/rent",(req, res) => buyAndSale(req, res, "FOR_RENT"));
router.put('/edit/:id', updateProperty);
router.delete('/:id', deleteProperty);
router.get('/:id', getProperty);



export default router;