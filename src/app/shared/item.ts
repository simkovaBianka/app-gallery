interface Image {
    fullpath: string;
    name: string;
}

export interface Item {
    name: string;
    path: string;
    fullpath: string;
    image?: Image;

    thumbnailImage: string; // blob object small
    realSizeImage: string; // blob object big

    hover: boolean;
    size: number;
}
