/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkFullContent, MkFullContentVerses } from "./content";
import { MkUser } from "./user";

export type MkAddList = {
    title: string,
    description: string,
    public_list: number|null,
    color: string,
}

export type MkAppendListReq = {
    content_id: number,
}

export type MkAppendVerseListReq = {
    verse_id: number,
}

export type MkContentVerseList = {
    verse_id: number,
    lists: Array<MkList>,
}

export type MkEditList = {
    title: string|null,
    description: string|null,
    public_list: number|null,
    color: string|null,
}

export type MkFullListResult = {
    id: number,
    title: string,
    description: string,
    owner_id: number,
    color: string,
    public_book: number,
    created_at: Date,
    updated_at: Date,
    owner: MkUser|null,
    list_items_count: number,
}

export type MkGetListsRequest = {
    user_id: number|null,
    search: string|null,
    offset: number|null,
    limit: number|null,
}

export type MkList = {
    id: number,
    title: string,
    description: string,
    owner_id: number,
    color: string,
    public_book: number,
    created_at: Date,
    updated_at: Date,
    list_items_count: number,
}

export type MkListContent = {
    id: number,
    content_id: number,
    content: MkFullContent|null,
    created_at: Date,
    updated_at: Date,
}

export type MkListContentVerse = {
    id: number,
    content_id: number,
    verse_id: number,
    verse: MkFullContentVerses|null,
    created_at: Date,
    updated_at: Date,
}

export type MkListResult = {
    id: number,
    title: string,
    description: string,
    owner_id: number,
    color: string,
    public_book: number,
    created_at: Date,
    updated_at: Date,
    owner: MkUser|null,
    list_items_count: number,
}

