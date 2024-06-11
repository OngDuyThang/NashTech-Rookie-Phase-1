import { UUIDPipe, getUrlEndpoint, getViewPath } from '@app/common';
import { Env } from '@app/env';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/reviews')
export class ReviewController {
  constructor(private readonly env: Env) {}

  private viewPath(file: string) {
    return getViewPath('review', file);
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
    const findAllUrl = this.urlEndpoint('reviews');
    const removeUrl = findAllUrl;
    let reviews: object;

    try {
      const res = await fetch(`${findAllUrl}/all`, {
        method: 'GET',
      });
      const data = await res.json();
      reviews = data?.data;
    } catch (e) {
      throw e;
    }

    res.render(this.viewPath('list'), {
      reviews,
      removeUrl,
    });
  }

  @Get('/:id')
  async update(@Param('id', UUIDPipe) id: string, @Res() res: Response) {
    const findOneUrl = this.urlEndpoint(`reviews/${id}`);
    const updateUrl = findOneUrl;
    let review: object;

    try {
      const res = await fetch(findOneUrl, {
        method: 'GET',
      });
      const data = await res.json();
      review = data?.data;
    } catch (e) {
      throw e;
    }

    res.render(this.viewPath('update'), { review, updateUrl });
  }
}
