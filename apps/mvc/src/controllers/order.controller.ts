import { UUIDPipe, getUrlEndpoint, getViewPath } from '@app/common';
import { Env } from '@app/env';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly env: Env) {}

  private viewPath(file: string) {
    return getViewPath('order', file);
  }

  private urlEndpoint(path: string) {
    return getUrlEndpoint(
      this.env.ORDER_SERVICE_HOST_NAME,
      this.env.ORDER_SERVICE_PORT,
      `/api/${path}`,
    );
  }

  @Get()
  async list(@Res() res: Response) {
    const findAllUrl = this.urlEndpoint('orders');
    const removeUrl = findAllUrl;
    let orders: object;

    try {
      const res = await fetch(findAllUrl, {
        method: 'GET',
      });
      const data = await res.json();
      orders = data?.data;
    } catch (e) {
      throw e;
    }

    res.render(this.viewPath('list'), {
      orders,
      removeUrl,
    });
  }

  @Get('/:id')
  async update(@Param('id', UUIDPipe) id: string, @Res() res: Response) {
    const findOneUrl = this.urlEndpoint(`orders/${id}`);
    const updateUrl = findOneUrl;
    let order: any;

    try {
      const res = await fetch(findOneUrl, {
        method: 'GET',
      });
      const data = await res.json();
      order = data?.data;
    } catch (e) {
      throw e;
    }

    res.render(this.viewPath('update'), {
      order,
      items: order?.items,
      updateUrl,
    });
  }
}
