const { default: axios } = require("axios");
var express = require("express");
const Api = require("../api/Api");
var router = express.Router();
const api = require("../api/Api");

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
  Api.getInitialNews().then((news) => {
    res.json(news);
  });
});

router.post("/news", function (req, res) {
  const newNews = req.body;
  newNews.item_id = Number(`${Date.now()}`.slice(0, 10));
  newNews.behot_time = Number(`${Date.now()}`.slice(0, 10));

  req.db
    .from("news")
    .insert({ ...newNews })
    .then((r) => console.log(r))
    .catch((err) => console.log(err));
  res.json({ result: req.body });
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
    api.getInitialNews(category).then((news) => res.json(news));
  } else {
    // retrieve news at the bottom (older ones).

    api.getNews(category, max_behot_time).then((news) => {
      res.json(news);
    });
  }
});

router.get("/news/:newsId", function (req, res) {
  const { newsId } = req.params;
  return Api.getNewsById(newsId).then((news) => {
    res.json(news);
  });
});

router.get("/comments/:newsId", function (req, res) {
  const { newsId } = req.params;
  const { offset } = req.query;
  return Api.getNewsCommentsById(newsId, offset).then((comments) => {
    res.json(comments);
  });
});

router.get("/videos/search_words", function (req, res) {});

function getPrivateNews(req) {
  return req.db
    .from("news")
    .select("*")
    .then((news) => ({ data: news }));
}

module.exports = router;

// CREATE TABLE news (
// 	item_id INT NOT NULL AUTO_INCREMENT UNIQUE,
//     article_genre VARCHAR(20) NOT NULL,
//     single_mode BOOLEAN NOT NULL,
//     title VARCHAR(200) NOT NULL,
//     behot_time INT NOT NULL,
//     source VARCHAR(100) NOT NULL,
//     image_url TEXT,
//     media_avatar_url TEXT,
//     comments_count INT,
//     PRIMARY KEY (item_id)
// );
