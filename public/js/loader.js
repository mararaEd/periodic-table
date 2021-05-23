const elm = document.documentElement.style;
let t, animO, clipO, allLoaders, lBall;

// functions
const setProperty = function (...values) {
  values.forEach((val, i) => {
    elm.setProperty(`--anim${i + 1}`, val);
  });
};

const maintainA = function () {
  console.log("now");
  t++;
  if (t === 3) {
    setProperty(
      `${animO[0]} 1.4s ease-in forwards`,
      "moveFy 1.4s ease-out forwards"
    );
    t = 0;
    animO.reverse();
  }

  if (t === 1) {
    elm.setProperty("--anim2", "moveD 0.35s linear");
    clipO
      .reverse()
      .forEach((el, i) => (allLoaders[i].style.transform = `scaleY(${el})`));
  }
};

// exports
exports.startAnimation = function () {
  // variables
  clipO = [0.155, 0.374, 0.583, 0.778, 1];
  animO = ["moveBx", "moveFx"];
  t = 0;

  // elements
  allLoaders = document.querySelectorAll(".loader__bar");
  lBall = document.querySelector(".loader__ball");

  // starting
  lBall.addEventListener("animationend", maintainA);
};

exports.stopAnimation = () => {
  lBall.removeEventListener("animationend", maintainA);
  setProperty("moveFx 1.4s ease-in forwards", "moveFy 1.4s ease-out forwards");
};
