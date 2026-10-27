import { BaseEntity } from './base.entity';
import { EntityRepository, SelectQueryBuilder } from '@mikro-orm/postgresql';
import { APP_DEFAULTS } from '@repo/nest-common';

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  async paginate(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = APP_DEFAULTS.PAGINATION.PAGE,
    pageSize: number = APP_DEFAULTS.PAGINATION.PAGE_SIZE,
  ): Promise<PaginationResult<T>> {
    page = Math.max(APP_DEFAULTS.PAGINATION.PAGE, +page || 1);
    pageSize = Math.max(APP_DEFAULTS.PAGINATION.PAGE_SIZE, +pageSize || 1);

    const offset = (page - 1) * pageSize;

    if (offset > 0) queryBuilder.offset(offset);
    queryBuilder.limit(pageSize);

    const [results, count] = await queryBuilder.getResultAndCount();
    const totalPages = Math.ceil(count / pageSize);

    return {
      data: results,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages,
      },
    };
  }
}
