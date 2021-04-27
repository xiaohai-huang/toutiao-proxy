const axios = require("axios");
axios.default.withCredential = true;
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const puppeteer = require("puppeteer");
let Api = {};

// Api.getInitialNews = (category) => {
//   return axios(
//     `https://www.toutiao.com/api/pc/feed/?min_behot_time=0&category=${category}&utm_source=toutiao&widen=1&tadrequire=true&_signature=_02B4Z6wo00f01ZKWs8AAAIDCSZNPhGgVOamSs7dAAASfSzg0K.WOLW57Bp2-xYZXzK-1gB2MJIucwnNzdJP7rnJ1xZjMUdFm2rPsi1Y5NtbZAXuZyIbS.UkyMPubMkPc7l.8dL5d7VWYYPeSef`,
//     {
//       credentials: "include",
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0",
//         Accept: "application/json, text/plain, */*",
//         "Accept-Language": "en-US,en;q=0.5",
//       },
//       referrer: "https://www.toutiao.com/ch/news_tech/",
//       method: "GET",
//       mode: "cors",
//     }
//   ).then((res) => res.data);
// };
Api.getInitialNews = async function (category) {
  const news = await exec(
    `curl 'https://www.toutiao.com/api/pc/feed/?min_behot_time=0&category=${category}&utm_source=toutiao&widen=1&tadrequire=true&_signature=_02B4Z6wo00f01jBOEVgAAIDCMun48T6coyYwaxXAAOyAwvu5JQJMD7lMZmlQ1YLPucgM8Y7wXByCAakFSpO6kvzQRMNghk-viGDprLeDVUaa9zncHfoz9AIoV2AiKFSYp2bhHqzKImaKGWO866' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0' -H 'Accept: application/json, text/plain, */*' -H 'Accept-Language: en-US,en;q=0.5' --compressed -H 'Connection: keep-alive' -H 'Referer: https://www.toutiao.com/' -H 'Cookie: tt_webid=6932428093810492941; MONITOR_WEB_ID=0ac2db7b-8fc4-4e00-9856-f6df8bdbd79e; csrftoken=61e2446e34a7c4322be05ba8cb8e5a92; tt_webid=6932428093810492941; ttcid=dd7046f16bd246ef99679f2ede9a899338; passport_csrf_token=e430036a3bcbcc9ef38d92cb85ecd745; passport_csrf_token_default=e430036a3bcbcc9ef38d92cb85ecd745; __ac_signature=_02B4Z6wo00f01N8cUUAAAIDDBBmtB3NAAkjfOVXAAFebiPSMUlNiiLcF9.cr-LBYf02ILiMmZIjFeD2jAL3Da4shTBkrpz8YVylUKXl6gdhKaUo0oncScZEMHuVg84cdxwn75veJ.7TJKzZBc0; tt_scid=cl9Ppo91wU9Hd6562Jf5mwV.kdUjC1JdfqnVCIMIGJHYibJTznSAO7GO-m4zCx7k868e' -H 'TE: Trailers'`,
    { encoding: "UTF-8" }
  );
  return JSON.parse(news.stdout);
};

Api.getNews = (category, max_behot_time) => {
  if (max_behot_time === "undefined") {
    max_behot_time = 0;
  }

  return axios(
    `https://www.toutiao.com/api/pc/feed/?max_behot_time=${max_behot_time}&category=${category}&utm_source=toutiao&widen=1&tadrequire=true&_signature=_02B4Z6wo00d01MMlYpQAAIDDGCCe0HZbnwTDAGYAAFD3NxTOoJdXFRpGEBR5Xi-8z7g5rOvUXjq9arRybjQw2ZWI8l6rCSMgpL5mqnG9yE1O9FwQZFoEbyt8fkwzR1ncalu-wGdGHAq93PlE1e`,
    {
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
    }
  ).then((res) => res.data);
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
Api.getVideos = async function (category) {
  let browser;
  try {
    browser = await puppeteer.launch({
      userDataDir: "./cache",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/chromium-browser",
    });
  } catch (e) {
    console.log("Unable to open puppeteer!");
    return;
  }
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    request.continue();
  });
  let previewUrls = [];
  page.on("response", async (response) => {
    if (response.url().includes("feedById")) {
      const data = await response.json();
      const videos = data.data.channelFeed.Data;
      previewUrls = videos.map((v) => {
        return v.data.preview_url;
      });
    }
    // console.log("<<", response.status(), response.url());
  });

  await page.goto("https://www.ixigua.com/", {
    waitUntil: "networkidle0",
  });

  const shortVideos = await page.evaluate(() => {
    const cards = Array.from(
      document.querySelectorAll(
        ".HorizontalFeedCard.HorizontalChannelBlockList__item"
      )
    );

    const results = cards.map((card, i) => {
      const v = {};
      const author = {};
      v.author = author;

      v.item_id = card.querySelector("a").href.split("/").pop();

      v.title = card.querySelector(".HorizontalFeedCard__title").innerText;
      v.duration = card.querySelector("span").innerHTML;
      const images = card.querySelectorAll("img");
      v.image_url = images[0].src;
      v.statistics = card.querySelector(
        ".HorizontalFeedCard-accessories-bottomInfo__statistics"
      ).innerText;

      author.avatar_url = images[1].src;
      author.name = card.querySelector(
        ".HorizontalFeedCard__author-name"
      ).innerText;

      return v;
    });

    return results;
  });
  shortVideos.forEach((v, i) => {
    v.preview_url = previewUrls[i];
  });

  const movies = await page.evaluate(() => {
    function findReactElement(node) {
      for (var key in node) {
        if (key.startsWith("__reactInternalInstance")) {
          //   console.log(key);
          return node[key];
        }
      }
      return null;
    }
    const movieList = [
      ...document.querySelectorAll(".FeedContainer__itemWrapper"),
    ].slice(0, 5);
    const results = movieList.map((movieNode) => {
      const reactEl = findReactElement(movieNode);
      return reactEl.memoizedProps.children.props;
    });
    console.log(results);
    return results;
  });
  await browser.close();
  return { shortVideos, movies };
};
// curl
Api.getVideoUrlById = async function (video_id) {
  const url = await exec(`curl 'https://www.ixigua.com/api/public/videov2/brief/details?group_id=${video_id}' \
  -H 'authority: www.ixigua.com' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'tt-anti-token: ' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.63' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-dest: empty' \
  -H 'referer: https://www.ixigua.com/embed/?group_id=${video_id}&autoplay=0&wid_try=1' \
  -H 'accept-language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7' \
  -H 'cookie: MONITOR_WEB_ID=08ba8ce2-7ae9-4ca7-b286-768b36bb67bb; ttwid=1%7C4Sq4ClTk2TuXZrHMYMak2LaZIKO4AfMX6UQ1Bt071zg%7C1614514848%7C163163a1f5ccaec792b69a9525fb9c1e993f07db8963d4e5a515711478920169; ixigua-a-s=0; SEARCH_CARD_MODE=6934288451864888839_1' \
  --compressed`);
  let data = JSON.parse(url.stdout).data;
  // console.log(data);

  if (!Object.keys(data.videoResource).length) {
    console.log("return empty string ");
    return "";
  }

  let videoUrl = data.videoResource.normal.video_list.video_3.main_url;
  let buffer = Buffer.from(videoUrl, "base64");
  return buffer.toString("ascii");
};

