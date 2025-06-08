import {WarehouseService} from '../../service/warehouse/WarehouseService.js';
import {createBaseController} from '../base/BaseController.js';

const base = createBaseController(WarehouseService);

export class WarehouseController {
    static create = base.create;
    static getAll = base.getAll;
    static getById = base.getById;
    static update = base.update;
    static delete = base.delete;
}
