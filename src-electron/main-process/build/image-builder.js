import MainProcessor from './../processors/main-processor';
import ImageData from './image-data'
export default class ImageBuilder {
    constructor() {
        this.mainProcessor = new MainProcessor();
    }

    async build(url, id) {
        const processedData = await this.mainProcessor.process(url);
        if (typeof processedData !== "string") {
            return processedData;
        }
        return new ImageData(id, url, processedData);
    }
}