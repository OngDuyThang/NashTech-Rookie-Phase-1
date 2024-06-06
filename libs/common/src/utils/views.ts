import { join } from "path"
import * as hbs from 'hbs';
import { COMMON_KEY_NAME } from "../enums/token";
import { TUserState } from "../types/common";
import { isEmpty } from "lodash";
import { getUrlEndpoint } from "./helpers";

export const getViewPath = (
    dir: string,
    file?: string
) => {
    if (file) {
        return join(__dirname, 'views', dir, file)
    }
    return join(__dirname, 'views', dir)
}

export const hbsJsonHelper = () => {
    hbs.registerHelper('json', (obj) =>
        new hbs.handlebars.SafeString(JSON.stringify(obj))
    )
};

export const hbsEqualHelper = () => {
    hbs.registerHelper('equal', (a: unknown, b: unknown, options) => {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
}

// export const setUserRoot = (user: TUserState) => {
//     if (typeof window !== 'undefined') {
//         const userRoot = JSON.stringify(user)
//         localStorage.setItem('user', userRoot)
//     }
// }

// export const getUserRoot = () => {
//     if (typeof window !== 'undefined') {
//         const user = localStorage.getItem('user')
//         return JSON.parse(user) as TUserState
//     }
// }

// export const getAccessToken = (): string => {
//     const user = getUserRoot()
//     return user?.[COMMON_KEY_NAME.ACCESS_TOKEN] ? user[COMMON_KEY_NAME.ACCESS_TOKEN] : ''
// }

// export const replaceAccessToken = (newToken: string) => {
//     const user = getUserRoot()
//     if (!isEmpty(user)) {
//         user[COMMON_KEY_NAME.ACCESS_TOKEN] = newToken
//         localStorage.setItem('user', JSON.stringify(user))
//     }
// }

// export const logout = async () => {
//     const url = getUrlEndpoint(
//         process.env.AUTH_SERVICE_HOST_NAME,
//         process.env.AUTH_SERVICE_PORT,
//         '/auth/logout'
//     )
//     try {
//         await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//     } catch (e) {
//         console.log(e)
//     }
// }

// export const autoLogout = async () => {
//     if (typeof window !== 'undefined') {
//         await logout()
//         alert('Your session has been expired, ready to sign out')
//         window.location.href = window.location.href
//         localStorage.clear()
//     }
// }

// export const userLogout = async () => {
//     if (typeof window !== 'undefined') {
//         await logout()
//         window.location.href = window.location.href
//         localStorage.clear()
//     }
// }

// export const isSession = (): boolean => {
//     const user = getUserRoot()
//     if (!isEmpty(user)) {
//         return user.isSession
//     }
//     return false
// }