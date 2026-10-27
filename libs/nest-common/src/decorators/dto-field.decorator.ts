import { applyDecorators, Logger, Type } from '@nestjs/common';
import _ from 'lodash';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Expose, Transform, Type as TransformType } from 'class-transformer';
import {
  IsArray,
  isBoolean,
  isBooleanString,
  IsDate,
  isEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

type PropertyType = Type<unknown> | Function | Record<string, any> | 'File';

interface DtoPropertyOptions {
  type: PropertyType;
  structure?: 'array' | 'enum' | 'enumArray' | 'dto' | 'dtoArray';
  validated?: boolean;
  required?: boolean;
  example?: any;
  defaultValue?: any;
  description?: string;
  validateGroup?: string[];
}

/**
 * Specialized decorator for creating API Metadata (Swagger documentation).
 * It focuses solely on applying @ApiProperty with extended logic for enums, arrays, and file types.
 *
 * @param {DtoPropertyOptions} options - The property options containing Swagger-related metadata.
 * @returns {PropertyDecorator} The ApiProperty decorator.
 */
export function ApiPropertyExtended(
  options?: DtoPropertyOptions,
): PropertyDecorator {
  if (options === undefined || _.isEmpty(options)) {
    return ApiProperty({ required: false });
  }
  const { structure, ...propertyOptions } = options;

  const isFile = propertyOptions.type === 'File';
  const type = (isFile ? String : propertyOptions.type) as Type<unknown>;
  const isEnum = ['enum', 'enumArray'].includes(structure ?? '');
  const isArray = ['array', 'enumArray', 'dtoArray'].includes(structure ?? '');

  const example = _.get(
    propertyOptions,
    'defaultValue',
    propertyOptions.example,
  );

  const apiOptions: ApiPropertyOptions = {
    ...propertyOptions,
    type,
    ...(isFile && { format: 'binary' }),
    ...(isEnum && { enum: type, enumName: type.name }),
    isArray,
    example,
    // required: propertyOptions.required,
  };

  return ApiProperty(apiOptions);
}

/**
 * Specialized decorator for applying Validation and Transformation rules (class-transformer, class-validator).
 * It handles logic for Expose, IsOptional/IsNotEmpty, setting default values, and type-specific validation (e.g., Boolean coercion, nested DTO validation).
 *
 * @param {DtoPropertyOptions} options - The property options containing validation/transformation rules.
 * @returns The decorators for the property.
 */
export function ValidateTransform(options?: DtoPropertyOptions) {
  if (options === undefined || _.isEmpty(options)) {
    return applyDecorators(
      Expose(),
      IsOptional(),
      ValidateIf(() => isEmpty(options?.validateGroup)),
    );
  }

  const { structure, validated, validateGroup, ...propertyOptions } = {
    validated: false,
    required: false,
    ...options,
  };

  const isFile = propertyOptions.type === 'File';
  const type = (isFile ? String : propertyOptions.type) as Type<unknown>;
  const isDto = ['dto', 'dtoArray'].includes(structure ?? '');
  const isEnum = ['enum', 'enumArray'].includes(structure ?? '');
  const isArray = ['array', 'enumArray', 'dtoArray'].includes(structure ?? '');

  const decorators: PropertyDecorator[] = [
    Expose(),
    ValidateIf(() => isEmpty(validateGroup)),
  ];

  const validationOptions = { each: isArray, groups: validateGroup };

  decorators.push(
    (propertyOptions.required && !isFile ? IsNotEmpty : IsOptional)(
      validationOptions,
    ),
    ...(isEnum ? [IsEnum(type, validationOptions)] : []),
    ...(isArray ? [IsArray({ groups: validateGroup })] : []),
    ...(isDto
      ? [
          TransformType((obj) => type),
          ValidateNested({
            ...validationOptions,
            message: (arg) => `Field ${arg.property} can not validate nested`,
          }),
        ]
      : []),
  );

  if (isArray && !isDto)
    decorators.push(
      Transform(({ value }) => {
        if (isEmpty(value)) return;
        return Array.isArray(value) ? value : [value];
      }),
    );

  if (isDto) decorators.push();

  if (_.has(propertyOptions, 'defaultValue')) {
    if (isDto)
      throw new Error(
        `Property ${type.name} is a DTO but defaultValue set. Please set defaultValue in child DTO instead`,
      );

    if (propertyOptions.required)
      throw new Error(
        `Property ${type.name} is required but defaultValue set. Please remove defaultValue`,
      );

    decorators.push(
      Transform(({ value }) =>
        value === undefined ? propertyOptions.defaultValue || undefined : value,
      ),
    );
  }

  if (validated) {
    switch (type) {
      case String:
        decorators.push(IsString(validationOptions));
        break;
      case Number:
        decorators.push(
          TransformType((obj) => Number),
          IsNumber({}, validationOptions),
        );
        break;
      case Date:
        decorators.push(IsDate(validationOptions));
        break;
      case Boolean:
        decorators.push(
          Transform(({ value }) => {
            if (isEmpty(value)) return;
            if (isBoolean(value)) return value;
            if (!isBooleanString(value)) {
              throw new Error('Value should be a boolean');
            }
            return value === 'true';
          }),
          TransformType((obj) => String),
        );
        break;
      default:
        if (type && !isEnum && !isDto) {
          Logger.warn(
            `Property type ${type.name} is not Primitive type but are not specified structure (enum, dto)`,
          );
        }
    }
  }

  return applyDecorators(...decorators);
}

/**
 * Comprehensive decorator for DTO properties.
 * It combines API Documentation (Swagger) and Validation/Transformation logic.
 *
 * It ensures consistency by automatically applying:
 * 1. API Metadata via @ApiProperty.
 * 2. Serialization/Deserialization via @Expose.
 * 3. Type transformation (e.g., string to number, handling nested DTOs) via @Transform.
 * 4. Validation rules (required/optional, type checking, nested validation) via class-validator.
 *
 * @param {DtoPropertyOptions} options - The options for configuring the property.
 * @returns The decorators for the property.
 */
export function DtoField(options?: DtoPropertyOptions) {
  return applyDecorators(
    ApiPropertyExtended(options),
    ValidateTransform(options),
  );
}
