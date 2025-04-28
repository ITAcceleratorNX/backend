import * as ContractService from '../../../service/storage/ContractService.js';
import Contract from '../../../models/Contract.js';

jest.mock('../../../models/Contract.js');

describe('ContractService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createContract should create a contract', async () => {
        const data = { user_id: 1, order_id: 1, contract_type: 'individual' };
        Contract.create.mockResolvedValue(data);

        const result = await ContractService.createContract(data);

        expect(Contract.create).toHaveBeenCalledWith(data);
        expect(result).toEqual(data);
    });

    test('getAllContracts should return all contracts', async () => {
        const contracts = [{ contract_id: 1 }, { contract_id: 2 }];
        Contract.findAll.mockResolvedValue(contracts);

        const result = await ContractService.getAllContracts();
        expect(result).toEqual(contracts);
    });

    test('getContractById should return contract by id', async () => {
        const contract = { contract_id: 1 };
        Contract.findByPk.mockResolvedValue(contract);

        const result = await ContractService.getContractById(1);
        expect(result).toEqual(contract);
    });

    test('updateContract should update contract by id', async () => {
        Contract.update.mockResolvedValue([1]);

        const result = await ContractService.updateContract(1, { status: 'expired' });
        expect(result).toEqual([1]);
    });

    test('deleteContract should delete contract by id', async () => {
        Contract.destroy.mockResolvedValue(1);

        const result = await ContractService.deleteContract(1);
        expect(result).toBe(1);
    });
});
