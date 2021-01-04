export default class ImageProcessor {
    process(blob) {
        return Buffer.from(blob).toString('base64');
    }
}