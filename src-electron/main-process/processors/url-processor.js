import axios from "axios";
import { URL } from "url";
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

  async process(url = "") {
    this._validateUrl(url);
    const response = await axios.get(url, { responseType: "arraybuffer" });
    if (!this._isImageUrl(response)) {
      throw new Error("Link does not contain an image");
    }
    return response.data;
  }
}
