/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkAddContentVerses, MkContentVerses } from "./contentverses";

export type MkAddPoem = {
    verses: Array<MkAddContentVerses>,
}

export type MkPoem = {
    content_id: number,
    verses: Array<MkContentVerses>,
    phrase: string|null,
}

