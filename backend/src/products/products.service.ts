import { Injectable } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductQueryDto } from './dto/product-query.dto';

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

  async findAll(
    query: ProductQueryDto,
  ): Promise<{ products: Product[]; total: number }> {
    const where: Prisma.ProductWhereInput = {};

    if (query.category) {
      where.category = query.category;
    }
    if (query.minPrice || query.maxPrice) {
      where.price = {
        ...(query.minPrice ? { gte: Number(query.minPrice) } : {}),
        ...(query.maxPrice ? { lte: Number(query.maxPrice) } : {}),
      };
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const rows = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const products = rows.map(toProduct);
    return { products, total: products.length };
  }

  async getDeals(): Promise<Product[]> {
    const now = new Date();
    const rows = await this.prisma.product.findMany({
      where: {
        salePrice: { not: null },
        OR: [{ dealExpiresAt: null }, { dealExpiresAt: { gt: now } }],
      },
      orderBy: { dealExpiresAt: 'desc' },
    });
    return rows.map(toProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const p = await this.prisma.product.findUnique({
      where: { id },
    });
    return p ? toProduct(p) : null;
  }

  async getCategories(): Promise<string[]> {
    const result = await this.prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return result.map((r) => r.category);
  }
}
