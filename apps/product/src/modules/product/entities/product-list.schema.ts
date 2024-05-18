import { TGqlListDataShape } from "@app/common";
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductEntity } from "./product.entity";

@ObjectType()
export class ProductList extends TGqlListDataShape {
    @Field(() => [ProductEntity])
    data: ProductEntity[];
}