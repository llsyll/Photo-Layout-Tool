export interface Photo {
    id: string;
    originalUrl: string;
    croppedUrl?: string;
    crop?: { x: number; y: number };
    zoom?: number;
}

export type PageSize = 'A4';

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

// Default Constants
export const DEFAULT_PHOTO_WIDTH_MM = 25;
export const DEFAULT_PHOTO_HEIGHT_MM = 35;
export const DEFAULT_GAP_MM = 3;

export interface LayoutSettings {
    photoWidth: number;
    photoHeight: number;
    gap: number;
}
