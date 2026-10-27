import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiBodyOptions,
  ApiConsumes,
  ApiExtraModels,
  ApiHeader,
  ApiHeaderOptions,
  ApiHeaders,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiResponseOptions,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CursorPaginationResponseDto, PaginationResponseDto } from '../dtos';
import { BodyContentType } from '../enums';
import { CommonErrorResponseDto } from '../dtos';
import _ from 'lodash';

type SwaggerApiResponseOptions = ApiResponseOptions & {
  type?: any;
  status?: HttpStatus;
  // if response is pagination then provide the paginationDto
  paginationDto?:
    | Type<PaginationResponseDto<any>>
    | Type<CursorPaginationResponseDto<any>>;
};

type SwaggerApiOperationOptions = ApiOperationOptions & {
  summary: string;
  operationId: string;
};

type ApiDocumentExtraOption = {
  isPublic?: true;
};

type ApiDocumentOption = {
  operation: SwaggerApiOperationOptions;
  contentType?: BodyContentType[];
  header?: ApiHeaderOptions | ApiHeaderOptions[];
  body?: ApiBodyOptions;
  response?: SwaggerApiResponseOptions | SwaggerApiResponseOptions[];
  query?: ApiQueryOptions | ApiQueryOptions[];
  param?: ApiParamOptions | ApiParamOptions[];
  extra?: ApiDocumentExtraOption;
  tags?: string[];
};

/**
 * The `ApiDocument` function is a decorator factory that generates a set of decorators for a Swagger API document.
 * It takes an `ApiDocumentOption` object as an argument and returns a function that applies the decorators to the target.
 * This function is used to simplify the process of defining API documentation for a route handler in a NestJS application.
 * It allows you to define the operation, response, parameters, query parameters, body, file types, and tags for the API in a single place.
 * This makes the code more readable and maintainable, as all the API documentation for a route handler is defined together.
 *
 * @decorators
 *  - ApiResponse
 *  - ApiBody
 *  - ApiQuery
 *  - ApiParam
 *  - ApiOperation
 **/
export function ApiDocument(options: ApiDocumentOption) {
  const {
    body,
    tags,
    extra,
    param,
    query,
    header,
    response,
    operation,
    contentType,
  } = options;

  const decorators: (MethodDecorator | ClassDecorator)[] = [
    ApiOperation(operation),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Oops, something went wrong',
      type: CommonErrorResponseDto,
    }),
    ...(contentType?.length ? [ApiConsumes(...contentType)] : []),
    ...(tags?.length ? [ApiTags(...tags)] : []),
    ...(body ? [ApiBody(body)] : []),
    ...(header
      ? [Array.isArray(header) ? ApiHeaders(header) : ApiHeader(header)]
      : []),
    ...(query ? _.castArray(query).map((opt) => ApiQuery(opt)) : []),
    ...(param ? _.castArray(param).map((opt) => ApiParam(opt)) : []),
  ];

  if (Array.isArray(response)) {
    response.forEach((opt) => addApiResponse(opt, decorators));
  } else addApiResponse(response, decorators);

  return applyDecorators(...decorators);
}

function addApiResponse(
  option: SwaggerApiResponseOptions,
  decorators: (MethodDecorator | ClassDecorator)[],
) {
  if (option?.paginationDto) {
    decorators.push(
      ResponsePaginated(option.type, option.paginationDto, option),
    );
  } else decorators.push(ApiResponse(option));
}

function ResponsePaginated<
  Model extends Type<unknown>,
  Pagination extends Type<unknown>,
>(
  model: Model,
  paginationDto: Pagination,
  { status, description }: SwaggerApiResponseOptions,
) {
  return applyDecorators(
    ApiExtraModels(paginationDto, model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(paginationDto) },
          {
            properties: {
              data: { type: 'array', items: { $ref: getSchemaPath(model) } },
            },
          },
        ],
      },
    }),
  );
}
