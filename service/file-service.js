const fs = require("fs");

class FileService {
  uploadDirectory = __dirname + "/../static/uploads/";

  deleteFileFromUploads(name) {
    try {
      fs.unlinkSync(this.uploadDirectory + name);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new FileService();
