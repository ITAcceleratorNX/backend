import * as TenantService from '../../../service/storage/TenantService.js';
import Tenant from '../../../models/Tenant.js';

jest.mock('../../../models/Tenant.js');

describe('TenantService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createTenant should create a tenant', async () => {
        const data = { user_id: 1, storage_id: 2, status: 'active' };
        Tenant.create.mockResolvedValue(data);

        const result = await TenantService.createTenant(data);

        expect(Tenant.create).toHaveBeenCalledWith(data);
        expect(result).toEqual(data);
    });

    test('getAllTenants should return all tenants', async () => {
        const tenants = [{ tenant_id: 1 }, { tenant_id: 2 }];
        Tenant.findAll.mockResolvedValue(tenants);

        const result = await TenantService.getAllTenants();
        expect(result).toEqual(tenants);
    });

    test('getTenantById should return tenant by id', async () => {
        const tenant = { tenant_id: 1 };
        Tenant.findByPk.mockResolvedValue(tenant);

        const result = await TenantService.getTenantById(1);
        expect(result).toEqual(tenant);
    });

    test('updateTenant should update tenant by id', async () => {
        Tenant.update.mockResolvedValue([1]);

        const result = await TenantService.updateTenant(1, { status: 'completed' });
        expect(result).toEqual([1]);
    });

    test('deleteTenant should delete tenant by id', async () => {
        Tenant.destroy.mockResolvedValue(1);

        const result = await TenantService.deleteTenant(1);
        expect(result).toBe(1);
    });
});
