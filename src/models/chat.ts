/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkUser } from "./user";

export type MkChat = {
    id: number,
    owner_id: number,
    title: string|null,
    chat_type: string,
    created_at: Date,
    updated_at: Date,
}

export type MkCreateChat = {
    title: string|null,
    chat_type: string,
    participants: Array<number>,
}

export type MkFullChat = {
    id: number,
    owner_id: number,
    title: string|null,
    chat_type: string,
    created_at: Date,
    updated_at: Date,
    owner: MkUser|null,
    participants: Array<MkUser>,
}

