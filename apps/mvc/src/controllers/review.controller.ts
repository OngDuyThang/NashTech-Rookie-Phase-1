import { UUIDPipe, getUrlEndpoint, getViewPath } from "@app/common";
import { Env } from "@app/env";
import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";

@Controller('/reviews')
export class ReviewController {
    constructor(
        private readonly env: Env
    ) {}

    private viewPath(file: string) {
        return getViewPath('review', file)
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
        const findAllUrl = this.urlEndpoint('reviews')
        const removeUrl = findAllUrl
        let reviews: object

        try {
            const res = await fetch(findAllUrl, {
                method: 'GET'
            })
            const data = await res.json()
            reviews = data?.data
        } catch (e) {
            throw e
        }

        res.render(this.viewPath('list'), {
            reviews,
            removeUrl
        })
    }

    // @Get('/create')
    // async create(
    //     @Res() res: Response
    // ) {
    //     {
    //         "id": "8413cc69-8423-4f54-9fc2-dad4fa788daa",
    //         "rating": "1",
    //         "title": "review 1",
    //         "description": "description",
    //         "user_id": "32a21537-67eb-43da-96f7-2d615739e76d",
    //         "product_id": "042c48f0-10aa-415c-aea4-d1e087453c16"
    //       },
    //     const createUrl = this.urlEndpoint('reviews')

    //     let categories: object

    //     try {
    //         const res = await fetch(createUrl, {
    //             method: 'GET'
    //         })
    //         const data = await res.json()
    //         categories = data?.data
    //     } catch (e) {
    //         console.log(e)
    //     }

    //     res.render(this.viewPath('create'), { categories, createUrl })
    // }

    @Get('/:id')
    async update(
        @Param('id', UUIDPipe) id: string,
        @Res() res: Response
    ) {
        const findOneUrl = this.urlEndpoint(`reviews/${id}`)
        const updateUrl = findOneUrl
        let review: object

        try {
            const res = await fetch(findOneUrl, {
                method: 'GET'
            })
            const data = await res.json()
            review = data?.data
        } catch (e) {
            throw e
        }

        res.render(this.viewPath('update'), { review, updateUrl })
    }
}