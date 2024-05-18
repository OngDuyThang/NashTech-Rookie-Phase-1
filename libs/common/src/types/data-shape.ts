import { Field, ObjectType } from "@nestjs/graphql"

export interface TResponseDataShape<T = unknown> {
    data: T | null,
    message: string,
    statusCode: number,
    page?: number,
    limit?: number,
    total?: number
}

// Type for pagination only
@ObjectType()
export abstract class TGqlDataShape {
    abstract data: unknown

    @Field({ nullable: true })
    page?: number

    @Field({ nullable: true })
    limit?: number

    @Field({ nullable: true })
    total?: number
}