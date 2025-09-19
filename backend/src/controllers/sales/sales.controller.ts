// sales.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all products (or filtered by sales if needed)
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { barcode } = req.params; // assuming barcode comes from URL param
    if (!barcode) {
      throw res.status(400).json({ error: "Barcode is required" });
    }

    const product = await prisma.products.findUnique({
      where: { barcode },
      include: {
        Unit: true,
        Category: true,
        Statuses: true,
      },
    });

    if (!product) {
      throw res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Add a product to sales
export const SaveClientSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_id, customer_name, items, discount = 0, paid_amount = 0 } = req.body;

    if (!items || items.length === 0) {
      throw res.status(400).json({ error: "No items to sell" });
    }

    // Ensure client exists (or create new)
    let client = null;
    if (customer_id) {
      client = await prisma.client.findUnique({ where: { customer_id } });
      if (!client) {
        client = await prisma.client.create({
          data: { customer_id, customer_name: customer_name || "Guest" },
        });
      }
    }

    let subtotal = 0;
    const saleItemsData: any[] = [];

    // Process items
    for (const item of items) {
      const product = await prisma.products.findUnique({ where: { barcode: item.barcode } });
      if (!product) throw res.status(404).json({ error: `Product ${item.barcode} not found` });
      if (product.quantity < item.quantity) throw res.status(400).json({ error: `Not enough stock for ${product.product_name}` });

      const total_price = product.price1.toNumber() * item.quantity;
      subtotal += total_price;

      saleItemsData.push({
        product_id: product.id,
        product_name: product.product_name,
        quantity: item.quantity,
        price: product.price1,
        total_price,
      });

      // Update product stock
      await prisma.products.update({
        where: { id: product.id },
        data: { quantity: product.quantity - item.quantity },
      });
    }

    const total = subtotal - discount;
    const debt = total - paid_amount;

    // Save client sale (bill)
    const clientSale = await prisma.client_sales.create({
      data: {
        customer_id: client?.customer_id || null,
        customer_name: customer_name || "Guest",
        subtotal,
        discount,
        total,
        debt,
        sale_date: new Date(),
        sale_time: new Date(),
        Items: { create: saleItemsData },
      },
      include: { Items: true },
    });

    // Record payment if any
    if (paid_amount > 0) {
      await prisma.client_sales.create({
        data: {
          ...(client?.customer_id && { customer_id: client.customer_id }),
          customer_name: customer_name || "Guest",
          subtotal,
          discount,
          total,
          debt,
          sale_date: new Date(),
          sale_time: new Date(),
          Items: { create: saleItemsData },
        },
        include: { Items: true },
      });      
    }

    res.status(201).json({ message: "Sale recorded successfully", bill: clientSale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save client sale" });
  }
};


export const updateProductSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { barcode } = req.body; // Use barcode to identify product
    if (!barcode) {
      throw res.status(400).json({ error: "Product barcode is required" });
    }

    const updateData: any = { ...req.body };
    delete updateData.barcode; // Remove barcode from update data

    // Convert dates if provided
    if (updateData.production_date) updateData.production_date = new Date(updateData.production_date);
    if (updateData.expiration_date) updateData.expiration_date = new Date(updateData.expiration_date);

    const updatedProduct = await prisma.products.update({
      where: { barcode },
      data: updateData,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};



export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { barcode } = req.body; // Use barcode to identify product
    if (!barcode) {
      throw res.status(400).json({ error: "Product barcode is required" });
    }

    await prisma.products.delete({
      where: { barcode },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

