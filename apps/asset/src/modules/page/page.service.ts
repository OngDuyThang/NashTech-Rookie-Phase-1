import { Injectable, NotFoundException } from '@nestjs/common';
import { PageRepository } from './repositories/page.repository';
import { PageEntity } from './entities/page.entity';
import { isEmpty } from 'lodash';
import { ERROR_MESSAGE } from '@app/common';
import { UpdateAboutDto } from './dtos/update-about.dto';

@Injectable()
export class PageService {
  private readonly id = process.env.ABOUT_PAGE_ID;
  constructor(private readonly pageRepository: PageRepository) {}

  async getAboutPage(): Promise<PageEntity> {
    if (isEmpty(this.id)) {
      throw new NotFoundException(ERROR_MESSAGE.NOT_FOUND);
    }
    return await this.pageRepository.findOne({
      where: {
        id: this.id,
      },
    });
  }

  async updateAboutPage(updateAboutDto: UpdateAboutDto): Promise<void> {
    if (isEmpty(this.id)) {
      throw new NotFoundException(ERROR_MESSAGE.NOT_FOUND);
    }

    const { content } = updateAboutDto;
    return await this.pageRepository.update(
      {
        id: this.id,
      },
      { content },
    );
  }
}
