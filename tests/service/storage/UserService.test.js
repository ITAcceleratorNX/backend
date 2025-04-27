// tests/service/storage/UserService.test.js

import * as UserService from '../../../service/storage/UserService.js';
import User from '../../../models/User.js';

jest.mock('../../../models/User.js');

describe('🧪 UserService Тесттері', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createUser дұрыс жұмыс істеу керек', async () => {
        const input = { name: "Абай Құнанбаев", iin: "950601350123", address: "Семей" };
        const createdUser = { user_id: 1, ...input };
        User.create.mockResolvedValue(createdUser);

        const result = await UserService.createUser(input);

        expect(User.create).toHaveBeenCalledWith(input);
        expect(result).toEqual(createdUser);
    });

    test('getAllUsers барлық юзерлерді қайтарады', async () => {
        const mockUsers = [{ user_id: 1 }, { user_id: 2 }];
        User.findAll.mockResolvedValue(mockUsers);

        const result = await UserService.getAllUsers();

        expect(User.findAll).toHaveBeenCalled();
        expect(result).toEqual(mockUsers);
    });

    test('getUserById дұрыс бір юзерді қайтарады', async () => {
        const mockUser = { user_id: 1, name: 'Test User' };
        User.findByPk.mockResolvedValue(mockUser);

        const result = await UserService.getUserById(1);

        expect(User.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockUser);
    });

    test('updateUser дұрыс жұмыс істеу керек', async () => {
        User.update.mockResolvedValue([1]);

        const result = await UserService.updateUser(1, { name: "Updated User" });

        expect(User.update).toHaveBeenCalledWith({ name: "Updated User" }, { where: { user_id: 1 } });
        expect(result).toEqual([1]);
    });

    test('deleteUser дұрыс жұмыс істеу керек', async () => {
        User.destroy.mockResolvedValue(1);

        const result = await UserService.deleteUser(1);

        expect(User.destroy).toHaveBeenCalledWith({ where: { user_id: 1 } });
        expect(result).toBe(1);
    });
});
