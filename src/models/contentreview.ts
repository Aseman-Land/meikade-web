/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkUser } from "./user";

export type MkContentReview = {
    id: number,
    content_id: number,
    user_id: number,
    review: string,
    created_at: Date,
    updated_at: Date,
}

export type MkFullContentReview = {
    id: number,
    content_id: number,
    user_id: number,
    review: string,
    created_at: Date,
    updated_at: Date,
    user: MkUser|null,
}

export type MkPostReviewRequest = {
    review: string,
}

