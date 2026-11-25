/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import { MkUserAchievement } from "./achievement";
import { MkBook } from "./book";
import { MkContentComment } from "./contentcomment";
import { MkContentReview } from "./contentreview";
import { MkAddPoem, MkPoem } from "./poem";
import { MkType } from "./type";
import { MkUser } from "./user";

export type MkAddContent = {
    title: string,
    description: string,
    book_id: number|null,
    type_id: number,
    image: string|null,
    cover: string|null,
    allow_comment: number,
    poem: MkAddPoem|null,
    quote_content_id: number|null,
    quote_content_verse_id: number|null,
    published: number,
}

export type MkContent = {
    id: number,
    title: string,
    description: string,
    book_id: number|null,
    type_id: number,
    owner_id: number,
    image: string,
    cover: string,
    published: number,
    suspended: number,
    reviewed: number,
    treasure: number,
    allow_comment: number,
    views: number,
    rates: number,
    comments: number,
    created_at: Date,
    updated_at: Date,
}

export type MkContentAiAnalize = {
    id: number,
    ganjoor_analysis: string|null,
}

export type MkContentExportColor = {
    key: string,
    title: string,
    color: string,
}

export type MkContentExportFont = {
    key: string,
    title: string,
}

export type MkContentMeDetails = {
    rate: number,
}

export type MkContentVerseRate = {
    verse_id: number,
    rate: number,
}

export type MkEditContent = {
    title: string|null,
    description: string|null,
    book_id: number|null|null,
    type_id: number|null,
    image: string|null,
    cover: string|null,
    allow_comment: number|null,
    poem: MkAddPoem|null,
    published: number|null,
}

export type MkFullActivity = {
    id: number,
    content_id: number|null,
    target_content: MkFullContent|null,
    target_content_verse: MkFullContentVerses|null,
    target_user: MkUser|null,
    target_review: MkContentReview|null,
    target_comment: MkContentComment|null,
    target_user_achievement: MkUserAchievement|null,
    type: string,
    target_content_id: number|null,
    target_content_verse_id: number|null,
    target_user_id: number|null,
    target_review_id: number|null,
    target_comment_id: number|null,
    target_user_achievement_id: number|null,
    created_at: Date,
    updated_at: Date,
}

export type MkFullBookResult = {
    id: number,
    title: string|null,
    description: string|null,
    author_id: string|null,
    parent_id: number|null,
    public_book: number,
    created_at: Date,
    updated_at: Date,
    author: MkUser|null,
    parent: MkBook|null,
    books: Array<MkBook>,
    contents: Array<MkContent>,
    total_views: number|null,
    total_rates: number|null,
    total_contents: number|null,
}

export type MkFullContent = {
    id: number,
    next_content_id: number|null,
    previous_content_id: number|null,
    title: string,
    description: string,
    book_id: number|null,
    type_id: number,
    owner_id: number,
    image: string,
    cover: string,
    published: number,
    suspended: number,
    reviewed: number,
    treasure: number,
    allow_comment: number,
    views: number,
    rates: number,
    comments: number,
    created_at: Date,
    updated_at: Date,
    book: MkBook|null,
    owner: MkUser|null,
    type: MkType|null,
    ai_analize: MkContentAiAnalize|null,
    poem: MkPoem|null,
    activity: MkFullActivity|null,
    me: MkContentMeDetails|null,
}

export type MkFullContentVerses = {
    id: number,
    content_id: number|null,
    master: number,
    position: number,
    text: string,
    content: MkFullContent|null,
    order: number,
}

export type MkFullContentVersesResult = {
    verses: Array<MkFullContentVerses>,
    offset: number,
}

export type MkGetContentVersesRequest = {
    author_id: number|null,
    book_id: number|null,
    content_id: number|null,
    intelligence_search: boolean|null,
    search: string,
    offset: number|null,
    limit: number|null,
}

export type MkGetContentsRequest = {
    author_id: number|null,
    book_id: number|null,
    sort_by_rate: boolean|null,
    intelligence_search: boolean|null,
    search: string|null,
    offset: number|null,
    limit: number|null,
}

export type MkGetFeedRequest = {
    show_verses: boolean|null,
    offset: number|null,
    limit: number|null,
}

export type MkGetImageRequest = {
    o: string|null,
}

export type MkGetRandomContentRequest = {
    author_id: string|null,
    book_id: number|null,
}

export type MkGetTopRequest = {
    poet_id: number|null,
    book_id: number|null,
    type_code: string|null,
    legacy_type_id: number|null,
    offset: number|null,
    limit: number|null,
}

export type MkMyContentRate = {
    id: number,
    content_id: number,
    content: MkFullContent|null,
    rate: number,
    created_at: Date,
    updated_at: Date,
}

export type MkMyContentVerseRate = {
    id: number,
    content_id: number,
    verse: MkFullContentVerses|null,
    rate: number,
    created_at: Date,
    updated_at: Date,
}

export type MkRateContentRequest = {
    rate: number,
}

