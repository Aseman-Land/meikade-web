/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */


export type MkAddDonate = {
    name: string|null,
    message: string|null,
    ref_id: string|null,
    amount: number|null,
}

export type MkDonate = {
    id: number,
    name: string|null,
    message: string|null,
    ref_id: string|null,
    amount: number|null,
    created_at: Date,
    updated_at: Date,
}

export type MkFullDonate = {
    id: number,
    name: string|null,
    message: string|null,
    ref_id: string|null,
    amount: number|null,
    created_at: Date,
    updated_at: Date,
}

export type MkGetDonatesRequest = {
    search: string|null,
    offset: number|null,
    limit: number|null,
}

