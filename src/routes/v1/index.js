import { Router } from "express";
// import { router as usersRoutes } from "./users.routes.js";
import { router as productsRoutes } from "./products.routes.js";
// import { router as cartsRoutes } from "./carts.routes.js";
import { router as ordersRoutes } from "./orders.routes.js";
// import { router as servicesRoutes } from "./services.routes.js";

export const router = Router();

// router.use("/users", usersRoutes);
router.use("/products", productsRoutes);
// router.use("/carts", cartsRoutes);
router.use("/orders", ordersRoutes);
// router.use("/services", servicesRoutes);