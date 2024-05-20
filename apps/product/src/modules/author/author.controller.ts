import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PermissionRequestGuard, ROLE, Roles, RolesGuard, UUIDPipe } from '@app/common';
import { AuthorService } from "./author.service";
import { AuthorEntity } from './entities/author.entity';
import { CreateAuthorDto } from './dtos/create-author.dto';

@Controller('authors')
export class AuthorController {
    constructor(
        private readonly authorService: AuthorService
    ) {}

    @Post()
    @Roles([ROLE.ADMIN])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async create(
        @Body() createAuthorDto: CreateAuthorDto
    ): Promise<AuthorEntity> {
        return await this.authorService.create(createAuthorDto);
    }

    @Get()
    async findAll(): Promise<AuthorEntity[]> {
        return await this.authorService.findAll();
    }

    @Get('/:id')
    async findOneById(
        @Param('id', UUIDPipe) id: string
    ): Promise<AuthorEntity> {
        return await this.authorService.findOneById(id);
    }

    @Patch('/:id')
    @Roles([ROLE.ADMIN])
    @UseGuards(
        PermissionRequestGuard,
        RolesGuard
    )
    async update(
        @Param('id', UUIDPipe) id: string,
        @Body() updateAuthorDto: CreateAuthorDto
    ): Promise<void> {
        await this.authorService.update(id, updateAuthorDto);
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
        await this.authorService.delete(id)
    }
}