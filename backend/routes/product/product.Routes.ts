import express from "express";
import { 
    getallProducts, 
    getoneProduct, 
    createproduct,
    updateProduct,
    deleteproduct
} from "../../controllers/product/product.controller.js";
import protecRoute from "../../middleware/protecRoute.js";

const router = express.Router();

router.post("/product/add", createproduct);
router.get("/products/get", getallProducts);
router.get("/product/get/:id", getoneProduct);
router.put("/product/update/:id", updateProduct);
router.delete("/product/delete/:id", deleteproduct)

export default router;
