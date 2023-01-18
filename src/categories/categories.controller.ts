import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiSwaggerResponse,
  ApiSwaggerResponseArr,
  ResponseSuccess,
  SwaggerApiError,
} from '../utilities/helper.dto';
import { Helper } from '../utilities/helper';
import { CategoriesService } from './categories.service';
import {
  CategoryIdDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { Category } from './category.entity';
import { descriptions } from '../common/const.descriptions';

@Controller('api/categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ description: descriptions.CREATE_CATEGORY })
  @ApiSwaggerResponse(Category)
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiConflictResponse({
    description: descriptions.CONFLICT_NAME,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseSuccess<Category>> {
    const data = await this.categoriesService.createCategory(createCategoryDto);
    return Helper.resSuccess(HttpStatus.CREATED, data);
  }

  @Get()
  @ApiOperation({ description: descriptions.GET_ALL })
  @ApiSwaggerResponseArr(Category)
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  async getCategories(): Promise<ResponseSuccess<Category[]>> {
    const data = await this.categoriesService.getCategories();
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Get(':id')
  @ApiOperation({ description: descriptions.GET_ONEBY_ID })
  @ApiSwaggerResponse(Category)
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiNotFoundResponse({
    description: descriptions.NOT_FOUND,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  async getCategoryById(
    @Param() categoryId: CategoryIdDto,
  ): Promise<ResponseSuccess<Category>> {
    const data = await this.categoriesService.getCategoryById(categoryId);
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Patch(':id')
  @ApiOperation({ description: descriptions.UPDATE_ENTITY_UNIQUE_NAME })
  @ApiSwaggerResponse(Category)
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiNotFoundResponse({
    description: descriptions.NOT_FOUND,
    type: SwaggerApiError,
  })
  @ApiConflictResponse({
    description: descriptions.CONFLICT_NAME,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  async updateCategoryById(
    @Param() categoryId: CategoryIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseSuccess<Category>> {
    const data = await this.categoriesService.updateCategoryById(
      categoryId,
      updateCategoryDto,
    );
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Delete(':id')
  @ApiOperation({ description: descriptions.DELETE_ENTITY_NO_TRANSACTIONS })
  @ApiOkResponse()
  @ApiBadRequestResponse({
    description: descriptions.BAD_REQUEST,
    type: SwaggerApiError,
  })
  @ApiNotFoundResponse({
    description: descriptions.NOT_FOUND,
    type: SwaggerApiError,
  })
  @ApiConflictResponse({
    description: descriptions.CONFLICT_TRANSACTIONS,
    type: SwaggerApiError,
  })
  @ApiInternalServerErrorResponse({
    description: descriptions.INTERNAL_SERVER_ERROR,
    type: SwaggerApiError,
  })
  deleteCategoryById(@Param() categoryId: CategoryIdDto): Promise<void> {
    return this.categoriesService.deleteCategoryById(categoryId);
  }
}
