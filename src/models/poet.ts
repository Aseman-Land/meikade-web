 
export type PoetType = {
    id: number,
    name: string,
    name_en: string;
}

export type Poet = {
    id: number,
    username: string,
    name: string,
    description	: string|null,
    image: string|null,
    wikipedia: string|null,
    color: string|null,
    views: number,
    types : Array<PoetType>,
}
