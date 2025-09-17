import { Request, Response } from "express";
import prisma from "../../db/prisma.js";

// Create category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name_of_category } = req.body;

    if (!name_of_category) {
      res.status(400).json({ message: "Category name is required" });
      return;
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name_of_category },
    });

    if (existingCategory) {
      res.status(400).json({ message: "Category already exists" });
      return;
    }

    const newCategory = await prisma.category.create({
      data: {
        name_of_category,
      },
    });

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error: any) {
    console.error("Error creating category:", error);
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// Get all categories
export const getAllCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    res.status(200).json(categories);
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Category ID is required" });
      return;
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Check if category has products
    const productsWithCategory = await prisma.products.findMany({
      where: { categoryId: parseInt(id) },
    });

    if (productsWithCategory.length > 0) {
      res.status(400).json({ 
        message: "Cannot delete category with existing products",
        productCount: productsWithCategory.length 
      });
      return;
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
