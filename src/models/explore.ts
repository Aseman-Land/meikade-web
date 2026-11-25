/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkBookResult } from "./book";
import { MkFullContent } from "./content";
import { MkFullUser } from "./user";

export type MkExplore = {
    rows: Array<MkExploreRow>,
}

export type MkExploreRow = {
    title: string,
    scrollable: boolean,
    main_menu: boolean,
    contents: Array<MkFullContent>|null,
    users: Array<MkFullUser>|null,
    books: Array<MkBookResult>|null,
}

