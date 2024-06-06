import { DatabaseModule } from "@app/database";
import { Module } from "@nestjs/common";
import { PageEntity } from "./entities/page.entity";
import { PageRepository } from "./repositories/page.repository";
import { PageService } from "./page.service";

@Module({
    imports: [
        DatabaseModule.forFeature([PageEntity])
    ],
    providers: [
        PageService,
        PageRepository
    ],
    exports: [
        PageService
    ]
})
export class PageModule {}