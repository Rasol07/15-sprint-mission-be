import express from 'express';
import { products } from '../../data/productMockUpData.js';
import { Product } from '../models/product.model.js';
import { BadRequestException } from '../errors/bad-request-exception.js';

export const productRouter = express.Router();

// get
// {list : [], totalCount : Number}
productRouter.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);
    const standard = req.query.standard ?? 'recent';
    const keyword = req.query.keyword ?? '';

    if (page <= 0) {
      throw new BadRequestException('page는 1이상 이여야 합니다');
    }

    if (pageSize <= 0) {
      return res.status(400).json({
        message: 'pageSize는 1 이상이여야 합니다',
      });
    }

    if (!['recent', 'favorite'].includes(standard)) {
      return res.status(400).json({
        message: 'standard는 recent 혹은 favorite 이여야 합니다',
      });
    }

    if (keyword.length >= 25) {
      return res.status(400).json({
        message: 'keyword는 24자 이하여야 합니다',
      });
    }

    const products = await Product.find();

    res.status(200).json({
      list: products,
      totalCount: products.length,
    });
  } catch (error) {
    return next(error);
  }
});

productRouter.post('/', async (req, res, _next) => {
  const { name, description, price, tags } = req.body ?? {};
  // 값이 다 비어있는 경우 - 400
  if (!name && !description && !price && !tags) {
    return res.status(400).json({
      message: '입력란에 하나 이상 입력해주세요',
    });
  }

  const newProduct = new Product({ name, description, price, tags });
  await newProduct.save();

  res.status(201).json({
    list: newProduct,
  });
});
