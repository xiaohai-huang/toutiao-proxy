function getShortVideos() {
  function timeAgo(date) {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + "年";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + "个月";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "日";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "小时";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "分钟";
    }
    return Math.floor(seconds) + "秒";
  }

  function formatSeconds(secondStr) {
    var date = new Date(0);
    date.setSeconds(+secondStr); // specify value for SECONDS here
    var timeString = date.toISOString().substr(14, 5);
    return timeString;
  }
  // 数字转换
  var numberFormat = function (value) {
    var param = {};
    var k = 10000,
      sizes = ["", "万", "亿", "万亿"],
      i;
    if (value < k) {
      param.value = value;
      param.unit = "";
    } else {
      i = Math.floor(Math.log(value) / Math.log(k));

      param.value = (value / Math.pow(k, i)).toFixed(2);
      param.unit = sizes[i];
    }
    return param;
  };
  function getStat(video_watch_count, publish_time) {
    const ago = timeAgo(+`${publish_time}000`) + "前";
    const watchObj = numberFormat(video_watch_count);
    const watch = `${watchObj.value}${watchObj.unit}次观看`;
    return `${watch} · ${ago}`; // 13.7万次观看 · 3个月前
  }
  function getCoverImageUrl(coverURIConfig) {
    const uri = coverURIConfig.uri.split("~")[0]; // "img/tos-cn-i-0004/b52c59f32c024c19ab2ec10a6ecf13cc~c5_q75_864x486.jpeg"
    // https://p9.bdxiguaimg.com/img/tos-cn-i-0004/b52c59f32c024c19ab2ec10a6ecf13cc~tplv-xg-center-qs:840:470:q75.webp
    const image_url = `https://p9.bdxiguaimg.com/${uri}~tplv-xg-center-qs:840:470:q75.webp`;
    return image_url;
  }
  function getAuthor(authorInfo) {
    const avatar_url = authorInfo.avatar_url;
    const name = authorInfo.name;
    return { avatar_url, name };
  }

  function findReactElement(node) {
    for (var key in node) {
      if (key.startsWith("__reactInternalInstance")) {
        //   console.log(key);
        return node[key];
      }
    }
    return null;
  }
  var items = document.querySelector(".categoryPage_home__videoRecomment");
  items = findReactElement(items).memoizedProps.children[1].props.children[0].props.children[0]
  items = items.map((item) => {
    const props = item.props.children[0].props.children.props;
    const item_id = item.key;
    // props
    const title = props.title;
    const author = getAuthor(props.authorInfo);
    const duration = formatSeconds(props.duration);
    const image_url = props.coverURL;
    const statistics = getStat(props.video_watch_count, props.publish_time); // 7552次观看 · 3个月前
    const preview_url = props.videoURL;
    return {
      author,
      item_id,
      title,
      duration,
      image_url,
      statistics,
      preview_url,
    };
  });
  return items;
}

module.exports = getShortVideos;
