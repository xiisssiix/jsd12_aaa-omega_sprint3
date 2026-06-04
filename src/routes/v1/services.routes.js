import { Router } from "express";

import { getServices, getServiceByNumber, getServiceById, createService, updateService, updateServiceStatus, updateServiceInternalNote, deleteService } from "../../modules/services/services.v1.controller.js";

export const router = Router();

router.get("/", getServices);
router.get("/number/:serviceNumber", getServiceByNumber);
router.get("/:id", getServiceById);
router.post("/", createService);
router.put("/:id", updateService);
router.patch("/:id/status", updateServiceStatus);
router.patch("/:id/internal-note", updateServiceInternalNote);
router.delete("/:id", deleteService);