/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */


export type MkConfigs = {
    dark_mode: number|null,
}

export type MkFollowUserRequest = {
    user_id: number,
}

export type MkFullUser = {
    id: number,
    firstname: string,
    lastname: string|null,
    username: string,
    birthday: string|null,
    about: string|null,
    avatar: string|null,
    color: string|null,
    home: string|null,
    type: string,
    activated: number,
    susspended: number,
    verified_level: number,
    followers: number,
    followings: number,
    created_at: Date,
    updated_at: Date,
    total_views: number|null,
    total_rates: number|null,
    total_contents: number|null,
    followed_you: boolean|null,
    followed: boolean|null,
}

export type MkFullUserActivity = {
    read: MkUserActivity|null,
    write: MkUserActivity|null,
}

export type MkSearchUsersRequest = {
    offset: number|null,
    limit: number|null,
    sort_by_name: boolean|null,
    keyword: string|null,
}

export type MkSignIn = {
    username: string,
    password: string,
}

export type MkUser = {
    id: number,
    firstname: string,
    lastname: string|null,
    username: string,
    birthday: string|null,
    about: string|null,
    avatar: string|null,
    color: string|null,
    home: string|null,
    type: string,
    activated: number,
    susspended: number,
    verified_level: number,
    followers: number,
    followings: number,
    created_at: Date,
    updated_at: Date,
}

export type MkUserActivity = {
    activity_type: string,
    contents: number|null,
    seconds: number|null,
    verses: number|null,
}

export type MkUserAuthenticate = {
    password: string,
}

export type MkUserCore = {
    firstname: string,
    lastname: string|null,
    username: string,
    birthday: string|null,
    about: string|null,
    avatar: string|null,
    color: string|null,
    home: string|null,
}

export type MkUserInsert = {
    firstname: string,
    lastname: string|null,
    username: string,
    email: string|null,
    birthday: string|null,
    about: string|null,
    avatar: string|null,
    color: string|null,
    home: string|null,
    password: string,
    type: string|null,
    activated: number|null,
    susspended: number|null,
    token_session: number|null,
    created_at: Date|null,
    updated_at: Date|null,
}

export type MkUserNew = {
    firstname: string,
    lastname: string|null,
    username: string,
    email: string|null,
    birthday: string|null,
    password: string,
    agreement: number|null,
    about: string|null,
    color: string|null,
    home: string|null,
    google_session_id: string|null,
    register_token: string|null,
    invitation_code: string|null,
}

export type MkUserPrivate = {
    id: number,
    firstname: string,
    lastname: string|null,
    username: string,
    email: string|null,
    birthday: string|null,
    about: string|null,
    avatar: string|null,
    color: string|null,
    home: string|null,
    phone: string|null,
    type: string,
    activated: number,
    susspended: number,
    verified_level: number,
    followers: number,
    followings: number,
    password: string,
    token_session: number,
    created_at: Date,
    updated_at: Date,
    agreement: number|null,
    setup_version: number|null,
}

export type MkUserUpdate = {
    firstname: string|null,
    lastname: string|null,
    birthday: string|null,
    password: string|null,
    about: string|null,
    color: string|null,
    home: string|null,
    agreement: number|null,
    setup_version: number|null,
    current_password: string|null,
}

