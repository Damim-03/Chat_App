import express from "express";
import { 
    getallProducts, 
    getoneProduct, 
    createproduct,
    updateProduct,
    deleteproduct
} from "../../controllers/product/product.controller.js";
import {
    createCategory,
    getAllCategory,
    deleteCategory
} from "../../controllers/product/category.controller.js";
import { 
    createunit, 
    deleteunit, 
    getAllunit 
} from "../../controllers/product/unit.controller.js";

const router = express.Router();

// Product Routes
router.post("/product/add", createproduct);
router.get("/products/get", getallProducts);
router.get("/product/get/:id", getoneProduct);
router.put("/product/update/:id", updateProduct);
router.delete("/product/delete/:id", deleteproduct)

// Category Routes
router.post('/category/add', createCategory);
router.get('/category/get', getAllCategory);
router.delete('/category/delete/:id', deleteCategory);

// Unit Routes
router.post('/unit/add', createunit);
router.get('/unit/get', getAllunit);
router.delete('/unit/delete/:id', deleteunit);


export default router;
