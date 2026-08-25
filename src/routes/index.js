import express from 'express';
import { productRouter } from './products_route.js';
export const router = express.Router();

router.use('/products', productRouter);
