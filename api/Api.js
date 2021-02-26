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
  const url = `https://www.toutiao.com/api/pc/feed/?max_behot_time=${max_behot_time}&category=${category}&utm_source=toutiao&widen=1&tadrequire=true&_signature=_02B4Z6wo00501CXguywAAIDCg-H.s.78X9glxb-AAGlU0BDIWff-LA4BBqcnbbqbRIYm9Gb26zok2PX.H6YkX4h72rVca4r-G-SWBiAnKQywtVdRj.dObpo8e-MyMGOPV9m2NzMBaaoAYOu468"`;
  //   const url = `https://www.toutiao.com/api/pc/feed/?max_behot_time=${max_behot_time}&category=${category}&utm_source=toutiao&widen=1&tadrequire=true&_signature=_02B4Z6wo00d01u1XI1wAAIDDmNkPd1V4nULtcifAANttsCmDKI3eKPfTsbSJ6Ji2dGTQnwdkp8iy3v9biDb8Wb6kXSIrptpnCId.xY9ep1fO3wtomXiyvgb2DpnjwFYkktaL5HlpshM-DCKia6`;
  console.log(url);
  return axios(url, {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
    },
    referrer: "https://www.toutiao.com/",
    method: "GET",
    mode: "cors",
  }).then((res) => res.data);
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
module.exports = Api;
