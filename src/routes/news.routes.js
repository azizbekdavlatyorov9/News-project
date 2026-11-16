const Router = require("express")
const { getAllNews, getOneNew, addNews, search, updateNews, deleteNews } = require("../controllers/news.controller")
const authenticate = require("../middlewares/authenticate")

const newsRouter = Router()

newsRouter.get("/get_all_news", getAllNews)
newsRouter.get("/get_one_new/:id", getOneNew)
newsRouter.get("/new_search", search)
newsRouter.post("/add_news", authenticate, addNews)
newsRouter.put("/update_new/:id", updateNews)
newsRouter.delete("/delete_new/:id", deleteNews)

module.exports = newsRouter 