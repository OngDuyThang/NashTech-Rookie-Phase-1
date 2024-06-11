import { UUIDPipe, getUrlEndpoint, getViewPath } from '@app/common';
import { Env } from '@app/env';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('promotions')
export class PromotionController {
  constructor(private readonly env: Env) {}

  private viewPath(file: string) {
    return getViewPath('promotion', file);
  }

  private urlEndpoint(path: string) {
    return getUrlEndpoint(
      this.env.PRODUCT_SERVICE_HOST_NAME,
      this.env.PRODUCT_SERVICE_PORT,
      `/api/${path}`,
    );
  }

  @Get()
  async list(@Res() res: Response) {
    const findAllUrl = this.urlEndpoint('promotions');
    const removeUrl = findAllUrl;
    let promotions: object;

    try {
      const res = await fetch(findAllUrl, {
        method: 'GET',
      });
      const data = await res.json();
      promotions = data?.data;
    } catch (e) {
      throw e;
    }

    res.render(this.viewPath('list'), {
      promotions,
      removeUrl,
    });
  }

  @Get('/create')
  async create(@Res() res: Response) {
    const createUrl = this.urlEndpoint('promotions');
    const uploadUrl = getUrlEndpoint(
      this.env.UPLOAD_SERVICE_HOST_NAME,
      this.env.UPLOAD_SERVICE_PORT,
      '/api/upload/product-image',
    );

    res.render(this.viewPath('create'), { createUrl, uploadUrl });
  }

  @Get('/:id')
  async update(@Param('id', UUIDPipe) id: string, @Res() res: Response) {
    const findOneUrl = this.urlEndpoint(`promotions/${id}`);
    const updateUrl = findOneUrl;
    const uploadUrl = getUrlEndpoint(
      this.env.UPLOAD_SERVICE_HOST_NAME,
      this.env.UPLOAD_SERVICE_PORT,
      '/api/upload/product-image',
    );
    let promotion: object;

    try {
      const res = await fetch(findOneUrl, {
        method: 'GET',
      });
      const data = await res.json();
      promotion = data?.data;
    } catch (e) {
      throw e;
    }

    res.render(this.viewPath('update'), { promotion, updateUrl, uploadUrl });
  }
}
