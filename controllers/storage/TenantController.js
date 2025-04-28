import * as TenantService from '../../service/storage/TenantService.js';

export const createTenant = async (req, res) => {
    try {
        const tenant = await TenantService.createTenant(req.body);
        res.status(201).json(tenant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllTenants = async (req, res) => {
    try {
        const tenants = await TenantService.getAllTenants();
        res.json(tenants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTenantById = async (req, res) => {
    try {
        const tenant = await TenantService.getTenantById(req.params.id);
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
        res.json(tenant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTenant = async (req, res) => {
    try {
        const updated = await TenantService.updateTenant(req.params.id, req.body);
        res.json({ updated });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteTenant = async (req, res) => {
    try {
        await TenantService.deleteTenant(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
