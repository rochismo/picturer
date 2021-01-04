import ImageRepository from "./../repositories/image.repository";
import ImageBuilder from "./../build/image-builder";

export default class ImageService {
  constructor() {
    this.imageRepository = new ImageRepository();
    this.builder = new ImageBuilder();
  }

  exists(url) {
    const existing = this.imageRepository.findByUrl(url);
    return existing.length > 0; 
  }

  async add(url) {
    if (this.exists(url)) {
      return { exists: true };
    }
    const lastId = this.imageRepository.getLastId() + 1;
    const imageData = await this.builder.build(url, lastId);
    if (imageData.hadError) {
      return imageData;
    }
    this.imageRepository.add(imageData);
    return imageData;
  }

  remove(id) {
    this.imageRepository.remove(id);
  }

  async update(imageData) {
    if (this.exists(imageData.url)) {
      return { exists: true };
    }
    const newData = await this.builder.build(imageData.url, imageData.id);
    if (newData.hadError) {
      return newData;
    }
    this.imageRepository.update(newData);
    return newData;
  }

  setFavorite(image) {
    this.imageRepository.setFavorite(image.id, image.favorite);
  }

  getAll() {
    return this.imageRepository.getAll();
  }
}
