import * as DeliveryService from '../../../service/storage/DeliveryService.js';
import Delivery from '../../../models/Delivery.js';

jest.mock('../../../models/Delivery.js');

describe('DeliveryService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createDeliveryRequest should create a delivery', async () => {
        const input = { rack_id: 1, package_type: 'Standard' };
        Delivery.create.mockResolvedValue(input);

        const result = await DeliveryService.createDeliveryRequest(input);

        expect(Delivery.create).toHaveBeenCalledWith(input);
        expect(result).toEqual(input);
    });

    test('getAllDeliveries should return all deliveries', async () => {
        const deliveries = [{ delivery_id: 1 }, { delivery_id: 2 }];
        Delivery.findAll.mockResolvedValue(deliveries);

        const result = await DeliveryService.getAllDeliveries();
        expect(Delivery.findAll).toHaveBeenCalled();
        expect(result).toEqual(deliveries);
    });

    test('getDeliveryById should return delivery by id', async () => {
        const delivery = { delivery_id: 1, rack_id: 1 };
        Delivery.findByPk.mockResolvedValue(delivery);

        const result = await DeliveryService.getDeliveryById(1);
        expect(Delivery.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(delivery);
    });

    test('updateDeliveryStatus should update delivery status', async () => {
        Delivery.update.mockResolvedValue([1]); // [affectedRows]

        const result = await DeliveryService.updateDeliveryStatus(1, 'delivered');
        expect(Delivery.update).toHaveBeenCalledWith({ status: 'delivered' }, { where: { delivery_id: 1 } });
        expect(result).toEqual([1]);
    });
});
