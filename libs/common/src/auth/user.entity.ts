import { ROLE } from "../enums/roles";

export class UserEntity {
    id: string;
    username: string;
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
    picture?: string;
    openid_provider?: string;
    enable_two_factor?: boolean;
    two_factor_secret?: string;
    one_time_token?: string;
    api_key?: string;
    role: ROLE;
    active?: boolean
}