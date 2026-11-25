/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkBook } from "./book";
import { MkContent } from "./content";
import { MkUser } from "./user";

export type MkAchievement = {
    id: number,
    title: string,
    type: string,
    category: string|null,
    summery: string|null,
    activity_type: string|null,
    icon: string,
    color: string,
    min_duration: number|null,
    min_count: number|null,
    min_days: number|null,
    repeat: number|null,
    books: Array<MkBook|null>,
    users: Array<MkUser>,
    contents: Array<MkContent|null>,
    created_at: Date,
    image: string|null,
    min_verse_count: number|null,
    description: string|null,
}

export type MkAchievementProgress = {
    id: number,
    title: string,
    type: string,
    category: string|null,
    summery: string|null,
    activity_type: string|null,
    icon: string,
    color: string,
    min_duration: number|null,
    min_count: number|null,
    min_days: number|null,
    repeat: number|null,
    is_completed: number|null,
    progress_verses: number|null,
    progress_duration: number|null,
    progress_count: number|null,
    progress_days: number|null,
    created_at: Date,
    image: string|null,
    min_verse_count: number|null,
    description: string|null,
}

export type MkUserAchievement = {
    id: number,
    user_id: number,
    achievement_id: number,
    achievement: MkAchievement|null,
    user: MkUser|null,
    created_at: Date,
}

