/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkUserPrivate } from "./user";

export type MkForgetRequest = {
    code: string,
    token: string,
}

export type MkOAuthCheckRequest = {
    session_id: string,
}

export type MkOAuthCheckResult = {
    auth: MkSignInResult|null,
    google_register_token: string|null,
}

export type MkOAuthConnectRequest = {
    register_token: string,
}

export type MkOAuthGoogleOpenIDToken = {
    iss: string,
    azp: string,
    aud: string,
    sub: string,
    iat: number,
    exp: number,
}

export type MkOAuthRegisterRedirectResult = {
    code: string,
    state: string,
}

export type MkOAuthRegisterResult = {
    authorize_url: string,
    session_id: string,
}

export type MkSignInByCode = {
    code: string,
    signin_token: string,
    enter_phone_token: string|null,
    invitation_code: string|null,
}

export type MkSignInByPhoneResult = {
    user: MkUserPrivate|null,
    token: string|null,
    register_token: string|null,
}

export type MkSignInGetCodeBySMS = {
    phone: string,
    password_change_auth: boolean|null,
}

export type MkSignInGetCodeBySMSResult = {
    signin_token: string,
    invitation_code_needed: boolean,
}

export type MkSignInResult = {
    user: MkUserPrivate,
    token: string,
    enter_phone_token: string|null,
}

