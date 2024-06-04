import { getUrlEndpoint, getViewPath } from "@app/common";
import { Env } from "@app/env";
import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class MvcController {
    constructor(
        private readonly env: Env
    ) {}

    @Get()
    async index(
        @Res() res: Response
    ) {
        const findAllUrl = getUrlEndpoint(
            this.env.PRODUCT_SERVICE_HOST_NAME,
            this.env.PRODUCT_SERVICE_PORT,
            '/api/products/all'
        )
        let products: object

        try {
            const res = await fetch(findAllUrl, {
                method: 'GET'
            })
            const data = await res.json()
            products = data?.data
        } catch (e) {
            throw e
        }
        res.render('callback', { products })
    }

    @Get('callback')
    callback(
        @Query('code') code: string,
        @Res() res: Response
    ) {
        const tokenUrl = getUrlEndpoint(
            this.env.AUTH_SERVICE_HOST_NAME,
            this.env.AUTH_SERVICE_PORT,
            '/auth/token'
        )
        res.render('callback', { code, tokenUrl })
    }
}