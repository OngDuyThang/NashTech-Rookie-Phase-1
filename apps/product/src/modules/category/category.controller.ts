import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { PermissionRequestGuard, ROLE, Roles, RolesGuard, UUIDPipe } from "@app/common";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { CategoryEntity } from "./entities/category.entity";

@Controller('categories')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) {}

    @Post()
    @Roles([ROLE.ADMIN])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async create(
        @Body() createCategoryDto: CreateCategoryDto
    ): Promise<CategoryEntity> {
        return await this.categoryService.create(createCategoryDto);
    }

    @Get()
    async findAll(): Promise<CategoryEntity[]> {
        return await this.categoryService.findAll();
    }

    @Get('/:id')
    async findOneById(
        @Param('id', UUIDPipe) id: string
    ): Promise<CategoryEntity> {
        return await this.categoryService.findOneById(id);
    }

    @Patch('/:id')
    @Roles([ROLE.ADMIN])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async update(
        @Param('id', UUIDPipe) id: string,
        @Body() updateCategoryDto: CreateCategoryDto
    ): Promise<void> {
        await this.categoryService.update(id, updateCategoryDto);
    }

    @Delete('/:id')
    @Roles([ROLE.ADMIN])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async delete(
        @Param('id', UUIDPipe) id: string
    ): Promise<void> {
        await this.categoryService.delete(id)
    }
}
