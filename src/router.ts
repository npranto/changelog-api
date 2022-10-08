import { Router } from "express";
import { body, oneOf, validationResult } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getUpdate,
  getUpdates,
  updateUpdate,
} from "./handlers/update";
import { handleRequestBodyErrors } from "./modules/middleware";

const router = Router();

/**
 * Product
 */
router.get("/product", getProducts);
router.post(
  // endpoint
  "/product",
  // middleware
  body("name").exists().isString(),
  handleRequestBodyErrors,
  // handler
  createProduct
);
router.get("/product/:id", getProduct);
router.put(
  // endpoint
  "/product/:id",
  // middleware
  body("name").isString(),
  handleRequestBodyErrors,
  // handler
  updateProduct
);
router.delete(
  // endpoint
  "/product/:id",
  // handler
  deleteProduct
);

/**
 * Update
 */
router.get("/update", getUpdates);
router.post(
  "/update",
  body("title").exists().isString(),
  body("body").exists().isString(),
  createUpdate
);
router.get("/update/:id", getUpdate);
router.put(
  "/update/:id",
  body("title").optional(),
  body("body").optional(),
  body("status").optional(),
  body("asset").optional(),
  updateUpdate
);
router.delete(
  // endpoint
  "/update/:id",
  // handler
  deleteUpdate
);

/**
 * Update Point
 */
router.get("/update-point", () => {});
router.post(
  "/update-point",
  body("name").exists().isString(),
  body("description").exists().isString(),
  body("updateId").exists().isString(),
  () => {}
);
router.get("/update-point/:id", () => {});
router.put(
  "/update-point/:id",
  body("name").optional().isString(),
  body("description").optional().isString(),
  () => {}
);

// error handler
router.use((err, req, res) => {
  console.log(err);
  const { type } = err;

  if (type === "auth") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (type === "input") {
    return res.status(400).json({ message: "Invalid input" });
  }
  return res.status(500).json({ message: "Oops! Something went wrong :(" });
});

export default router;
