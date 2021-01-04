export interface ImageData {
  url: string;
  base64Url: string;
  favorite: boolean;
  id: number;
  domain: string;
}

export interface LinkStateInterface {
  showFavorites: boolean;
  images: ImageData[];
  addingImage: boolean;
}

function state(): LinkStateInterface {
  return {
    showFavorites: JSON.parse(localStorage.getItem("favorites") || "false"),
    images: [],
    addingImage: false
  }
}

export default state;
