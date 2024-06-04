import { UUIDPipe, getUrlEndpoint, getViewPath } from "@app/common";
import { Env } from "@app/env";
import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";

@Controller('products')
export class ProductController {
    constructor(
        private readonly env: Env
    ) {}

    private viewPath(file: string) {
        return getViewPath('product', file)
    }

    private urlEndpoint(path: string) {
        return getUrlEndpoint(
            this.env.PRODUCT_SERVICE_HOST_NAME,
            this.env.PRODUCT_SERVICE_PORT,
            `/api/${path}`
        )
    }

    @Get()
    async list(
        @Res() res: Response
    ) {
        const findAllUrl = this.urlEndpoint('products')
        const removeUrl = findAllUrl
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

        res.render(this.viewPath('list'), {
            products,
            removeUrl
        })
    }

    @Get('/create')
    async create(
        @Res() res: Response
    ) {
        const findAllAuthorUrl = this.urlEndpoint('authors')
        const findAllCatUrl = this.urlEndpoint('categories')
        const findAllPromotionUrl = this.urlEndpoint('promotions')
        const createUrl = this.urlEndpoint('products')
        const uploadUrl = getUrlEndpoint(
            this.env.UPLOAD_SERVICE_HOST_NAME,
            this.env.UPLOAD_SERVICE_PORT,
            '/upload/product-image'
        )
        let authors: object, categories: object, promotions: object

        try {
            const res = await fetch(findAllAuthorUrl, {
                method: 'GET'
            })
            const data = await res.json()
            authors = data?.data
        } catch (e) {
            console.log(e)
        }

        try {
            const res = await fetch(findAllCatUrl, {
                method: 'GET'
            })
            const data = await res.json()
            categories = data?.data
        } catch (e) {
            console.log(e)
        }

        try {
            const res = await fetch(findAllPromotionUrl, {
                method: 'GET'
            })
            const data = await res.json()
            promotions = data?.data
        } catch (e) {
            console.log(e)
        }

        res.render(this.viewPath('create'), { authors, categories, promotions, createUrl, uploadUrl })
    }

    @Get('/:id')
    async update(
        @Param('id', UUIDPipe) id: string,
        @Res() res: Response
    ) {
        const findOneUrl = this.urlEndpoint(`products/${id}`)
        const findAllAuthorUrl = this.urlEndpoint('authors')
        const findAllCatUrl = this.urlEndpoint('categories')
        const findAllPromotionUrl = this.urlEndpoint('promotions')
        const updateUrl = findOneUrl
        const uploadUrl = getUrlEndpoint(
            this.env.UPLOAD_SERVICE_HOST_NAME,
            this.env.UPLOAD_SERVICE_PORT,
            '/upload/product-image'
        )
        let product: object, authors: object, categories: object, promotions: object

        try {
            const res = await fetch(findOneUrl, {
                method: 'GET'
            })
            const data = await res.json()
            product = data?.data
        } catch (e) {
            throw e
        }

        try {
            const res = await fetch(findAllAuthorUrl, {
                method: 'GET'
            })
            const data = await res.json()
            authors = data?.data
        } catch (e) {
            console.log(e)
        }

        try {
            const res = await fetch(findAllCatUrl, {
                method: 'GET'
            })
            const data = await res.json()
            categories = data?.data
        } catch (e) {
            console.log(e)
        }

        try {
            const res = await fetch(findAllPromotionUrl, {
                method: 'GET'
            })
            const data = await res.json()
            promotions = data?.data
        } catch (e) {
            console.log(e)
        }

        res.render(this.viewPath('update'), { product, authors, categories, promotions, updateUrl, uploadUrl })
    }
}