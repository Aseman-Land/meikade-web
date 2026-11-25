/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */


export type MkAddContentVerses = {
    master: number,
    position: number,
    text: string,
}

export type MkContentVerses = {
    id: number,
    content_id: number,
    master: number,
    position: number,
    text: string,
    order: number,
    ai_analize: MkContentVersesAiAnalize|null,
}

export type MkContentVersesAiAnalize = {
    id: number,
    ganjoor_analysis: string|null,
}

export type MkContentVersesAnalize = {
    verse_id: number,
    verse_text: string|null,
    content_id: number,
    simple_meaning: string,
    ganjoor_analysis: string,
    deep_analysis: string,
}

export type MkContentVersesResult = {
    verses: Array<MkContentVerses>,
    offset: number,
}

