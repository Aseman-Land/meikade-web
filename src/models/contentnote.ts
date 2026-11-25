/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkFullContent, MkFullContentVerses } from "./content";
import { MkUser } from "./user";

export type MkContentNote = {
    id: number,
    content_id: number,
    user_id: number,
    parent_id: number,
    note: string,
    created_at: Date,
    updated_at: Date,
}

export type MkContentVerseNote = {
    id: number,
    content_id: number,
    verse_id: number,
    user_id: number,
    parent_id: number,
    note: string,
    created_at: Date,
    updated_at: Date,
}

export type MkFullContentNote = {
    id: number,
    content_id: number,
    user_id: number,
    parent_id: number,
    note: string,
    created_at: Date,
    updated_at: Date,
    user: MkUser|null,
    parent: MkFullContentNote|null,
}

export type MkFullContentVerseNote = {
    id: number,
    content_id: number,
    verse_id: number,
    user_id: number,
    parent_id: number,
    note: string,
    created_at: Date,
    updated_at: Date,
    user: MkUser|null,
    parent: MkFullContentVerseNote|null,
}

export type MkMyContentNote = {
    id: number,
    content_id: number,
    user_id: number,
    parent_id: number,
    note: string,
    created_at: Date,
    updated_at: Date,
    content: MkFullContent|null,
}

export type MkMyContentVerseNote = {
    id: number,
    content_id: number,
    verse_id: number,
    user_id: number,
    parent_id: number,
    note: string,
    created_at: Date,
    updated_at: Date,
    verse: MkFullContentVerses|null,
}

export type MkPostNoteRequest = {
    note: string,
    parent_id: number|null,
}

