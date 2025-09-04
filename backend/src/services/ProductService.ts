import { EntityManager } from '@mikro-orm/core';
import { Product } from '../entities/Product';

export class ProductService {
  constructor(private em: EntityManager) {}

  async getAllProducts() {
    return await this.em.find(Product, {});
  }

  async getProductById(id: number) {
    return await this.em.findOne(Product, { id });
  }

  async createProduct(productData: Partial<Product>) {
    const product = new Product(
      productData.name!,
      productData.price!,
      productData.stock,
      productData.category!,
      productData.description,
      productData.imageUrl,
    );
    
    await this.em.persistAndFlush(product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<Product>) {
    const product = await this.em.findOne(Product, { id });
    if (!product) {
      throw new Error('Product not found');
    }

    if (productData.name) product.name = productData.name;
    if (productData.description) product.description = productData.description;
    if (productData.price) product.price = productData.price;
    if (productData.stock !== undefined) product.stock = productData.stock;
    if (productData.imageUrl) product.imageUrl = productData.imageUrl;
    if (productData.category) product.category = productData.category;

    await this.em.flush();
    return product;
  }

  async deleteProduct(id: number) {
    const product = await this.em.findOne(Product, { id });
    if (!product) {
      throw new Error('Product not found');
    }

    await this.em.removeAndFlush(product);
    return { message: 'Product deleted successfully' };
  }
}