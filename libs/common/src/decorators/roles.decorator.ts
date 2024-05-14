import { SetMetadata } from "@nestjs/common";
import { DECORATOR_KEY } from "../enums/decorators";
import { ROLES } from "../enums/roles";

export const Roles = (roles: ROLES[]) => SetMetadata(DECORATOR_KEY.ROLES, roles)