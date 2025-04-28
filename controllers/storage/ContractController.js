import * as ContractService from '../../service/storage/ContractService.js';

export const createContract = async (req, res) => {
    try {
        const contract = await ContractService.createContract(req.body);
        res.status(201).json(contract);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllContracts = async (req, res) => {
    try {
        const contracts = await ContractService.getAllContracts();
        res.json(contracts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getContractById = async (req, res) => {
    try {
        const contract = await ContractService.getContractById(req.params.id);
        if (!contract) return res.status(404).json({ error: 'Contract not found' });
        res.json(contract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateContract = async (req, res) => {
    try {
        const updated = await ContractService.updateContract(req.params.id, req.body);
        res.json({ updated });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteContract = async (req, res) => {
    try {
        await ContractService.deleteContract(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
