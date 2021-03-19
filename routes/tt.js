var express = require("express");
const Api = require("../api/Api");
var router = express.Router();
const api = require("../api/Api");
const jwt = require("jsonwebtoken");
const puppeteer = require("puppeteer");

const categories = {
  __all__: "推荐",
  news_hot: "热点",
  news_society: "社会",
  news_entertainment: "娱乐",
  news_tech: "科技",
  news_military: "军事",
  news_sports: "体育",
  news_car: "汽车",
  news_finance: "财经",
  news_world: "国际",
  news_fashion: "时尚",
  news_travel: "旅游",
  news_discovery: "探索",
  news_baby: "育儿",
  news_regimen: "养生",
  news_story: "故事",
  news_essay: "美文",
  news_game: "游戏",
  news_history: "历史",
  news_food: "美食",
  software: "软件",
  internet: "互联网",
  smart_home: "智能家居",
};

router.get("/hotboard", function (req, res, next) {
  api.getHotboards().then((hotboards) => {
    res.json(hotboards);
  });
});

router.get("/weather", function (req, res, next) {
  api.getWeather().then((weather) => res.json(weather));
});

// get initial news from all category
router.get("/news", async function (req, res, next) {
  Api.getInitialNews("__all__").then((news) => {
    res.json(news);
  });
});

router.get("/news/findByCategory", async function (req, res, next) {
  let { category, max_behot_time } = req.query;
  if (category === "xiaohai") {
    getPrivateNews(req).then((news) => res.json(news));
    return;
  }

  // category is not specified, fallback to __all__
  if (!categories[category]) {
    category = "__all__";
  }
  // retrieve top news
  if (!max_behot_time || max_behot_time === "undefined") {
    api
      .getInitialNews(category)
      .then((news) => res.json(news))
      .catch((err) =>
        res.json({ error: err, message: "Unable to fetch news" })
      );
  } else {
    // retrieve news at the bottom (older ones).

    api
      .getNews(category, max_behot_time)
      .then((news) => {
        res.json(news);
      })
      .catch((err) =>
        res.json({ error: err, message: "Unable to fetch news" })
      );
  }
});

router.get("/news/:newsId", async function (req, res) {
  const { newsId } = req.params;
  // private news
  const privateNews = await getPrivateNewsDetails(req, newsId);
  if (privateNews.data) {
    res.json(privateNews);
    return;
  }

  Api.getNewsById(newsId)
    .then((news) => {
      res.json(news);
    })
    .catch((err) => console.log("cannot get the news details by id" + newsId));
  return;
});

router.get("/videos/:newsId", async function (req, res) {
  const { newsId } = req.params;
  const iPhone = puppeteer.devices["iPhone 6"];

  (async () => {
    const url = `https://m.toutiaoimg.cn/i${newsId}/?w2atif=1&channel=video`;
    console.log(url);
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.emulate(iPhone);

    await page.goto(url);
    await page.waitForSelector("video");
    const video = await page.evaluate(() => {
      const videoSrc = document.getElementsByTagName("video")[0]
        .firstElementChild.src;
      return videoSrc;
    });
    await res.json({ video: video });
    await browser.close();
  })();
});

router.get("/comments/:newsId", function (req, res) {
  const { newsId } = req.params;
  const { offset } = req.query;
  Api.getNewsCommentsById(newsId, offset)
    .then((comments) => {
      res.json(comments);
    })
    .catch((err) =>
      res
        .status(404)
        .json({ error: err, message: "Cannot find the news article." })
    );
  return;
});

router.get("/videos/search_words", function (req, res) {});

router.post("/news", authorize, async function (req, res) {
  const newNews = req.body;
  newNews.item_id = Number(`${Date.now()}`.slice(0, 10));
  newNews.behot_time = Number(`${Date.now()}`.slice(0, 10));
  // retrived avatar_url of the author
  const author_name = req.username;

  newNews.source = author_name;

  req.db
    .from("news")
    .insert({ ...newNews })
    .then((r) => {
      // send back the new article's id
      res.status(201).json({ item_id: newNews.item_id });
    })
    .catch((err) => console.log(err));
});