Api.getSearchResults = async (query, offset = 0) => {
  query = encodeURI(query);
  const curlString = `curl --location --request GET 'https://www.toutiao.com/api/search/content/?aid=24&app_name=web_search&offset=${offset}&format=json&keyword=${query}&autoload=true&count=20&en_qc=1&cur_tab=1&from=search_tab&pd=synthesis'`;
  // const curlString = `curl 'https://www.toutiao.com/api/search/content/?aid=24&app_name=web_search&offset=${offset}&format=json&keyword=${query}&autoload=true&count=20&en_qc=1&cur_tab=1&from=search_tab&pd=synthesis&timestamp=${Date.now()}&_signature=_02B4Z6wo00f01EXGpKwAAIDAR2FNBgD3tWBF46AAAHEmxojXKM7nyK.OuUaie9rQQGdqiiXnn-mMIB-Rl9P8wHK-ZICdhTlrFjCyX6O0ZFXVmvmsLZIzCCnIV4Kq1kUpSdphS5o9Bplk7Jmj55' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0' -H 'Accept: application/json, text/javascript' -H 'Accept-Language: en-US,en;q=0.5' --compressed -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Connection: keep-alive' -H 'Referer: https://www.toutiao.com/search/?keyword=${query}' -H 'Cookie: tt_webid=6932428093810492941; MONITOR_WEB_ID=6c5950a0-0534-4134-b991-c4c78646bc8f; csrftoken=61e2446e34a7c4322be05ba8cb8e5a92; tt_webid=6932428093810492941; ttcid=dd7046f16bd246ef99679f2ede9a899338; passport_csrf_token=e430036a3bcbcc9ef38d92cb85ecd745; passport_csrf_token_default=e430036a3bcbcc9ef38d92cb85ecd745; __ac_signature=_02B4Z6wo00f01N8cUUAAAIDDBBmtB3NAAkjfOVXAAFebiPSMUlNiiLcF9.cr-LBYf02ILiMmZIjFeD2jAL3Da4shTBkrpz8YVylUKXl6gdhKaUo0oncScZEMHuVg84cdxwn75veJ.7TJKzZBc0; __tasessionId=47uk0wrno1617884440356; s_v_web_id=verify_kn8umfvk_lmy28d2u_MRlp_4jfx_9fer_KEUeXkvb63MO; tt_scid=kn1kzBKmgi6X14sskTxH5SQuMGwFaqslu0Efb1vMbpbvUQnCMhNpw5uepTgQtOr701ed' -H 'TE: Trailers'`;
  let data;
  try {
    data = await exec(curlString);
    data = JSON.parse(data.stdout).data;
  } catch (error) {
    console.log("unable to fetch search results");
    data = [];
  }
  return data;
};

Api.getVideoUrlByIdPuppeteer = async (video_id) => {
  //   let url = `https://m.toutiaoimg.cn/i${video_id}/?w2atif=1&channel=video`;
  let url = `https://www.ixigua.com/${video_id}`;
  console.log(url);
  let browser;
  try {
    browser = await puppeteer.launch({
      userDataDir: "./cache",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: "/usr/bin/chromium-browser",
    });
  } catch (e) {
    console.log("Unable to open puppeteer!");
    return;
  }
  const page = await browser.newPage();

  await page.goto(url);
  const video = await page.evaluate(() => {
    function findReactElement(node) {
      for (var key in node) {
        if (key.startsWith("__reactInternalInstance")) {
          return node[key];
        }
      }
      return null;
    }
    var layout = document.querySelector(".v3-app-layout__content");
    var video = [...layout.querySelectorAll("div")].find((e) =>
      e.className.includes("playerContainer__wrapper")
    );
    var videoResource;
    try {
      videoResource = findReactElement(video).memoizedProps.children[0].props
        .videoResource.normal.video_list;
    } catch {
      // movie's props is not an array
      videoResource = findReactElement(video).memoizedProps.children.props
        .videoResource.normal.video_list;
    }
    return videoResource.video_3.main_url;
  });
  browser.close();
  return video;
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
