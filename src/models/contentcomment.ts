/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkUser } from "./user";

export type MkContentComment = {
    id: number,
    content_id: number,
    user_id: number,
    parent_id: number,
    comment: string,
    created_at: Date,
    updated_at: Date,
}

export type MkFullContentComment = {
    id: number,
    content_id: number,
    user_id: number,
    parent_id: number,
    comment: string,
    created_at: Date,
    updated_at: Date,
    user: MkUser|null,
    parent: MkFullContentComment|null,
}

export type MkPostCommentRequest = {
    comment: string,
    parent_id: number|null,
}

