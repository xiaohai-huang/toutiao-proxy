function getMovies() {
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
  return results;
}
module.exports = getMovies;
