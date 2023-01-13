import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CategoryIdDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  getCategoryById(@Param() categoryId: CategoryIdDto): Promise<Category> {
    return this.categoriesService.getCategoryById(categoryId);
  }

  @Patch(':id')
  updateCategoryById(
    @Param() categoryId: CategoryIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.updateCategoryById(
      categoryId,
      updateCategoryDto,
    );
  }

  @Delete(':id')
  deleteCategoryById(@Param() categoryId: CategoryIdDto): Promise<void> {
    return this.categoriesService.deleteCategoryById(categoryId);
  }
}
