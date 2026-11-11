const multer = require('multer')
const fs = require('fs')
const path = require('path')


const uploadPath = path.join(__dirname, "..", 'uploads', 'images')

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })

    const storage = multer.diskStorage({
        destination: (req, res, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const UniqueFilename = Math.random() * 1000 + "_" + Date.now() + ext;
            cb(null, UniqueFilename);

        }
    })
}


const fileFilter = (req, file, cb) => {
    const allowTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp']
    if (!allowTypes.includes(file.mimetype)) {
        return cb(new Error('allowed types(png, jpeg, jpg, webp) are required'));

    }
    cb(null, true)
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
}).array('images', 5)

const uploadMiddleware = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ error: "Fayl hajmi 5 MB dan oshmasligi kerak" })
            }
            if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({ error: "Bitta so\'rovda ko\'pi bilan 5 ta fayl yuklash mumkin" })
            }
        } else if (err) {
            return res.status(400).json({ error: 'Ruxsat etilmagan fayl formati' })
        }


        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const isValid = await FileService.verifyMagicBytes(file.path);
                if (!isValid) {
                    req.files.forEach(e => {
                        fileService.deleteFile(e.filename)
                        return res.status(415).json({ error: "Haqiqiy fayl turi mos kelmadi" })
                    });
                }
            }
        }
        next()
    })
}

module.exports = uploadMiddleware


