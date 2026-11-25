const Categories = require("../schema/categories.schema");
const slugify = require("slugify");
const News = require("../schema/news.schema");
const CustomErrorHandler = require("../error/error");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find().sort("name");
    res.status(200).json({
      total: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Categories.findOne({ slug });

    if (!category) {
      throw CustomErrorHandler.NotFound("Kategoriya topilmadi");
    }
    res.status(200).json({ data: category });
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim()) {
      throw CustomErrorHandler.BadRequest("Kategoriya kiritilishi kerak");
    }
    const existingCategory = await Categories.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existingCategory) {
      throw CustomErrorHandler.BadRequest(
        "Bu nomdagi kategoriya allaqachon bor",
      );
    }
    const slug = slugify(name.trim(), { lower: true, strict: true });

    const category = await Categories.create({
      name: name.trim(),
      slug,
      description: description ? description.trim() : undefined,
    });
    res.status(201).json({
      message:"Kategoriya muvaffaqiyatli yaratildi",
      data:category
    })
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
