/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkChat } from "./chat";
import { MkUser } from "./user";

export type MkChatMessage = {
    id: number,
    user_id: number,
    chat_id: number,
    fwd_id: number|null,
    reply_to_id: number|null,
    message: string,
    has_media: number,
    out: boolean,
    created_at: Date,
    updated_at: Date,
    order_timestamp: number,
}

export type MkCreateMessage = {
    message: string,
    order_timestamp: number,
    reply_to_id: number|null,
    fwd_id: number|null,
}

export type MkEditMessage = {
    message: string,
}

export type MkFullChatMessage = {
    id: number,
    user_id: number,
    chat_id: number,
    fwd_id: number|null,
    reply_to_id: number|null,
    message: string,
    has_media: number,
    out: boolean,
    created_at: Date,
    updated_at: Date,
    order_timestamp: number,
    user: MkUser,
    chat: MkChat,
    fwd: MkChatMessage|null,
    reply_to: MkChatMessage|null,
    reply_to_user: MkUser|null,
    fwd_from: MkUser|null,
}

