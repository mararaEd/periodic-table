let intervalId = "";
const elm = document.documentElement.style;

exports.startAnimation = function (elmI) {
  const loader = `
  <div class="loader">
    <div class="loader__ball"></div>
    <div class="loader__bar loader__bar--1"></div>
    <div class="loader__bar loader__bar--2"></div>
    <div class="loader__bar loader__bar--3"></div>
    <div class="loader__bar loader__bar--4"></div>
    <div class="loader__bar loader__bar--5"></div>
  </div>    
  `;
  elmI.insertAdjacentHTML("beforeEnd", loader);
  const clipO = [3.28, 2.46, 1.64, 0.82, 0];
  const commonX = "0.35s ease-in forwards";
  const commonY = "0.35s ease-out forwards";
  const allLoaders = document.querySelectorAll(".loader__bar");
  let i = 2;
  let sec = false;

  const orderedA = [
    {
      x: `moveX ${commonX}`,
      y: `moveY ${commonY}`,
    },
    {
      x: `moveXO ${commonX}`,
      y: `moveYO ${commonY}`,
    },
  ];

  elm.setProperty("--anim1", orderedA[0].x);
  elm.setProperty("--anim2", orderedA[0].y);

  intervalId = setInterval(() => {
    if (i === 1) {
      elm.setProperty("--anim1", orderedA[1].x);
      elm.setProperty("--anim2", orderedA[1].y);
      orderedA.reverse();
      return i++;
    }

    if (i === 5) {
      clipO.reverse();
      clipO.forEach((el, i) => {
        allLoaders[i].style.clipPath = `inset(${el}rem 0 0 0)`;
      });

      elm.setProperty("--anim2", "moveD 0.35s linear forwards");

      sec = !sec;
      return (i = 1);
    }
    elm.setProperty("--anim1", `moveX${i} ${commonX}`);
    elm.setProperty("--anim2", `moveY${i} ${commonY}`);

    if (sec) {
      elm.setProperty("--anim1", `moveXO${i} ${commonX}`);
      elm.setProperty("--anim2", `moveY${i} ${commonY}`);
    }

    i++;
  }, 305);
};

exports.stopAnimation = (elmI) => {
  clearInterval(intervalId);
  elmI.firstElementChild?.remove();
};

exports.delInterval = () => clearInterval(intervalId);
