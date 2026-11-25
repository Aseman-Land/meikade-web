/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkFullChat } from "./chat";
import { MkFullChatMessage } from "./chatmessage";

export type MkUpdate = {
    new_chat: MkFullChat|null,
    delete_chat_id: number|null,
    new_message: MkFullChatMessage|null,
    edit_message: MkFullChatMessage|null,
    delete_message_id: number|null,
}

