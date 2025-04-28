import Tenant from '../../models/Tenant.js';

export const createTenant = (data) => Tenant.create(data);
export const getAllTenants = () => Tenant.findAll();
export const getTenantById = (id) => Tenant.findByPk(id);
export const updateTenant = (id, data) => {
    return Tenant.update(data, { where: { tenant_id: id } });
};
export const deleteTenant = (id) => {
    return Tenant.destroy({ where: { tenant_id: id } });
};
