import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

/**
 * Serialize a plain object or entity into a response DTO instance.
 *
 * Uses class-transformer with `excludeExtraneousValues`, so only properties
 * explicitly exposed on the DTO (e.g. via `@DtoField()` / `@Expose()`) are
 * kept. Everything else — relations, internal fields, columns not declared on
 * the DTO — is dropped. This is an allowlist, which is safer than relying on
 * each entity to mark sensitive fields as hidden.
 *
 * `excludeExtraneousValues` is on by default; pass `options` to override it or
 * add any other `ClassTransformOptions` (e.g. `groups`, `enableCircularCheck`).
 *
 * @example
 *   return toDto(GetInfoResponseDto, user);
 *   return toDto(GetInfoResponseDto, user, { groups: ['admin'] });
 *
 * For field renames (e.g. a `category` relation -> `categoryId`), pass an
 * already-mapped plain object:
 *   return toDto(GetAccountResponseDto, { ...account, categoryId: account.category?.id });
 */
export function toDto<T, V>(
  dto: ClassConstructor<T>,
  plain: V,
  options?: ClassTransformOptions,
): T {
  return plainToInstance(dto, plain, {
    excludeExtraneousValues: true,
    ...options,
  });
}

/**
 * Array variant of {@link toDto}.
 *
 * @example
 *   return toDtoArray(ListAccountResponseDto, accounts);
 */
export function toDtoArray<T, V>(
  dto: ClassConstructor<T>,
  plain: V[],
  options?: ClassTransformOptions,
): T[] {
  return plainToInstance(dto, plain, {
    excludeExtraneousValues: true,
    ...options,
  });
}
