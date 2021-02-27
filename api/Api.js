const axios = require("axios");
axios.default.withCredential = true;

const ttAxios = axios.create({});

let Api = {};

Api.getInitialNews = (category) => {
  const newsUrl = `https://www.toutiao.com/api/pc/feed/?min_behot_time=0&category=${category}&utm_source=toutiao&widen=1&tadrequire=true&_signature=_02B4Z6wo00f01eGJDDAAAIDAlAcgGmRjvLXhrAiAABhZLz3kN1WAXgzidEIUQz9.x7RjYR.2l1Rj3-hK0D1o3V5qCsftnjal-G7RgMT9F4EKoctUWV9hz61fCXC0A1q-hTDG5QE6Y0Yuzi2Md3`;
  console.log(newsUrl);
  return ttAxios
    .get(newsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
      },
    })
    .then((res) => res.data);
};

Api.getNews = (category, max_behot_time) => {
  const url = `https://www.toutiao.com/api/pc/feed/?max_behot_time=${max_behot_time}&category=${category}&utm_source=toutiao&widen=1&tadrequire=true&_signature=_02B4Z6wo00501JRfv7QAAIDDT1pD8yhowbCUersAAEUz6nyKYDdmkr1FQZx0sOgCRu3KUd0Eqx6eRbT4xnakqOZSC2acM67ul-r2csoyJygNlKVBkuS3C0TE4Y44hyEN2EXRqhTVRS3q1Ld57d`;

  return axios(url, {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
    },
    referrer: "https://www.toutiao.com/",
    method: "GET",
    mode: "cors",
  }).then((res) => res.data);
};
Api.getNewsById = (item_id) => {
  return axios(
    `https://m.toutiao.com/i${item_id}/info/v2/?_signature=_02B4Z6wo00f01qI15DQAAIDABDSgqkzxxH6iIOCAAMjDE2ZvtwxdbVUEt3GNjoyU5ygcINGOUjFbxH7xh77.VvwkRHP1GDtvZRuYTMSsoqMf9WrktT2qhyKBJsVl7O3MA1xN59yYkGLjkrJ5ef`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer: `https://m.toutiao.com/i${item_id}/`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((res) => res.data)
    .catch((err) => console.log(err));
};
Api.getNewsCommentsById = (item_id, offset = 0) => {
  if (!offset) {
    offset = 0;
  }
  return axios(
    `https://www.toutiao.com/article/v2/tab_comments/?aid=24&app_name=toutiao_web&offset=${offset}&count=5&group_id=${item_id}&item_id=${item_id}&_signature=_02B4Z6wo00f01aNkpiAAAIDCeGFaZL0tWCmjQaKAAAjkye8lFlRrOVV3SGCJsa8mFbNTPOomRPXgt744hXmF7mLivt-HOL1ViDo3a2miChKEQtDPNGMxW9D3l2Lc9LacIUvj08gR2e7p3q1Vb2`,
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
      },
      referrer: `https://www.toutiao.com/a${item_id}/`,
      method: "GET",
      mode: "cors",
    }
  )
    .then((res) => res.data)
    .catch((err) => console.log(err));
};
Api.getHotboards = () => {
  return axios("https://m.toutiao.com/related/hotboard/", {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Cache-Control": "max-age=0",
    },
    method: "GET",
    mode: "cors",
  }).then((res) => res.data);
};

Api.getWeather = () => {
  return axios(
    "https://www.toutiao.com/stream/widget/local_weather/data/?city=%E5%8C%97%E4%BA%AC&_signature=_02B4Z6wo00d01YaEPfQAAIDA8woR3S5AcU2GoTlAAAGVdzXgjd4Rrxl3iwznh9yOUIUuq-CPxW7o4l-zOnMFnUw24X2qJBMV25U7RYGjp7fH0qoq940.iLqwq8SaQQlAQa7RBZDRH33hhvL460",
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
      referrer: "https://www.toutiao.com/",
      method: "GET",
      mode: "cors",
    }
  ).then((res) => {
    return res.data.data;
  });
};

Api.getVideoSearchWords = () => {
  return axios(
    "https://www.ixigua.com/api/search/preset?_signature=_02B4Z6wo00f014dH7pAAAIDAXEIS1AYsM-uHZuoAAIHw8e",
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "tt-anti-token": "",
      },
      referrer: "https://www.ixigua.com/",
      method: "GET",
      mode: "cors",
    }
  ).then((res) => res.data);
};
module.exports = Api;
