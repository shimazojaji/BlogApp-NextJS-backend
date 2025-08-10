const createHttpError = require("http-errors");
const path = require("path");
const {
  copyObject,
} = require("../../utils/functions");

const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { default: mongoose } = require("mongoose");
const { NewsModel } = require("../../models/news");

class NewsController extends Controller {
  constructor() {
    super();
  }
  async getAllNews(req, res) {
    let dbQuery = {};
    const user = req.user;
    let { search: search, categorySlug, sort, page, limit } = req.query;
    page = page || 1;
    limit = limit || 6;
    const skip = (page - 1) * limit;

    if (search) {
      const searchTerm = new RegExp(search, "ig");
      dbQuery["$or"] = [
        { title: searchTerm },
        { slug: searchTerm },
        { briefText: searchTerm },
        { text: searchTerm }
      ];
    }

    // if (search) dbQuery["$text"] = { $search: search }; // -> OLD METHOD TO SEARCH BASED ON INDEX

    if (categorySlug) {
      const categories = [categorySlug].flat(2);
      const categoryIds = [];
      for (const item of categories) {
        const { _id } = await CategoryModel.findOne({ slug: item });
        categoryIds.push(_id);
      }
      dbQuery["category"] = {
        $in: categoryIds,
      };
    }

    const sortQuery = {};
    if (!sort) sortQuery["createdAt"] = -1;
    if (sort) {
      if (sort === "latest") sortQuery["createdAt"] = -1;
      if (sort === "earliest") sortQuery["createdAt"] = 1;
      if (sort === "popular") sortQuery["likesCount"] = -1;
      if (sort === "time_desc") sortQuery["readingTime"] = -1;
      if (sort === "time_asc") sortQuery["readingTime"] = 1;
    }
    const posts = await PostModel.find(dbQuery, {
      comments: 0,
    })
      .populate([
        { path: "category", select: { title: 1, slug: 1 } },
        { path: "author", select: { name: 1, biography: 1, avatar: 1 } },
        {
          path: "related",
          model: "Post",
          select: {
            title: 1,
            slug: 1,
            bfireText: 1,
            coverImage: 1,
            author: 1,
          },
          populate: [
            {
              path: "author",
              model: "User",
              select: { name: 1, biography: 1, avatar: 1 },
            },
            {
              path: "category",
              model: "Category",
              select: { title: 1, slug: 1 },
            },
          ],
        },
      ])
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);

    const totalPages = Math.ceil(
      Number((await PostModel.find(dbQuery)).length) / limit
    );

    const transformedPosts = copyObject(posts);

    for (const post of transformedPosts) {
      await transformPost(post, user);
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پست های مدنظر شما",
        posts: transformedPosts,
        totalPages,
      },
    });
  }

  async addNewNews(req, res) {
    const { filename, fileUploadPath, ...rest } = req.body;
    await validateAddNewNews(rest);
    const {
      title,

      text,

    } = rest;



    if (!fileUploadPath || !filename)
      throw createHttpError.InternalServerError("کاور خبر را اپلود کنید");
    const fileAddress = path.join(fileUploadPath, filename);
    const coverImage = fileAddress.replace(/\\/g, "/");

    const news = await NewsModel.create({
      title,

      text,

      author,
      coverImage,
    });

    if (!news?._id) throw createHttpError.InternalServerError("خبر ثبت نشد");

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "خبر با موفقیت ایجاد شد",
        news,
      },
    });
  }
  async updateNews(req, res) {
    const { id } = req.params;
    const { filename, fileUploadPath, ...rest } = req.body;

    const news= await this.findPNewsById(id);
    const data = copyObject(rest);
   

    let coverImage = news.coverImage;

    if (fileUploadPath && filename) {
      const fileAddress = path.join(fileUploadPath, filename);
      coverImage = fileAddress.replace(/\\/g, "/");
    }

    const updateNewsResult = await NewsModel.updateOne(
      { _id: id },
      {
        $set: { ...data, coverImage },
      }
    );

    if (!updateNewsResult.modifiedCount)
      throw new createHttpError.InternalServerError(
        "به روزرسانی خبر انجام نشد"
      );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی خبر با موفقیت انجام شد",
      },
    });
  }
  async removeNews(req, res) {
    const { id } = req.params;
    await this.findPNewsById(id);
    const news = await NewsModel.findByIdAndDelete(id);
    if (!news._id) throw createHttpError.InternalServerError(" خبر حذف نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "خبر با موفقیت حذف شد",
      },
    });
  }
  async getNewsById(req, res) {
    const { id } = req.params;
    const news = await this.findNewsById(id);
  }
  async findNewsById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("شناسه خبر نامعتبر است");

    const news = await NewsModel.findById(id);
    if (!news) throw createHttpError.BadRequest("خبر با این مشخصات یافت نشد");
    return copyObject(news);
  }

}

module.exports = {
  NewsController: new NewsController(),
};
