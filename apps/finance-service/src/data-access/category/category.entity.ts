import { BaseSchema } from '@repo/nest-core';
import { CategoryRepository } from './category.repository';
import { defineEntity, p } from '@mikro-orm/postgresql';

const CategorySchema = defineEntity({
  name: 'Category',
  tableName: 'categories',
  repository: () => CategoryRepository,
  extends: BaseSchema,
  properties: {
    userId: p.string(),
    name: p.string(),
    parent: () =>
      p.manyToOne(Category).nullable().createForeignKeyConstraint(false),
  },
});

export class Category extends CategorySchema.class {}
CategorySchema.setClass(Category);
