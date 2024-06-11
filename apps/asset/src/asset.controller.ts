import { Body, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiController,
  PermissionRequestGuard,
  ROLE,
  Roles,
  RolesGuard,
} from '@app/common';
import { PageService } from './modules/page/page.service';
import { PageEntity } from './modules/page/entities/page.entity';
import { UpdateAboutDto } from './modules/page/dtos/update-about.dto';

@ApiController('assets')
export class AssetController {
  constructor(private readonly pageService: PageService) {}

  @Get('/about-page')
  async getAboutPage(): Promise<PageEntity> {
    return await this.pageService.getAboutPage();
  }

  @Patch('/about-page')
  @Roles([ROLE.ADMIN])
  @UseGuards(PermissionRequestGuard, RolesGuard)
  async updateAboutPage(@Body() updateAboutDto: UpdateAboutDto): Promise<void> {
    return await this.pageService.updateAboutPage(updateAboutDto);
  }
}
