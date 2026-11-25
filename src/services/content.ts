/**
 * ⚠️ 🤔 Look at this file. Now look at your keyboard. Now back to this file.
 * This is an AUTOMATICALLY GENERATED FILE. If you make changes here,
 * Git will show your name in the `git blame`, but the generator will erase it.
 * Don't play yourself. Don't touch it.
 */

import axios from "axios";
import { globalHandleError } from "../layouts/mainframe";
import { API } from "../models/api";
import { MkAddContent, MkContentExportColor, MkContentExportFont, MkContentVerseRate, MkEditContent, MkFullContent, MkFullContentVerses, MkFullContentVersesResult, MkGetContentVersesRequest, MkGetContentsRequest, MkGetFeedRequest, MkGetRandomContentRequest, MkGetTopRequest, MkMyContentRate, MkMyContentVerseRate, MkRateContentRequest } from "../models/content";
import { MkContentComment, MkFullContentComment, MkPostCommentRequest } from "../models/contentcomment";
import { MkContentNote, MkContentVerseNote, MkFullContentNote, MkFullContentVerseNote, MkMyContentNote, MkMyContentVerseNote, MkPostNoteRequest } from "../models/contentnote";
import { MkContentReview, MkFullContentReview, MkPostReviewRequest } from "../models/contentreview";
import { MkContentVersesAnalize, MkContentVersesResult } from "../models/contentverses";
import { MkGetGeneralRequest } from "../models/general";
import { MkContentVerseList, MkList } from "../models/list";
import request from "../utils/axios";

export namespace MkContentServices {

