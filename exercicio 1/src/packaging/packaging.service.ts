import { Injectable } from '@nestjs/common';
import { Box, Product, PackedBox, PackingResult } from '../interfaces/box.interface';

@Injectable()
export class PackagingService {
  private readonly availableBoxes: Box[] = [
    {
      id: 'Caixa 1',
      name: 'Caixa 1',
      dimensions: { altura: 30, largura: 40, comprimento: 80 },
      volume: 30 * 40 * 80,
    },
    {
      id: 'Caixa 2',
      name: 'Caixa 2',
      dimensions: { altura: 50, largura: 50, comprimento: 40 },
      volume: 50 * 50 * 40,
    },
    {
      id: 'Caixa 3',
      name: 'Caixa 3',
      dimensions: { altura: 50, largura: 80, comprimento: 60 },
      volume: 50 * 80 * 60,
    },
  ];


  processOrders(orders: any[]): { pedidos: PackingResult[] } {
    const results: PackingResult[] = [];

    for (const order of orders) {
      const products = this.prepareProducts(order.produtos);
      const packedBoxes = this.packProducts(products);
      
      results.push({
        pedido_id: order.pedido_id,
        caixas: packedBoxes,
      });
    }

    return { pedidos: results };
  }


  private prepareProducts(products: any[]): Product[] {
    return products.map(product => ({
      produto_id: product.produto_id,
      dimensoes: product.dimensoes,
      volume: product.dimensoes.altura * product.dimensoes.largura * product.dimensoes.comprimento,
    }));
  }


  private packProducts(products: Product[]): PackedBox[] {
    const packedBoxes: PackedBox[] = [];
    const remainingProducts = [...products];


    remainingProducts.sort((a, b) => b.volume - a.volume);

    while (remainingProducts.length > 0) {
      const bestFit = this.findBestBoxForProducts(remainingProducts);
      
      if (bestFit.box) {
        packedBoxes.push({
          caixa_id: bestFit.box.id,
          produtos: bestFit.products.map(p => p.produto_id),
        });


        bestFit.products.forEach(packedProduct => {
          const index = remainingProducts.findIndex(p => p.produto_id === packedProduct.produto_id);
          if (index > -1) {
            remainingProducts.splice(index, 1);
          }
        });
      } else {

        const product = remainingProducts.shift();
        packedBoxes.push({
          caixa_id: null,
          produtos: [product.produto_id],
          observacao: 'Produto não cabe em nenhuma caixa disponível.',
        });
      }
    }

    return packedBoxes;
  }


  private findBestBoxForProducts(products: Product[]): { box: Box | null; products: Product[] } {
    let bestFit: { box: Box | null; products: Product[] } = { box: null, products: [] };


    for (const box of this.availableBoxes) {
      const fittingProducts = this.findProductsThatFitInBox(products, box);
      
      if (fittingProducts.length > 0) {

        if (fittingProducts.length > bestFit.products.length ||
            (fittingProducts.length === bestFit.products.length && 
             this.calculateSpaceUtilization(fittingProducts, box) > 
             this.calculateSpaceUtilization(bestFit.products, bestFit.box))) {
          bestFit = { box, products: fittingProducts };
        }
      }
    }


    if (!bestFit.box && products.length > 0) {
      const firstProduct = products[0];
      const boxForSingleProduct = this.findBoxForSingleProduct(firstProduct);
      if (boxForSingleProduct) {
        bestFit = { box: boxForSingleProduct, products: [firstProduct] };
      }
    }

    return bestFit;
  }


  private findProductsThatFitInBox(products: Product[], box: Box): Product[] {
    const fittingProducts: Product[] = [];
    let remainingVolume = box.volume;


    for (const product of products) {
      if (this.productFitsInBox(product, box) && product.volume <= remainingVolume) {
        fittingProducts.push(product);
        remainingVolume -= product.volume;
      }
    }

    return fittingProducts;
  }


  private productFitsInBox(product: Product, box: Box): boolean {
    const productDims = [
      product.dimensoes.altura,
      product.dimensoes.largura,
      product.dimensoes.comprimento,
    ].sort((a, b) => a - b);

    const boxDims = [
      box.dimensions.altura,
      box.dimensions.largura,
      box.dimensions.comprimento,
    ].sort((a, b) => a - b);

    return productDims[0] <= boxDims[0] &&
           productDims[1] <= boxDims[1] &&
           productDims[2] <= boxDims[2];
  }


  private findBoxForSingleProduct(product: Product): Box | null {
    for (const box of this.availableBoxes) {
      if (this.productFitsInBox(product, box)) {
        return box;
      }
    }
    return null;
  }


  private calculateSpaceUtilization(products: Product[], box: Box | null): number {
    if (!box || products.length === 0) return 0;
    
    const totalProductVolume = products.reduce((sum, product) => sum + product.volume, 0);
    return totalProductVolume / box.volume;
  }
}
