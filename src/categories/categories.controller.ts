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
  ApiTags,
} from '@nestjs/swagger';
import { ResponseSuccess } from 'src/utilities/helper.dto';
import { Helper } from '../utilities/helper';
import { CategoriesService } from './categories.service';
import {
  CategoryIdDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { Category } from './category.entity';

@Controller('api/categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseSuccess<Category>> {
    const data = await this.categoriesService.createCategory(createCategoryDto);
    return Helper.resSuccess(HttpStatus.CREATED, data);
  }

  @Get()
  @ApiInternalServerErrorResponse()
  async getCategories(): Promise<ResponseSuccess<Category[]>> {
    const data = await this.categoriesService.getCategories();
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Get(':id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async getCategoryById(
    @Param() categoryId: CategoryIdDto,
  ): Promise<ResponseSuccess<Category>> {
    const data = await this.categoriesService.getCategoryById(categoryId);
    return Helper.resSuccess(HttpStatus.OK, data);
  }

  @Patch(':id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
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
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  deleteCategoryById(@Param() categoryId: CategoryIdDto): Promise<void> {
    return this.categoriesService.deleteCategoryById(categoryId);
  }
}
