import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { PAGINATION } from "../enums/pagination";

// Middleware for pagination when using REST api
@Injectable()
export class PaginationMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: (error?: any) => void) {
        if (
            !req.query.hasOwnProperty('page') ||
            isNaN(Number(req.query.page))
        ) {
            req.query.page = PAGINATION.DEFAULT_PAGE
        }

        if (
            !req.query.hasOwnProperty('limit') ||
            isNaN(Number(req.query.limit))
        ) {
            req.query.limit = PAGINATION.DEFAULT_LIMIT
        }

        next()
    }
}