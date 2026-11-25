export type API<T> = {
    status: boolean,
    message: string | undefined,
    result: T | undefined,
    code: number | undefined,
}

export type Upload = {
    file?: File,
    blob?: {
        data: Blob,
        filename: string,
    },
}
