const path = require("path");

const {jpegFolder} = require("../config");
const {writeFile, removeFile} = require("../utils/fs");
const {generateId} = require("../utils/generateId");

module.exports = class Jpeg {
  constructor(id, size, uploadedAt) {
    this.id = id ?? generateId();
    this.size = size ?? 0;
    this.uploadedAt = uploadedAt ?? Date.now();
  }

  getOriginalName() {
    return `${this.id}_original.jpeg`;
  }

  async saveOriginal(content) {
    await writeFile(path.resolve(jpegFolder, this.getOriginalName()), content);
  }

  async removeOriginal() {
    await removeFile(path.resolve(jpegFolder, this.getOriginalName()));
  }

  toJSON() {
    return {
      id: this.id,
      size: this.size,
      uploadedAt: this.uploadedAt
    };
  }
};
