const Router = require("express");
const authenticate = require("../middlewares/authenticate");
const {
  getAllTags,
  getTagbySlug,
  addTag,
  updateTag,
  deleteTag,
} = require("../controllers/tags.controller");

const TagsRouter = Router();

TagsRouter.get("/get_all_tags", getAllTags);
TagsRouter.get("/get_one_tag", getTagbySlug);
TagsRouter.post("/addTag", authenticate, addTag);
TagsRouter.put("/update_tag", authenticate, updateTag);
TagsRouter.delete("/delete_tag", authenticate, deleteTag);

module.exports = TagsRouter;
