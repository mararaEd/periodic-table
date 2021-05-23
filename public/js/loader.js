const elm = document.documentElement.style;
let t, animO, clipO, allLoaders, lBall;

// functions
const setProperty = function (...values) {
  values.forEach((val, i) => {
    elm.setProperty(`--anim${i + 1}`, val);
  });
};

const maintainA = function () {
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
      .forEach(
        (el, i) => (allLoaders[i].style.clipPath = `inset(${el}rem 0 0 0)`)
      );
  }
};

// exports
exports.startAnimation = function () {
  // variables
  clipO = [3.28, 2.46, 1.64, 0.82, 0];
  animO = ["moveBx", "moveFx"];
  t = 0;

  // elements
  allLoaders = document.querySelectorAll(".loader__bar");
  lBall = document.querySelector(".loader__ball");

  // starting
  setProperty("moveFx 1.4s ease-in forwards", "moveFy 1.4s ease-in forwards");
  lBall.addEventListener("animationend", maintainA);
};

exports.stopAnimation = () => {
  lBall.removeEventListener("animationend", maintainA);
  setProperty("", "");
};
