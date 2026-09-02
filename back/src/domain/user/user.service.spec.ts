import { ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';

describe('UserService.update', () => {
  it('updates profile fields without forwarding password', async () => {
    const findById = jest.fn().mockResolvedValue({
      _id: 'user-a',
      ngoId: 'ngo-a',
    });
    const findByIdAndUpdate = jest.fn().mockResolvedValue({
      _id: 'user-a',
      name: 'Updated',
    });
    const service = new UserService(
      { findById, findByIdAndUpdate } as never,
      {} as never,
    );

    await service.update('user-a', {
      name: 'Updated',
      password: 'plain-text',
    } as never);

    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      'user-a',
      { name: 'Updated' },
      expect.objectContaining({ new: true, runValidators: true }),
    );
    expect(findByIdAndUpdate.mock.calls[0][1]).not.toHaveProperty('password');
  });

  it('rejects updates for another NGO', async () => {
    const service = new UserService(
      {
        findById: jest
          .fn()
          .mockResolvedValue({ _id: 'user-b', ngoId: 'ngo-b' }),
      } as never,
      {} as never,
    );

    await expect(
      service.update('user-b', { name: 'Nope' }, 'ngo-a'),
    ).rejects.toThrow(ForbiddenException);
  });
});