// update news
router.put("/news/:newsId", authorize, async function (req, res) {
  const { newsId } = req.params;
  let newsToInsert = req.body;

  // check if the news exists in the db
  const oldNews = await req.db
    .from("news")
    .select("*")
    .where({ item_id: newsId })
    .first();
  // does not exist
  if (!oldNews) {
    res.status(404).json({
      message: `The news with id:${newsId} does not exist.`,
      error: true,
    });
    return;
  }
  // update the old news
  req.db
    .from("news")
    .where({ item_id: newsId })
    .update({ ...newsToInsert })
    .then(() => {
      res.status(200).json({
        item_id: newsId,
        message: `Successfully updated the news with id ${newsId}`,
      });
    })
    .catch((err) =>
      res.status(500).json({
        error: true,
        message: "Unable to perform the update, databse error" + err,
      })
    );
});

// delete news by id
router.delete("/news/:newsId", authorize, async function (req, res) {
  const { newsId } = req.params;

  // check if the news exists in the db
  const oldNews = await req.db
    .from("news")
    .select("*")
    .where({ item_id: newsId })
    .first();
  // does not exist
  if (!oldNews) {
    res.status(400).json({
      message: `News id:${newsId} is invalid.`,
      error: true,
    });
    return;
  }

  // detle the news
  req.db
    .from("news")
    .where({ item_id: newsId })
    .del()
    .then(() => {
      res
        .status(200)
        .json({ message: `Successfully deleted the news with id ${newsId}` });
    })
    .catch((err) => {
      res.status(500).json({ error: err, message: "Database error" });
    });
});

async function getPrivateNews(req) {
  const plain_news = await req.db
    .from("news")
    .select("*")
    .orderByRaw("behot_time DESC");
  let complete_news = await plain_news.map(async (news) => {
    const author = await req.db
      .from("users")
      .select("*")
      .where({ username: news.source });

    news.media_avatar_url = author[0]?.avatar_url;
    return news;
  });
  complete_news = await Promise.all(complete_news);
  // news.media_avatar_url = avatar_url;
  // console.log(avatar_url);
  return { data: complete_news };
}

async function getPrivateNewsDetails(req, id) {
  let newsDetails = await req.db.from("news").where({ item_id: id }).first();
  // not in private database
  if (!newsDetails) {
    return { data: null };
  }
  // id === publish_time
  newsDetails.publish_time = id;
  const user_info = await req.db
    .from("users")
    .where({ username: newsDetails.source });

  const media_user = {
    screen_name: user_info[0].username,
    avatar_url: user_info[0].avatar_url,
  };
  // if no content found, return empty
  newsDetails.media_user = media_user;
  return { data: newsDetails };
}

// private route middleware
function isValid(expireDate) {
  return expireDate > Date.now();
}

function authorize(req, res, next) {
  const authorization = req.headers.authorization;

  // retrieve token
  let token = null;
  if (authorization && authorization.split(" ").length === 2) {
    // valid input
    token = authorization.split(" ")[1];
  } else {
    // invalid user
    res.status(401).json({
      error: true,
      message: "Request header authorization format incorrect!",
    });
    return;
  }

  try {
    const { exp, username } = jwt.verify(token, "a secret key");
    // check if the token is still valid
    if (isValid(exp)) {
      // determine if the user exists in the table
      req.db
        .from("users")
        .select("*")
        .where({ username })
        .then((users) => {
          if (users.length !== 0) {
            // permit the user to advance to the route
            req.username = username;
            next();
          } else {
            res.status(401).json({
              error: true,
              message: "Invalid user!",
            });
          }
        });
    } else {
      res.status(401).json({
        error: true,
        message: "Token expired!",
      });
    }
  } catch (err) {
    res.status(401).json({
      error: true,
      message: "Invalid token",
    });
  }
}

module.exports = router;
