import { Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

function toProduct(p: {
  id: string;
  name: string;
  description: string;
  price: Prisma.Decimal;
  category: string;
  image: string;
  rating: Prisma.Decimal;
  inStock: boolean;
  features: string[];
  [key: string]: any;
}): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    image: p.image,
    rating: Number(p.rating),
    inStock: p.inStock,
    features: p.features,
    salePrice: p.salePrice !== null ? Number(p.salePrice) : null,
    dealExpiresAt:
      p.dealExpiresAt instanceof Date
        ? p.dealExpiresAt.toISOString()
        : (p.dealExpiresAt ?? null),
    sellerId: p.sellerId ?? null,
  };
}

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}
}
