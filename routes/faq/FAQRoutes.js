import express from "express";
import {validateBody} from "../../middleware/validate.js";
import {FAQDto, UpdateFAQDto} from "../../dto/faq/FAQ.dto.js";
import { authorizeAdmin} from "../../middleware/jwt.js";
import * as FAQController from "../../controllers/faq/FAQController";

const router = express.Router();

router.get("/", FAQController.getAllFAQ);
router.get("/:id", FAQController.getFAQById);
router.post("/", authorizeAdmin, validateBody(FAQDto), FAQController.createFAQ);
router.delete("/:id", authorizeAdmin, FAQController.deleteFAQ);
router.put("/:id", authorizeAdmin, validateBody(UpdateFAQDto), FAQController.updateFAQ);

export default router;