/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkUser } from "./user";

export type MkCheckCodeRequest = {
    code: string,
}

export type MkCheckInviteCodeResult = {
    available: boolean,
}

export type MkFullInvitation = {
    id: number,
    user_id: number,
    code: string,
    created_at: Date,
    updated_at: Date,
    user: MkUser|null,
    capacity: number,
}

export type MkInvitation = {
    id: number,
    user_id: number,
    code: string,
    capacity: number,
    created_at: Date,
    updated_at: Date,
}

