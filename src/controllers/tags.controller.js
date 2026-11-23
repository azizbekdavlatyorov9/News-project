const slugify = require("slugify");
const tagSchema = require("../schema/tags.schema.js");
const newsSchema = require("../schema/news.schema.js");
const CustomErrorHandler = require("../error/error.js");

const getAllTags = async (req, res, next) => {
  try {
    const tags = tagSchema.find().sort("name");
    res.status(200).json({
      total: tags.length,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

const getTagbySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const tag = await Tag.findOne({ slug });
    if (!tag) {
      throw CustomErrorHandler.NotFound("Teg topilmadi");
    }
    res.status(200).json({ data: tag });
  } catch (error) {
    next(error);
  }
};

const addTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      throw CustomErrorHandler;
    }
    const existingTag = await Tag.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });
    if (existingTag) {
      throw CustomErrorHandler.BadRequest("Bu nomdagi teg allaqachon mavjud");
    }

    const slug = slugify(name.trim(), { lower: true, strict: true });

    const tag = await tagSchema.create({
      name: name.trim(),
      slug,
    });
    res.status(200).json({
      message: "Tag muvaffaqiyatli yaratildi",
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const tag = await tagSchema.findById(id);

    if (!tag) {
      throw CustomErrorHandler.NotFound("Tag topilmadi");
    }

    if (name && name.trim()) {
      const duplicate = await Tag.findOne({
        _id: { $ne: id },
        name: { $regex: `${name.trim()}$`, $options: "i" },
      });
      if (duplicate) {
        throw CustomErrorHandler.BadRequest("Bu nomdagi teg allaqachon mavjud");
      }

      ((tag.name = name.trim()),
        (tag.slug = slugify(name.trim(), { lower: true, strict: true })));
    }
    await tag.save();

    res.status(200).json({ message: "Teg yangilandi", data: tag });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await tagSchema.findById(id);
    if (!tag) {
      throw CustomErrorHandler.NotFound("Tag topilmadi");
    }
    await newsSchema.updateMany({ tags: id }, { $pull: { tags: id } });
    
    await tagSchema.findByIdAndDelete(id)

    res.status(200).json({message:"Teg o'chirildi"})
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTags,
  getTagbySlug,
  addTag,
  updateTag,
  deleteTag
}