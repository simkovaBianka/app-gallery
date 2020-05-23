import { Image } from './image';

export interface Gallery {
    name: string;
    path: string;
    image?: Image;

    thumbnailImage: string; //blob object small
    realSizeImage: string; //blob object big
    hover: boolean;

    size: number;
}
