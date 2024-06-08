import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class TPaymentResponse {
    @Field(() => String, { nullable: false })
    clientSecret: string

    @Field(() => String, { nullable: false })
    orderId: string
}