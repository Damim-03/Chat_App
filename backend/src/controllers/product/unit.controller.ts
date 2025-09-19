import { Request, Response } from "express";
import prisma from "../../db/prisma.js";
import { randomUUID } from "crypto";

// Create Unit
export const createunit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { unit_name } = req.body;

    if (!unit_name) {
      res.status(400).json({ message: "Unit name is required" });
      return;
    }

    const unit = await prisma.unit.create({
      data: {
        id: randomUUID(),
        unit_name,
      },
    });

    res.status(201).json(unit);
  } catch (error) {
    console.error("Error creating unit:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Units
export const getAllunit = async (req: Request, res: Response): Promise<void> => {
  try {
    const units = await prisma.unit.findMany({
      orderBy: { created_at: "desc" },
    });

    res.status(200).json(units);
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Unit
export const deleteunit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const unit = await prisma.unit.findUnique({ where: { id } });
    if (!unit) {
      res.status(404).json({ message: "Unit not found" });
      return;
    }

    await prisma.unit.delete({ where: { id } });

    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error("Error deleting unit:", error);
    res.status(500).json({ message: "Server error" });
  }
};
