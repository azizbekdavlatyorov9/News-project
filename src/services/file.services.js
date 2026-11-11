const fs = require('fs');
const path = require('path');
const { fileTypeFromFile } = require('file-type');

const uploadPath = path.join(__dirname, '..', 'uploads', 'news');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

class FileService {
  async verifyMagicBytes(filePath) {
    const type = await fileTypeFromFile(filePath);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!type || !allowedTypes.includes(type.mime)) {
      return false;
    }
    return true;
  }

  deleteFile(filename) {
    try {
      const filePath = path.join(uploadPath, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Faylni o'chirishda xatolik: ${error.message}`);
    }
  }

  deleteFiles(filenames = []) {
    filenames.forEach(filename => this.deleteFile(filename));
  }
}

module.exports = new FileService();