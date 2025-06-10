import * as FAQService from "../../service/faq/FAQService.js";
import { createBaseController } from "../base/BaseController.js";

const base = createBaseController(FAQService);

export const getAllFAQ = base.getAll;
export const getFAQById = base.getById;
export const createFAQ = base.create;
export const updateFAQ = base.update;
export const deleteFAQ = base.delete;
