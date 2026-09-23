import { Prisma } from '#generated/prisma/client.ts';
import { HttpException } from '../errors/http-exception.js';

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: '이미 사용 중인 값입니다.',
        });

      case 'P2003':
        return res.status(400).json({
          success: false,
          message: '연결된 리소스가 존재하지 않습니다.',
        });

      case 'P2025':
        return res.status(404).json({
          success: false,
          message: '요청한 리소스를 찾을 수 없습니다.',
        });
      default:
        break;
    }
  }

  res.status(500).json({
    message: 'Internal Server Error',
  });
};
