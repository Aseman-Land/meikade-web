/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkFullType } from "./type";
import { MkUser } from "./user";

export type MkAddBook = {
    title: string,
    description: string,
    public_book: number|null,
    parent_id: number|null,
}

export type MkBook = {
    id: number,
    title: string,
    description: string,
    author_id: number,
    parent_id: number|null,
    public_book: number,
    created_at: Date,
    updated_at: Date,
}

export type MkBookResult = {
    id: number,
    title: string,
    description: string,
    author_id: number,
    author: MkUser|null,
    parent_id: number|null,
    public_book: number,
    created_at: Date,
    updated_at: Date,
    total_views: number|null,
    total_rates: number|null,
    total_contents: number|null,
}

export type MkEditBook = {
    title: string|null,
    description: string|null,
    public_book: number|null,
    parent_id: number|null,
}

export type MkGetBooksRequest = {
    author_id: number|null,
    parent_id: number|null,
    search: string|null,
    offset: number|null,
    limit: number|null,
}

export type MkMyUserWithBooks = {
    id: number,
    agreement: number|null,
    latest_agreement: number,
    setup_version: number|null,
    firstname: string|null,
    lastname: string|null,
    username: string,
    birthday: string|null,
    type: string,
    activated: number,
    susspended: number,
    verified_level: number,
    followers: number,
    followings: number,
    followed: boolean|null,
    followed_you: boolean|null,
    created_at: Date,
    updated_at: Date,
    books: Array<MkBook>,
    about: string|null,
    avatar: string|null,
    color: string|null,
    home: string|null,
    total_views: number|null,
    total_rates: number|null,
    total_contents: number|null,
    types: Array<MkFullType>,
    favorites_count: number|null,
    notes_count: number|null,
    unseen_notifications: number|null,
}

export type MkUserWithBooks = {
    id: number,
    firstname: string|null,
    lastname: string|null,
    username: string,
    birthday: string|null,
    type: string,
    activated: number,
    susspended: number,
    verified_level: number,
    followers: number,
    followings: number,
    followed: boolean|null,
    followed_you: boolean|null,
    created_at: Date,
    updated_at: Date,
    books: Array<MkBook>,
    about: string|null,
    avatar: string|null,
    color: string|null,
    home: string|null,
    total_views: number|null,
    total_rates: number|null,
    total_contents: number|null,
    types: Array<MkFullType>,
    favorites_count: number|null,
    notes_count: number|null,
    unseen_notifications: number|null,
}

