const axios = require("axios");
axios.default.withCredential = true;
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const puppeteer = require("puppeteer");
const getShortVideos = require("../scrawl/getShortVideos");
const getMovies = require("../scrawl/getMovies");
let Api = {};

Api.getInitialNews = async function (category) {
  const curlString = `curl 'https://m.toutiao.com/list/?tag=${category}&ac=wap&count=20&format=json_raw&as=A1060057D2F915D&cp=6072E9C1359DDE1&min_behot_time=0&_signature=WBC0mQAAOGVrH-..57grJFgQtI&i=' \
  -H 'Connection: keep-alive' \
  -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' \
  -H 'Accept: */*' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: https://m.toutiao.com/?W2atIF=1' \
  -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6' \
  -H 'Cookie: csrftoken=e640ede05aa0203f8e38672e28f0cd97; ttcid=3f48a1c3ca27433e96140f3fa58ca07321; tt_webid=6932717554863801863; _ga=GA1.2.961981832.1614307484; passport_csrf_token=27311c0e665716b2ce43a970836b5895; passport_csrf_token_default=27311c0e665716b2ce43a970836b5895; MONITOR_WEB_ID=118f4000-ba6e-42ce-92ec-364bddcc3f5a; tt_scid=-X.G5BKXuwkpz.m3.-FOzOF.OOu1l37YtGQ1zYxlTT42d5A8LyA7b28BC6nP99Kub37d; W2atIF=1; _gid=GA1.2.1885451154.1618121042; __tasessionId=pyyz65vaj1618121051293' \
  --compressed`;
  const news = await exec(curlString, { encoding: "UTF-8" });
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

  await page.goto("https://www.ixigua.com/", {
    waitUntil: "networkidle0",
  });

  const shortVideos = await page.evaluate(getShortVideos);

  await page.waitForSelector(".icon-movie");
  await Promise.all([page.waitForNavigation(), page.click(".icon-movie")]);
  await page.waitForTimeout(3500);

  const movies = await page.evaluate(getMovies);
  await browser.close();
  return { shortVideos, movies };
};
// curl
Api.getVideoUrlById = async function (video_id) {
  const url =
    await exec(`curl 'https://www.ixigua.com/api/public/videov2/brief/details?group_id=${video_id}' \
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
  const curlString = `curl 'https://www.toutiao.com/api/search/content/?aid=24&app_name=web_search&offset=${offset}&format=json&keyword=${query}&autoload=true&count=20&en_qc=1&cur_tab=1&from=search_tab&pd=synthesis&timestamp=1619536690118&_signature=_02B4Z6wo00f01Ytz2NwAAIDBidQxdk6XwqGLVtxAAAJV4wvf93vpSqmBxrNIwhkmoQlq.ZGwHvsaSF45GnxsnsoC1NX1B6TwkHm.ou2AISKxH9-tfecWpyZqqu6xDXilslJvPO6.V1Zq3sm50d' -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0' -H 'Accept: application/json, text/javascript' -H 'Accept-Language: en-US,en;q=0.5' --compressed -H 'X-Requested-With: XMLHttpRequest' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Connection: keep-alive' -H 'Referer: https://www.toutiao.com/search/?keyword=%E5%AF%B9%E5%AF%B9' -H 'Cookie: tt_webid=6932428093810492941; MONITOR_WEB_ID=c410bd15-0def-4202-8088-b744338bbb3b; csrftoken=61e2446e34a7c4322be05ba8cb8e5a92; tt_webid=6933102749975201293; ttcid=dd7046f16bd246ef99679f2ede9a899338; ttwid=1%7CFeUj-vBaMHLOktE4c5Pf-mylnm7RHm_3bjdEeGor-WA%7C1619536758%7C6914c6c5a14de78f5d24e8c7ebeb4378313dd3607b50110c80238f6c672e71a6; s_v_web_id=verify_kno8p91e_rD3Wsjrs_1JH7_4krF_8kiR_Q7dd9VP8Fbtp; __ac_signature=_02B4Z6wo00f01YlOUHgAAIDBi-m50Wwoj72Ja1TAAAIvRgxWYioxSzQi8qWjDx4WQU1GkLf1q2RIVo9oEwHQAdpzJ3fsMF7gFpLP5MYIqHa0mlrEKRT0EnH1wAAK8WR-gZ4FeTaV.M1O9ZFw35; __tasessionId=0ury91tpp1619536683637; tt_scid=w0WY9q8bF3jZBrsLIzZXj17rZN6GDNAekknqEUJKNpz5P69yVgiDIiK3dl.lotqLa4e4' -H 'TE: Trailers'`;
  // const curlString = `curl --location --request GET 'https://www.toutiao.com/api/search/content/?aid=24&app_name=web_search&offset=${offset}&format=json&keyword=${query}&autoload=true&count=20&en_qc=1&cur_tab=1&from=search_tab&pd=synthesis'`;
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
      videoResource =
        findReactElement(video).memoizedProps.children[0].props.videoResource
          .normal.video_list;
    } catch {
      // movie's props is not an array
      videoResource =
        findReactElement(video).memoizedProps.children.props.videoResource
          .normal.video_list;
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
    `https://www.toutiao.com/article/v2/tab_comments/?aid=24&app_name=toutiao_web&offset=${offset}&count=15&group_id=${item_id}&item_id=${item_id}&_signature=_02B4Z6wo00f01aNkpiAAAIDCeGFaZL0tWCmjQaKAAAjkye8lFlRrOVV3SGCJsa8mFbNTPOomRPXgt744hXmF7mLivt-HOL1ViDo3a2miChKEQtDPNGMxW9D3l2Lc9LacIUvj08gR2e7p3q1Vb2`,
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
    .then((res) => res.data.data)
    .then((comments) => {
      return comments.map((c) => {
        const comment = c.comment;
        const id = comment.id_str;
        const text = comment.text;
        const digg_count = comment.digg_count; // num likes
        const reply_count = comment.reply_count;
        const create_time = comment.create_time;
        const user_name = comment.user_name;
        const user_profile_image_url = comment.user_profile_image_url;
        return {
          id,
          text,
          digg_count,
          reply_count,
          create_time,
          user_name,
          user_profile_image_url,
        };
      });
    })
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
