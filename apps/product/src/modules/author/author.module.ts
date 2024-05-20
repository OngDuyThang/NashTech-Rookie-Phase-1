import { Module } from "@nestjs/common";
import { AuthorController } from "./author.controller";
import { AuthorService } from "./author.service";
import { DatabaseModule } from "@app/database";
import { AuthorEntity } from "./entities/author.entity";
import { AuthorRepository } from "./repositories/author.repository";
import { AuthorResolver } from "./author.resolver";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [
        DatabaseModule.forFeature([
            AuthorEntity
        ]),
        ProductModule
    ],
    controllers: [AuthorController],
    providers: [
        AuthorService,
        AuthorRepository,
        AuthorResolver
    ],
})
export class AuthorModule {}