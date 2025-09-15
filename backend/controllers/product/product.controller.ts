import {Request, Response} from "express";
import prisma from "../../db/prisma.js";
import { randomUUID } from "crypto";


export const createproduct = async (req: Request, res: Response) => {
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
        categoryId
      } = req.body;
  
      // Resolve required unit name from unitId
      const unitRecord = req.body.unitId
        ? await prisma.unit.findUnique({ where: { id: parseInt(req.body.unitId) } })
        : null;

      if (!unitRecord) {
        throw res.status(400).json({ message: "Invalid or missing unitId" });
      }

      // Create product
      const newProduct = await prisma.products.create({
        data: {
          id: randomUUID(),
          barcode: req.body.barcode,
          product_name: req.body.product_name,
          description: req.body.description,
          price1: parseFloat(req.body.price1),
          price2: req.body.price2 ? parseFloat(req.body.price2) : undefined,
          price3: req.body.price3 ? parseFloat(req.body.price3) : undefined,
          unit: unitRecord.unit_name,
          quantity: parseInt(req.body.quantity),
          production_date: req.body.production_date ? new Date(req.body.production_date) : undefined,
          expiration_date: req.body.expiration_date ? new Date(req.body.expiration_date) : undefined,
          image_path: req.body.image_path,
      
          Unit: {
            connect: { id: parseInt(req.body.unitId) },
          },
          Category: {
            connect: { id: parseInt(req.body.categoryId) },
          },
        },
      });
  
      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (error: any) {
      console.error("Error creating product:", error);
      res.status(500).json({
        message: "Failed to create product",
        error: error.message,
      });
    }
}

export const getallProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.products.findMany({
          include: {
            Unit: true,      // include related unit info
            Category: true,  // include related category info
          },
          orderBy: {
            created_at: "desc", // newest first
          },
        });
    
        res.status(200).json(products);
    } catch (error: any) {
        console.error("Error fetching products:", error);
        res.status(500).json({
          message: "Failed to fetch products",
          error: error.message,
        });
    }
}

export const getoneProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        throw res.status(400).json({ message: "Product ID is required" });
      }
  
      const product = await prisma.products.findUnique({
        where: { id },
        include: {
          Unit: true,
          Category: true,
        },
      });
  
      if (!product) {
        throw res.status(404).json({ message: `No product found with ID: ${id}` });
      }
  
      // ✅ only one response here
       res.status(200).json(product);
  
    } catch (error: any) {
      console.error("Error fetching product:", error);
       res.status(500).json({
        message: "Failed to fetch product",
        error: error.message,
      });
    }
};
    
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // product id (UUID string)
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
          throw res.status(400).json({ message: "Product ID is required" });
        }
    
        // Check if product exists
        const existing = await prisma.products.findUnique({ where: { id } });
        if (!existing) {
          throw res.status(404).json({ message: `No product found with ID: ${id}` });
        }
    
        // Update
        const updated = await prisma.products.update({
          where: { id },
          data: {
            barcode,
            product_name,
            description,
            price1,
            price2,
            price3,
            quantity,
            production_date: production_date ? new Date(production_date) : null,
            expiration_date: expiration_date ? new Date(expiration_date) : null,
            image_path,
            Unit: unitId ? { connect: { id: Number(unitId) } } : undefined,
            Category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
          },
          include: {
            Unit: true,
            Category: true,
          },
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
}

export const deleteproduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        throw res.status(400).json({ message: "Product ID is required" });
      }
  
      const deleted = await prisma.products.delete({
        where: { id },
      });
  
      throw res.status(200).json({ message: "Product deleted", product: deleted });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw res.status(404).json({ message: "Product not found" });
      }
      throw res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};
  