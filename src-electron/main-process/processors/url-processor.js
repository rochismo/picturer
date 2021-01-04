import axios from "axios";
import { URL } from "url";
const errors = {
  404: "No image was found in your link",
  403: "You are not allowed to save this image",
  401: "You are not authorized to save this image",
  500: "There was an error with the remote server",
  999: "This link doesn't exist'"
};

export default class UrlProcessor {
  _isImageUrl(response) {
    const matched = response.headers["content-type"].match(/(image)+\//g);
    return matched ? matched.length != 0 : false;
  }
  _validateUrl(url) {
    try {
      new URL(url);
    } catch (e) {
      throw new Error("Invalid link");
    }
  }

  _handleResponseError(response) {
    const errorMessage = errors[response.status] || "Unknown error has occurred";
    throw new Error(errorMessage);
  }

  async process(url = "") {
    this._validateUrl(url);
    let response;
    try {
      response = await axios.get(url, { responseType: "arraybuffer" });
    } catch (e) {
      // It will always throw an error and exit
      const dataObject = e.response || { statusCode: 999 }
      this._handleResponseError(dataObject);
    }
    if (!this._isImageUrl(response)) {
      throw new Error("Link does not contain an image");
    }
    return response.data;
  }
}
