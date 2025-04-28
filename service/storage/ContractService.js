import Contract from '../../models/Contract.js';

export const createContract = (data) => Contract.create(data);
export const getAllContracts = () => Contract.findAll();
export const getContractById = (id) => Contract.findByPk(id);
export const updateContract = (id, data) => Contract.update(data, { where: { contract_id: id } });
export const deleteContract = (id) => Contract.destroy({ where: { contract_id: id } });
