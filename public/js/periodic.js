import axios from "axios";
import spinController from "./loader";

module.exports = () => {
  const container = document.querySelector(".container");
  const btnKeyC = document.getElementById("key");
  const menuHum = document.querySelector(".menu__back");
  const menu = document.querySelector(".menu");

  document.addEventListener("click", (e) => {
    if (e.target.closest(".menu__back")) {
      // control humburger
      menuHum.classList.toggle("menu__back--cl");
      // constrol menu
      menu.classList.toggle("menu--sh");
    }

    if (menu.classList.contains("menu--sh") && !e.target.closest(".menu")) {
      // control humburger
      menuHum.classList.remove("menu__back--cl");
      // constrol menu
      menu.classList.remove("menu--sh");
    }
  });

  btnKeyC.addEventListener("click", (e) =>
    document.querySelector(".key").classList.toggle("key--sh")
  );

  const handleName = (name) => {
    const capitalI = [...name].findIndex((el, i) => el === el.toUpperCase());
    return capitalI === -1
      ? name
      : `${name.slice(0, capitalI)} ${name.slice(capitalI)}`;
  };

  const generateDetails = function (det) {
    let html = "";
    const keys = Object.keys(det);
    Object.values(det).forEach((val, i) => {
      val = Array.isArray(val)
        ? val
            .filter((_, i) => i <= 10)
            .map((el) => `<span>${el}</span>`)
            .join("\n")
        : val;
      const node = `
    <div class="elem__overview-row">
      <h3 class="elem__title">${handleName(keys[i])}</h3>
      <p class="elem__detail">${val}</p>
    </div>
    `;
      html = html.concat(node);
    });

    return html;
  };

  const generateHtml = function (prop) {
    const exclude = ["symbol", "groupBlock", "name", "density", "__v", "_id"];
    const filteredObj = {};
    const keys = Object.keys(prop);
    Object.values(prop).forEach((val, i) => {
      if (!exclude.includes(keys[i])) filteredObj[keys[i]] = val;
    });

    return `
  <div class="popup__element">
  <h2 class="elem__sym">${prop.symbol}</h2>
  <p class="elem__group">${handleName(prop.groupBlock)}</p>
  <p class="elem__name">${prop.name}</p>
  <p class="elem__den">${prop.density} g/mol</p>

  <div class="elem__overview">
     ${generateDetails(filteredObj)}
  </div>
  
  <div class="elem__row">
    <span class="elm__num">${prop.atomicNumber}</span>
    <span class="elm__num c">${prop.atomicNumber}</span>
    <span class="elm__num e">${
      Math.round(prop.atomicMass) - prop.atomicNumber
    }</span>
    <span class="elm__e">electrons</span>
    <span class="elm__p c">protons</span>
    <span class="elm__n e">neutrons</span>
  </div>
</div>
  `;
  };

  const loadProperties = async ({ field, query }) => {
    try {
      const popup = document.querySelector(".popup");
      const popupC = document.querySelector(".popup__content");
      popup.addEventListener("click", (e) => {
        if (!e.target.closest(".popup__content")) {
          popup.classList.remove("popup--show");
          spinController.stopAnimation(popupC);
        }
      });

      popup.classList.add("popup--show");
      spinController.startAnimation(popupC);

      // Prepare
      const myElm = await axios(`/api/v1/element/?${field}=${query}`);
      const [elementProp] = myElm.data.data.elements;

      if (!elementProp) {
        document.querySelector(".alert")?.remove();
        const htm = `
          <div class="alert alert--error">Sorry, no element found with that name</div>
        `;
        popup.classList.remove("popup--show");
        spinController.delInterval();

        setTimeout(
          () => document.querySelector(".alert").classList.add("alert--h"),
          3000
        );
        return document
          .querySelector(".container")
          .insertAdjacentHTML("beforebegin", htm);
      }

      menuHum.classList.remove("menu__back--cl");
      menu.classList.remove("menu--sh");

      const html = generateHtml(elementProp);

      // Remove spinner and Render Element
      spinController.delInterval();
      document.querySelector(".popup__content").innerHTML = html;
    } catch (err) {
      console.log(err);
    }
  };

  const sI = document.querySelector(".menu__content-form-input");

  const disElm = function (s) {
    loadProperties({
      field: "name",
      query: sI.value,
    });
  };

  container.addEventListener("click", function (e) {
    const atN = +e.target.closest(".elm")?.firstElementChild.textContent;
    if (!atN) return "error";
    loadProperties({ field: "atomicNumber", query: atN });
  });

  document
    .querySelector(".menu__content-form-icon")
    .addEventListener("click", disElm);
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  sI.addEventListener(
    "keypress",
    (e) => (e.keyCode === 13 || e.which === 13) && disElm()
  );
};
