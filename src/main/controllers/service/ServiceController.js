import * as priceService from "../../service/price/PriceService.js";
import {ServiceType} from "../../dto/serivce/Service.dto.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";
import { createBaseController } from "../base/BaseController.js";
import logger from "../../utils/winston/logger.js";

const base = createBaseController(priceService);

export const getAllServices = base.getAll;

export const getServiceByType = asyncHandler(async (req, res) => {
    const type = req.params.type;
    if (!ServiceType.safeParse(type).success) {
        logger.warn('Invalid service type', {
            userId: req.user?.id || null,
            endpoint: req.originalUrl,
            requestId: req.id,
            invalidType: req.params.type
        });
        return res.status(400).json({ error: 'Invalid type' });
    }
    const result = await priceService.getByType(req.params.type);
    logger.info('Fetched service by type', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        requestId: req.id,
        priceType: type,
        resultCount: result.length || (result ? 1 : 0)
    });
    res.json(result);
});

export const createService = asyncHandler(async (req, res) => {
    const result = await priceService.create(req.body);
    logger.info('Created new service', {
        userId: req.user?.id || null,
        endpoint: req.originalUrl,
        requestId: req.id,
        createdPrice: result
    });
    res.status(201).json(result);
});

export const updateService = base.update;

export const deleteService = base.delete;

export const calculatePrice = asyncHandler(async (req, res) => {
    await priceService.calculate(req.body, res);
});
