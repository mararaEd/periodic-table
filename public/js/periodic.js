import axios from "axios";
import spinController from "./loader";

module.exports = () => {
  // Elements
  const container = document.querySelector(".container");
  const btnKeyC = document.getElementById("key");
  const popup = document.querySelector(".popup");
  const popupContent = document.querySelector(".popup__content");
  const searchBtn = document.querySelector(".fform__icon");
  const searchInp = document.querySelector(".fform__input");

  let curDef;
  let curOption;

  const rem = (d, elm) => {
    curDef.classList.remove("fform__default--b");
    curOption.classList.remove("fform__default-options--v");
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav__item-c"))
      return e.target.closest(".nav__item-c").classList.toggle("nav__item--v");

    if (document.querySelector(".nav__item--v"))
      document.querySelector(".nav__item--v").classList.remove("nav__item--v");
  });
  // Implementing options for units
  popup.addEventListener("click", (e) => {
    if (
      !e.target.closest(".popup__content") ||
      e.target.closest(".popup__close")
    ) {
      popup.classList.remove("popup--show");
      spinController.stopAnimation(popupContent);
    }

    if (e.target.matches(".fform__default-optionsOpt")) {
      // get the text and change
      const p = e.target.parentElement.parentElement;

      p.firstElementChild.textContent = e.target.textContent;
      return rem();
    }

    if (e.target.closest(".fform__default")) {
      if (curDef) rem();

      curDef = e.target.closest(".fform__default");
      curOption = curDef.lastElementChild;

      Array.from(curOption.children).forEach((elm) =>
        elm.textContent === curDef.firstElementChild.textContent
          ? elm.classList.add("fform__default-optionsOpt--c")
          : elm.classList.remove("fform__default-optionsOpt--c")
      );

      curDef.classList.add("fform__default--b");
      return curOption.classList.add("fform__default-options--v");
    }

    if (!e.target.closest(".fform__default-options") && curOption) return rem();
  });

  btnKeyC.addEventListener("click", (e) =>
    document.querySelector(".key").classList.toggle("key--sh")
  );

  const handleName = (name) => {
    const capitalI = [...name].findIndex((el) => el === el.toUpperCase());
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
  `;
  };

  const loadProperties = async ({ field, query }) => {
    try {
      document.querySelector(".popup__element")?.remove();
      popup.classList.add("popup--show");

      const cont = document.createElement("div");
      cont.classList.add("popup__element");

      popupContent.appendChild(cont);
      spinController.startAnimation(cont);

      // Prepare
      const myElm = await axios(`/api/v1/element/?${field}=${query}`);
      const [elementProp] = myElm.data.data.elements;

      if (!elementProp) {
        const al = document.querySelector(".alert");
        document.querySelector(".alert")?.remove();
        const htm = ` 
          <div class="alert alert--error">Sorry, no element found with that name</div>
        `;
        popup.classList.remove("popup--show");
        spinController.delInterval();

        container.insertAdjacentHTML("beforebegin", htm);

        return setTimeout(
          () => document.querySelector(".alert").classList.add("alert--h"),
          3000
        );
      }

      const html = generateHtml(elementProp);

      // Remove spinner and Render Element
      spinController.delInterval();
      cont.innerHTML = html;
    } catch (err) {
      console.log(err);
    }
  };

  const disElm = function () {
    loadProperties({
      field: "name",
      query: searchInp.value,
    });
  };

  container.addEventListener("click", function (e) {
    const atN = +e.target.closest(".elm")?.firstElementChild.textContent;
    if (!atN) return "error";
    loadProperties({ field: "atomicNumber", query: atN });
  });

  searchBtn.addEventListener("click", disElm);
  searchInp.addEventListener("keypress", function (e) {
    (e.which === 13 || e.keyCode === 13) && disElm();
  });
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
};
