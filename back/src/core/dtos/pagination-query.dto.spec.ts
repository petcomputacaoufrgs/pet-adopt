import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  MAX_PAGE_SIZE,
  PaginationQueryDto,
} from './pagination-query.dto';

describe('PaginationQueryDto', () => {
  it('transforms valid values and applies defaults', async () => {
    const query = plainToInstance(PaginationQueryDto, { page: '2', limit: '25' });

    expect(query.page).toBe(2);
    expect(query.limit).toBe(25);
    await expect(validate(query)).resolves.toHaveLength(0);
  });

  it('rejects a page size above the API maximum', async () => {
    const query = plainToInstance(PaginationQueryDto, {
      limit: String(MAX_PAGE_SIZE + 1),
    });

    const errors = await validate(query);

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'limit' }),
      ]),
    );
  });
});
