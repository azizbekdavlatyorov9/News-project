const CustomErrorHandler = require('../error/error')
const newsSchema = require('../schema/news.schema')
const slugify = require('slugify')

const getAllNews = async (req, res, next) => {
    try {
        const news = await newsSchema.find({ status: "PUBLISHED" })
            .populate("author", "name")
            .populate("category", "title slug")
            .populate("tags", "name")

        res.status(200).json("news")
    } catch (error) {
        next(error)
    }
}

const search = async (req, res, next) => {
    try {
        const { searchingValue } = req.query;
        const news = newsSchema.find({
            title: { $regex: searchingValue, $options: "i" },
        });
        res.status(200).json(news)
    } catch (error) {
        next(error)
    }
}

const addNews = async (req, res, next) => {
    try {
        const {
            title,
            description,
            images,
            category,
            tags,
        } = req.body

        let generatedSlug = slugify(title, { lower: true, strict: true })
        const existingNews = await News.findOne({ slug: generatedSlug })
        if (existingNews) {
            const randomCode = Math.random().toString(36).substring(2, 6);
            generatedSlug = `${generatedSlug}-${randomCode}`
        }

        const isAdmin = req.user.role === "ADMIN"
        const status = isAdmin ? "PUBLISHED" : "PENDING"
        const publishedAt = isAdmin ? new Date() : null

        const newNews = await newsSchema.create({
            title,
            description,
            slug: generatedSlug,
            images,
            category,
            tags,
            author: req.user._id,
            status,
            publishedAt
        })
        res.status(201).json("Added new book")
    } catch (error) {
        next(error)
    }
}
const getOneNews = async (req, res, next) => {
    try {
        const { id } = req.params
        const foundedNews = await newsSchema.findById(id)

        if (!foundedNews) {
            throw CustomErrorHandler.NotFound('News not found')
        }
        res.status(200).json({ data: foundedNews })
    } catch (error) {
        next(error)
    }
}
const updateNews = async (req, res, next) => {
    try {
        const { id } = req.params
        const {
            title,
            description,
            images,
            category,
            tags,
        } = req.body

        const foundedNews = await newsSchema.findById(id)
        if (!foundedNews) {
            throw new CustomErrorHandler.NotFound("News not found")
        }
        const newNews = await newsSchema.updateOne({_id:id}{
            title,
            description,
            slug: generatedSlug,
            images,
            category,
            tags,   
            author: req.user._id,
            status,
            publishedAt
        })
        res.status(201).json("Updated book")
    } catch (error) {
        next(error)
    }
}
const deleteNews = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
}