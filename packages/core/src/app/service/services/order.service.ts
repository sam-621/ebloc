import { ValidationError } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateOrderLineInput,
  ListInput,
  UpdateOrderLineInput,
} from '@/app/api/common';
import {
  ID,
  OrderEntity,
  OrderLineEntity,
  VariantEntity,
} from '@/app/persistance';
import { UserInputError } from '@/lib/errors';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderLineEntity)
    private orderLineRepository: Repository<OrderLineEntity>,
    @InjectRepository(VariantEntity)
    private variantRepository: Repository<VariantEntity>,
  ) {}

  async find(input: ListInput) {
    return await this.orderRepository.find({
      skip: input?.skip,
      take: input?.take,
    });
  }

  async findUnique(id: ID, code: string) {
    if (id) {
      return this.findById(id);
    }

    if (code) {
      return this.findByCode(code);
    }

    throw new UserInputError('No ID or CODE provided');
  }

  async findLines(orderId: ID) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { lines: true },
    });

    return order.lines;
  }

  async findVariantInLine(orderLineId: ID) {
    const orderLine = await this.orderLineRepository.findOne({
      where: { id: orderLineId },
      relations: { productVariant: true },
    });

    return orderLine.productVariant;
  }

  async findCustomer(orderId: ID) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { customer: true },
    });

    return order.customer;
  }

  async create() {
    const ordersCount = await this.orderRepository.count();
    const order = this.orderRepository.create({
      code: String(ordersCount + 1),
    });

    return await this.orderRepository.save(order);
  }

  // TODO: When adding a line, check if the variant is already in the order and update the quantity
  async addLine(orderId: ID, input: CreateOrderLineInput) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: { lines: true },
    });

    const variant = await this.variantRepository.findOne({
      where: { id: input.productVariantId },
    });

    if (variant.stock < input.quantity) {
      throw new ValidationError('Not enough stock');
    }

    const unitPrice = variant.price;
    const linePrice = unitPrice * input.quantity;

    const orderLine = this.orderLineRepository.create({
      ...input,
      productVariant: variant,
      unitPrice,
      linePrice,
    });

    const orderLineSaved = await this.orderLineRepository.save(orderLine);

    order.lines = [...order.lines, orderLineSaved];

    return this.recalculateOrderStats(order);
  }

  async removeLine(orderLineId: ID) {
    const orderLine = await this.orderLineRepository.findOne({
      where: { id: orderLineId },
      relations: { order: { lines: true } },
    });

    if (!orderLine) {
      throw new UserInputError('Order line not found');
    }

    await this.orderLineRepository.delete(orderLine.id);

    const order = orderLine.order;
    order.lines = [...order.lines.filter((line) => line.id !== orderLineId)];

    return this.recalculateOrderStats(order);
  }

  async updateLine(lineId: ID, input: UpdateOrderLineInput) {
    const orderLine = await this.orderLineRepository.findOne({
      where: { id: lineId },
      relations: { order: { lines: true }, productVariant: true },
    });

    if (!orderLine) {
      throw new UserInputError('Order line not found');
    }

    const newLineQuantity = input.quantity + orderLine.quantity;
    const variant = orderLine.productVariant;

    if (variant.stock < newLineQuantity) {
      throw new ValidationError('Not enough stock');
    }

    const unitPrice = variant.price;
    const linePrice = unitPrice * input.quantity;

    const updatedOrderLine = this.orderLineRepository.create({
      ...orderLine,
      ...input,
      unitPrice,
      linePrice,
      quantity: newLineQuantity,
    });

    await this.orderLineRepository.save(updatedOrderLine);

    const order = orderLine.order;

    order.lines = order.lines.map((line) =>
      line.id === lineId ? updatedOrderLine : line,
    );

    return this.recalculateOrderStats(order);
  }

  /**
   * Apply price and quantity adjustments to the order after an update
   */
  private async recalculateOrderStats(order: OrderEntity) {
    const total = order.lines.reduce((acc, line) => acc + line.linePrice, 0);
    const subtotal = order.lines.reduce((acc, line) => acc + line.linePrice, 0);
    const totalQuantity = order.lines.reduce(
      (acc, line) => acc + line.quantity,
      0,
    );

    return await this.orderRepository.save({
      ...order,
      total,
      subtotal,
      totalQuantity,
    });
  }

  private async findById(id: ID) {
    return this.orderRepository.findOne({ where: { id } });
  }

  private async findByCode(code: string) {
    return this.orderRepository.findOne({ where: { code } });
  }
}
