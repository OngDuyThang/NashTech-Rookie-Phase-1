import { SetMetadata } from "@nestjs/common";
import { DECORATOR_KEY } from "../enums/decorators";
import { ROLE } from "../enums/roles";

export const Roles = (roles: ROLE[]) => SetMetadata(DECORATOR_KEY.ROLES, roles)