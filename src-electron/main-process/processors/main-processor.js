import ImageProcessor from "./image-processor";
import UrlProcessor from "./url-processor";
export default class MainProcessor {
  constructor() {
    this.imgProcessor = new ImageProcessor();
    this.urlProcessor = new UrlProcessor();
  }

  async process(url) {
    try {
      const blob = await this.urlProcessor.process(url);
      const imageData = await this.imgProcessor.process(blob);
      return imageData;
    } catch (e) {
      return { hadError: true, message: e.message };
    }
  }
}
