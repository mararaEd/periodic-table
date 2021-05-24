// declaring animation variables
let times, clipO, lBall, allLoaders;

// animation callback
const animation = function () {
  times++;
  if (times === 1) {
    clipO
      .reverse()
      .forEach((n, i) => (allLoaders[i].style.transform = `scaleY(${n})`));
  }

  if (times === 2) {
    lBall.classList.toggle("loader__ball--s");
    times = 0;
  }
};

// exports
exports.startAnimation = () => {
  // 1 variables
  clipO = [0.155, 0.374, 0.583, 0.778, 1];
  times = 0;

  // 2 elements
  allLoaders = document.querySelectorAll(".loader__bar");
  lBall = document.querySelector(".loader__ball");

  // 3 starting
  lBall.addEventListener("animationend", animation);
};

exports.stopAnimation = () => {
  // removing event and element
  lBall.removeEventListener("animationend", animation);
  document.querySelector(".loader").remove();
};
