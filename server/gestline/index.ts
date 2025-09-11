import { Router } from "express";
import ordersRouter from "./orders";
import productsRouter from "./products";
import customersRouter from "./customers";

/**
 * Router principale GestLine - wikenship.it
 * Organizza tutti i moduli schema singoli per ciascuna chiamata
 */
const gestlineRouter = Router();

// Health check specifico per GestLine
gestlineRouter.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    service: "GestLine API",
    domain: "wikenship.it",
    timestamp: new Date().toISOString(),
    modules: ["orders", "products", "customers"]
  });
});

// Mount dei moduli singoli
gestlineRouter.use("/", ordersRouter);
gestlineRouter.use("/", productsRouter);
gestlineRouter.use("/", customersRouter);

export default gestlineRouter;