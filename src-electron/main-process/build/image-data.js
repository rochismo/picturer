import extract from 'extract-domain';

export default class ImageData {
    constructor(id, url, base64Image) {
        this.id = id;
        this.url = url;
        this.base64Url = base64Image;
        this.favorite = false;
        this.domain = extract(url);
    }
}