    export const analizeVerse = async (content_id: number, verse_id: number): Promise<API<Array<MkContentVersesAnalize>>> => {
        try {
            const res = await request.get<API<Array<MkContentVersesAnalize>>>(`/v4/content/${content_id}/verses/${verse_id}/analize`);
            const resData: API<Array<MkContentVersesAnalize>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on analizeVerse");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkContentVersesAnalize>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "analizeVerse failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const deleteComment = async (content_id: number, comment_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/content/${content_id}/comments/${comment_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteComment");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteComment failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const deleteContent = async (content_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/content/${content_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteContent");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteContent failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const deleteNote = async (content_id: number, note_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/content/${content_id}/notes/${note_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteNote");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteNote failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const deleteReview = async (content_id: number, review_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/content/${content_id}/reviews/${review_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteReview");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteReview failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const deleteVerseNote = async (content_id: number, verse_id: number, note_id: number): Promise<API<boolean>> => {
        try {
            const res = await request.delete<API<boolean>>(`/v4/content/${content_id}/verses/${verse_id}/notes/${note_id}`);
            const resData: API<boolean> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on deleteVerseNote");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<boolean>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "deleteVerseNote failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const edit = async (content_id: number, input: MkEditContent): Promise<API<MkFullContent>> => {
        try {
            const res = await request.patch<API<MkFullContent>>(`/v4/content/${content_id}`, input);
            const resData: API<MkFullContent> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on edit");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullContent>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "edit failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const feed = async (query: MkGetFeedRequest): Promise<API<Array<MkFullContent>>> => {
        try {
            const res = await request.get<API<Array<MkFullContent>>>(`/v4/content/feed`, {params: query});
            const resData: API<Array<MkFullContent>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on feed");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContent>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "feed failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getAnalizedVerse = async (content_id: number, verse_id: number): Promise<API<Array<MkContentVersesAnalize>>> => {
        try {
            const res = await request.get<API<Array<MkContentVersesAnalize>>>(`/v4/content/${content_id}/verses/${verse_id}/get-analize`);
            const resData: API<Array<MkContentVersesAnalize>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getAnalizedVerse");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkContentVersesAnalize>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getAnalizedVerse failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContent = async (content_id: number): Promise<API<MkFullContent>> => {
        try {
            const res = await request.get<API<MkFullContent>>(`/v4/content/${content_id}`);
            const resData: API<MkFullContent> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContent");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullContent>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContent failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentAllVerseNotes = async (content_id: number, query: MkGetGeneralRequest): Promise<API<Array<MkFullContentVerseNote>>> => {
        try {
            const res = await request.get<API<Array<MkFullContentVerseNote>>>(`/v4/content/${content_id}/verses/notes`, {params: query});
            const resData: API<Array<MkFullContentVerseNote>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentAllVerseNotes");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContentVerseNote>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentAllVerseNotes failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentAllVerseRates = async (content_id: number): Promise<API<Array<MkContentVerseRate>>> => {
        try {
            const res = await request.get<API<Array<MkContentVerseRate>>>(`/v4/content/${content_id}/verses/rates`);
            const resData: API<Array<MkContentVerseRate>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentAllVerseRates");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkContentVerseRate>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentAllVerseRates failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentComments = async (content_id: number, query: MkGetGeneralRequest): Promise<API<Array<MkFullContentComment>>> => {
        try {
            const res = await request.get<API<Array<MkFullContentComment>>>(`/v4/content/${content_id}/comments`, {params: query});
            const resData: API<Array<MkFullContentComment>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentComments");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContentComment>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentComments failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentImageColors = async (): Promise<API<Array<MkContentExportColor>>> => {
        try {
            const res = await request.get<API<Array<MkContentExportColor>>>(`/v4/content/export/colors`);
            const resData: API<Array<MkContentExportColor>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentImageColors");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkContentExportColor>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentImageColors failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentImageFonts = async (): Promise<API<Array<MkContentExportFont>>> => {
        try {
            const res = await request.get<API<Array<MkContentExportFont>>>(`/v4/content/export/fonts`);
            const resData: API<Array<MkContentExportFont>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentImageFonts");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkContentExportFont>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentImageFonts failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentNotes = async (content_id: number, query: MkGetGeneralRequest): Promise<API<Array<MkFullContentNote>>> => {
        try {
            const res = await request.get<API<Array<MkFullContentNote>>>(`/v4/content/${content_id}/notes`, {params: query});
            const resData: API<Array<MkFullContentNote>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentNotes");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContentNote>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentNotes failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentRelateds = async (content_id: number, query: MkGetGeneralRequest): Promise<API<Array<MkFullContent>>> => {
        try {
            const res = await request.get<API<Array<MkFullContent>>>(`/v4/content/${content_id}/relateds`, {params: query});
            const resData: API<Array<MkFullContent>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentRelateds");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContent>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentRelateds failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentReviews = async (content_id: number, query: MkGetGeneralRequest): Promise<API<Array<MkFullContentReview>>> => {
        try {
            const res = await request.get<API<Array<MkFullContentReview>>>(`/v4/content/${content_id}/reviews`, {params: query});
            const resData: API<Array<MkFullContentReview>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentReviews");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContentReview>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentReviews failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentVerseNotes = async (content_id: number, verse_id: number, query: MkGetGeneralRequest): Promise<API<Array<MkFullContentVerseNote>>> => {
        try {
            const res = await request.get<API<Array<MkFullContentVerseNote>>>(`/v4/content/${content_id}/verses/${verse_id}/notes`, {params: query});
            const resData: API<Array<MkFullContentVerseNote>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentVerseNotes");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContentVerseNote>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentVerseNotes failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentVerses = async (content_id: number, query: MkGetGeneralRequest): Promise<API<MkContentVersesResult>> => {
        try {
            const res = await request.get<API<MkContentVersesResult>>(`/v4/content/${content_id}/verses`, {params: query});
            const resData: API<MkContentVersesResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentVerses");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkContentVersesResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentVerses failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getContentVersesRelateds = async (content_id: number, verse_id: number, query: MkGetGeneralRequest): Promise<API<MkFullContentVersesResult>> => {
        try {
            const res = await request.get<API<MkFullContentVersesResult>>(`/v4/content/${content_id}/verses/${verse_id}/relateds`, {params: query});
            const resData: API<MkFullContentVersesResult> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getContentVersesRelateds");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullContentVersesResult>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getContentVersesRelateds failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getPersonalLists = async (content_id: number): Promise<API<Array<MkList>>> => {
        try {
            const res = await request.get<API<Array<MkList>>>(`/v4/content/${content_id}/lists`);
            const resData: API<Array<MkList>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getPersonalLists");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkList>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getPersonalLists failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getPersonalSingleVerseLists = async (content_id: number, verse_id: number): Promise<API<Array<MkList>>> => {
        try {
            const res = await request.get<API<Array<MkList>>>(`/v4/content/${content_id}/verses/${verse_id}/lists`);
            const resData: API<Array<MkList>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getPersonalSingleVerseLists");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkList>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getPersonalSingleVerseLists failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const getPersonalVersesLists = async (content_id: number): Promise<API<Array<MkContentVerseList>>> => {
        try {
            const res = await request.get<API<Array<MkContentVerseList>>>(`/v4/content/${content_id}/verses-lists`);
            const resData: API<Array<MkContentVerseList>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on getPersonalVersesLists");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkContentVerseList>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "getPersonalVersesLists failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const insert = async (input: MkAddContent): Promise<API<MkFullContent>> => {
        try {
            const res = await request.post<API<MkFullContent>>(`/v4/content`, input);
            const resData: API<MkFullContent> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on insert");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullContent>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "insert failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const myNotes = async (query: MkGetGeneralRequest): Promise<API<Array<MkMyContentNote>>> => {
        try {
            const res = await request.get<API<Array<MkMyContentNote>>>(`/v4/content/me/notes`, {params: query});
            const resData: API<Array<MkMyContentNote>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on myNotes");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkMyContentNote>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "myNotes failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const myRates = async (query: MkGetGeneralRequest): Promise<API<Array<MkMyContentRate>>> => {
        try {
            const res = await request.get<API<Array<MkMyContentRate>>>(`/v4/content/me/rates`, {params: query});
            const resData: API<Array<MkMyContentRate>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on myRates");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkMyContentRate>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "myRates failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const myVersesNotes = async (query: MkGetGeneralRequest): Promise<API<Array<MkMyContentVerseNote>>> => {
        try {
            const res = await request.get<API<Array<MkMyContentVerseNote>>>(`/v4/content/me/notes/verses`, {params: query});
            const resData: API<Array<MkMyContentVerseNote>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on myVersesNotes");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkMyContentVerseNote>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "myVersesNotes failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const myVersesRates = async (query: MkGetGeneralRequest): Promise<API<Array<MkMyContentVerseRate>>> => {
        try {
            const res = await request.get<API<Array<MkMyContentVerseRate>>>(`/v4/content/me/rates/verses`, {params: query});
            const resData: API<Array<MkMyContentVerseRate>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on myVersesRates");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkMyContentVerseRate>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "myVersesRates failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const postComment = async (content_id: number, input: MkPostCommentRequest): Promise<API<MkContentComment>> => {
        try {
            const res = await request.post<API<MkContentComment>>(`/v4/content/${content_id}/comments`, input);
            const resData: API<MkContentComment> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on postComment");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkContentComment>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "postComment failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const postNote = async (content_id: number, input: MkPostNoteRequest): Promise<API<MkContentNote>> => {
        try {
            const res = await request.post<API<MkContentNote>>(`/v4/content/${content_id}/notes`, input);
            const resData: API<MkContentNote> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on postNote");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkContentNote>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "postNote failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const postReview = async (content_id: number, input: MkPostReviewRequest): Promise<API<MkContentReview>> => {
        try {
            const res = await request.post<API<MkContentReview>>(`/v4/content/${content_id}/reviews`, input);
            const resData: API<MkContentReview> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on postReview");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkContentReview>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "postReview failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const postVerseNote = async (content_id: number, verse_id: number, input: MkPostNoteRequest): Promise<API<MkContentVerseNote>> => {
        try {
            const res = await request.post<API<MkContentVerseNote>>(`/v4/content/${content_id}/verses/${verse_id}/notes`, input);
            const resData: API<MkContentVerseNote> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on postVerseNote");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkContentVerseNote>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "postVerseNote failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const random = async (query: MkGetRandomContentRequest): Promise<API<MkFullContent>> => {
        try {
            const res = await request.get<API<MkFullContent>>(`/v4/content/random`, {params: query});
            const resData: API<MkFullContent> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on random");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkFullContent>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "random failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const rateContent = async (content_id: number, input: MkRateContentRequest): Promise<API<number>> => {
        try {
            const res = await request.post<API<number>>(`/v4/content/${content_id}/rates`, input);
            const resData: API<number> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on rateContent");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<number>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "rateContent failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const rateContentVerse = async (content_id: number, verse_id: number, input: MkRateContentRequest): Promise<API<number>> => {
        try {
            const res = await request.post<API<number>>(`/v4/content/${content_id}/verses/${verse_id}/rates`, input);
            const resData: API<number> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on rateContentVerse");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<number>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "rateContentVerse failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const searchContentVerses = async (query: MkGetContentVersesRequest): Promise<API<Array<MkFullContentVerses>>> => {
        try {
            const res = await request.get<API<Array<MkFullContentVerses>>>(`/v4/content/search/verses`, {params: query});
            const resData: API<Array<MkFullContentVerses>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on searchContentVerses");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContentVerses>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "searchContentVerses failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const searchContents = async (query: MkGetContentsRequest): Promise<API<Array<MkFullContent>>> => {
        try {
            const res = await request.get<API<Array<MkFullContent>>>(`/v4/content/search`, {params: query});
            const resData: API<Array<MkFullContent>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on searchContents");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContent>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "searchContents failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const topRated = async (query: MkGetTopRequest): Promise<API<Array<MkFullContent>>> => {
        try {
            const res = await request.get<API<Array<MkFullContent>>>(`/v4/content/top/by-rate`, {params: query});
            const resData: API<Array<MkFullContent>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on topRated");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContent>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "topRated failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const topViewed = async (query: MkGetTopRequest): Promise<API<Array<MkFullContent>>> => {
        try {
            const res = await request.get<API<Array<MkFullContent>>>(`/v4/content/top/by-view`, {params: query});
            const resData: API<Array<MkFullContent>> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on topViewed");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<Array<MkFullContent>>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "topViewed failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const updateComment = async (content_id: number, comment_id: number, input: MkPostCommentRequest): Promise<API<MkContentComment>> => {
        try {
            const res = await request.patch<API<MkContentComment>>(`/v4/content/${content_id}/comments/${comment_id}`, input);
            const resData: API<MkContentComment> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on updateComment");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkContentComment>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "updateComment failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const updateNote = async (content_id: number, note_id: number, input: MkPostNoteRequest): Promise<API<MkContentNote>> => {
        try {
            const res = await request.patch<API<MkContentNote>>(`/v4/content/${content_id}/notes/${note_id}`, input);
            const resData: API<MkContentNote> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on updateNote");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkContentNote>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "updateNote failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const updateReview = async (content_id: number, review_id: number, input: MkPostReviewRequest): Promise<API<MkContentReview>> => {
        try {
            const res = await request.patch<API<MkContentReview>>(`/v4/content/${content_id}/reviews/${review_id}`, input);
            const resData: API<MkContentReview> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on updateReview");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkContentReview>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "updateReview failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };


    export const updateVerseNote = async (content_id: number, verse_id: number, note_id: number, input: MkPostNoteRequest): Promise<API<MkContentVerseNote>> => {
        try {
            const res = await request.patch<API<MkContentVerseNote>>(`/v4/content/${content_id}/verses/${verse_id}/notes/${note_id}`, input);
            const resData: API<MkContentVerseNote> = {...res.data, code: res.status}
            if (!resData.status) globalHandleError(resData.message ?? "Unknown error on updateVerseNote");
                return resData;
        } catch(e: any) {
            if (axios.isAxiosError<API<MkContentVerseNote>>(e) && e.response) {
                const serverResponse = e.response.data;
                globalHandleError(serverResponse?.message ?? `Error ${e.response.status}: Request failed`);
                return serverResponse;
            } else {
                let errorMessage = "updateVerseNote failed.";
                globalHandleError(errorMessage);
                return {result: undefined, status: false, message: errorMessage, code: undefined};
            };
        };
    };
}
