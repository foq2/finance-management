import { defineEntity, p } from '@mikro-orm/postgresql';
import { v4 as uuid } from 'uuid';

export const BaseSchema = defineEntity({
  name: 'BaseEntity',
  abstract: true,
  filters: {
    softDelete: {
      name: 'softDelete',
      cond: { deletedAt: null },
      default: true,
    },
  },
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => uuid()),
    createdAt: p
      .datetime()
      .onCreate(() => new Date())
      .defaultRaw('now()'),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date())
      .defaultRaw('now()'),
    deletedAt: p.datetime().nullable().hidden(),
  },
});

export abstract class BaseEntity<T = any> extends BaseSchema.class {}

BaseSchema.setClass(BaseEntity);
