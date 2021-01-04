import { MutationTree } from 'vuex';
import { LinkStateInterface, ImageData } from './state';

const mutation: MutationTree<LinkStateInterface> = {
  toggleFavorites(state: LinkStateInterface, active: boolean) {
    state.showFavorites = active;
  },
  setImages(state: LinkStateInterface, images: ImageData[]) {
    state.images = images;
  },
  addImage(state: LinkStateInterface, image: ImageData) {
    state.images.push(image);
  },
  removeImage(state: LinkStateInterface, id: number) {
    state.images = state.images.filter(img => img.id !== id);
  },
  updateImage(state: LinkStateInterface, image: ImageData) {
    state.images = state.images.map(img => img.id === image.id ? image : img);
  }
};

export default mutation;
