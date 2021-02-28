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

router.get("/news/findByCategory", async function (req, res, next) {
  let { category, max_behot_time } = req.query;

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

module.exports = router;

// router.get("/newsDeprecated", async function (req, res, next) {
//   const url = "https://www.toutiao.com/";
//   const newsUrl =
//     "https://www.toutiao.com/api/pc/feed/?min_behot_time=0&category=__all__&utm_source=toutiao&widen=1&tadrequire=true&_signature=_02B4Z6wo00f01eGJDDAAAIDAlAcgGmRjvLXhrAiAABhZLz3kN1WAXgzidEIUQz9.x7RjYR.2l1Rj3-hK0D1o3V5qCsftnjal-G7RgMT9F4EKoctUWV9hz61fCXC0A1q-hTDG5QE6Y0Yuzi2Md3";
//   const result = await request.get(url);

//   const news = await request.get(newsUrl, {
//     headers: {
//       cookie: cookieJar.getCookieString(),
//       "User-Agent":
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
//     },
//   });

//   const axiosNews = await axios.get(newsUrl, {
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
//     },
//   });

//   res.json({
//     cookie: cookieJar.getCookieString(url),
//     news: axiosNews.data,
//   });
// });
