/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkUserAchievement } from "./achievement";
import { MkContent } from "./content";
import { MkContentComment } from "./contentcomment";
import { MkContentReview } from "./contentreview";
import { MkUser } from "./user";

export type MkFullNotification = {
    id: number,
    user_id: number,
    notification_type: number,
    actor_user_id: number,
    content_id: number|null,
    verse_id: number|null,
    comment_id: number|null,
    review_id: number|null,
    user_achievement: MkUserAchievement|null,
    user_achievement_id: number|null,
    seen: number,
    message: string,
    created_at: Date,
    content: MkContent|null,
    comment: MkContentComment|null,
    review: MkContentReview|null,
    actor_user: MkUser|null,
}

export type MkNotification = {
    id: number,
    user_id: number,
    notification_type: number,
    actor_user_id: number,
    content_id: number|null,
    verse_id: number|null,
    comment_id: number|null,
    review_id: number|null,
    user_achievement_id: number|null,
    seen: number,
    message: string,
    created_at: Date,
}

