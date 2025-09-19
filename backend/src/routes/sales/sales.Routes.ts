import express from "express";
import {
    getProduct,
    SaveClientSale,
    updateProductSales,
    deleteProduct
} from "../../controllers/sales/sales.controller.js"

const router = express.Router();

// Salse Product
router.get("/sales/getProduct/:barcode", getProduct);
router.post("/sales/savesales", SaveClientSale);
router.put("/sales/updateProduct/:barcode", updateProductSales);
router.delete("/sales/deleteProduct/:barcode", deleteProduct);


export default router