const low = require("lowdb");
const path = require("path");
const FileSync = require("lowdb/adapters/FileSync");
const { app } = require("electron")
const fs = require("fs");
export default class ImageRepository {
  constructor() {
    const dir = path.join(app.getPath("documents"), "Picturer");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const adapter = new FileSync(path.join(dir, "database.json"));
    this.db = low(adapter);

    this.db.defaults({ images: [] }).write();
  }

  add(image) {
    this.db
      .get("images")
      .push(image)
      .write();
  }

  remove(id) {
    this.db
      .get("images")
      .remove({ id })
      .write();
  }

  setFavorite(id, favorite) {
    this.db.get("images").find({ id }).assign({ favorite }).write();
  }

  update(image) {
    this.db.get("images").find({ id: image.id }).assign(image).write();
  }

  getAll() {
    return this.db.get("images").value();
  }

  getLastId() {
    const id = this.db
      .get("images")
      .map("id")
      .reverse()
      .take(1)
      .value();
    return parseInt(id) || 0;
  }

  findByUrl(url) {
    const found = this.db
      .get("images")
      .filter({ url })
      .value();
    return found;
  }
}
