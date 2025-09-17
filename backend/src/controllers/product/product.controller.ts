import { Request, Response } from "express";
import prisma from "../../db/prisma.js";
import { randomUUID } from "crypto";

// ✅ Create product
export const createproduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      barcode,
      product_name,
      description,
      price1,
      price2,
      price3,
      unitId,
      quantity,
      production_date,
      expiration_date,
      image_path,
      categoryId,
    } = req.body;

    // ✅ Validate unitId
    const unitRecord = unitId
      ? await prisma.unit.findUnique({ where: { id: Number(unitId) } })
      : null;

    if (!unitRecord) {
      res.status(400).json({ message: "Please select a valid unit." });
      return;
    }

    // ✅ Try creating product
    const newProduct = await prisma.products.create({
      data: {
        id: randomUUID(),
        barcode,
        product_name,
        description,
        price1: parseFloat(price1),
        price2: price2 ? parseFloat(price2) : undefined,
        price3: price3 ? parseFloat(price3) : undefined,
        unit: unitRecord.unit_name,
        quantity: Number(quantity),
        production_date: production_date ? new Date(production_date) : undefined,
        expiration_date: expiration_date ? new Date(expiration_date) : undefined,
        image_path,
        Unit: { connect: { id: Number(unitId) } },
        Category: { connect: { id: Number(categoryId) } },
      },
    });

    res.status(201).json({
      message: "✅ Product created successfully!",
      product: newProduct,
    });
  } catch (error: any) {
    console.error("Error creating product:", error);

    // ✅ Handle duplicate barcode error
    if (error.code === "P2002" && error.meta?.target?.includes("barcode")) {
      res.status(400).json({
        message: "⚠️ A product with this barcode already exists. Please use a different barcode.",
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong while creating the product. Please try again later.",
    });
  }
};

// ✅ Get all products
export const getallProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.products.findMany({
      include: { Unit: true, Category: true },
      orderBy: { created_at: "desc" },
    });

    res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ✅ Get one product
export const getoneProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    const product = await prisma.products.findUnique({
      where: { id },
      include: { Unit: true, Category: true },
    });

    if (!product) {
      res.status(404).json({ message: `No product found with ID: ${id}` });
      return;
    }

    res.status(200).json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ✅ Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      barcode,
      product_name,
      description,
      price1,
      price2,
      price3,
      quantity,
      production_date,
      expiration_date,
      image_path,
      unitId,
      categoryId,
    } = req.body;

    if (!id) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: `No product found with ID: ${id}` });
      return;
    }

    const updated = await prisma.products.update({
      where: { id },
      data: {
        barcode,
        product_name,
        description,
        price1: price1 !== undefined ? parseFloat(price1) : undefined,
        price2: price2 !== undefined ? parseFloat(price2) : undefined,
        price3: price3 !== undefined ? parseFloat(price3) : undefined,
        quantity,
        production_date: production_date ? new Date(production_date) : null,
        expiration_date: expiration_date ? new Date(expiration_date) : null,
        image_path,
        Unit: unitId ? { connect: { id: Number(unitId) } } : undefined,
        Category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
      },
      include: { Unit: true, Category: true },
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ✅ Delete product
export const deleteproduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    const deleted = await prisma.products.delete({ where: { id } });

    res.status(200).json({
      message: "Product deleted",
      product: deleted,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
