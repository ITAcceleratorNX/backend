import express from "express";
import {validateBody} from "../../middleware/validate.js";
import {FAQDto, UpdateFAQDto} from "../../dto/faq/FAQ.dto.js";
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";
import * as FAQController from "../../controllers/faq/FAQController.js";

const router = express.Router();

router.get("/", FAQController.getAllFAQ);
router.get("/:id", FAQController.getFAQById);
router.post("/", authenticateJWT, authorizeAdminOrManager, validateBody(FAQDto), FAQController.createFAQ);
router.delete("/:id", authenticateJWT, authorizeAdminOrManager, FAQController.deleteFAQ);
router.put("/:id", authenticateJWT, authorizeAdminOrManager, validateBody(UpdateFAQDto), FAQController.updateFAQ);

export default router;