export interface ErrorData {
    hadError: boolean;
    message: string;
}

export interface Existing {
    exists: boolean;
}

export interface ImageData {
    url: string;
    base64Url: string;
    favorite: boolean;
    id: number;
    domain: string;
}