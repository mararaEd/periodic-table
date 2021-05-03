import axios from "axios";
import spinController from "./loader";

const init = () => {
  console.log("I am alive");
  const sBtn = document.querySelector(".btn--sort");
  const elmInput = document.querySelector(".form__input");
  const formElement = document.querySelector(".form__elements");
  const formElmBtn = document.querySelector(".form__elements-button");

  const criteria = document.querySelector(".form__cri");
  const formCriteria = document.querySelector(".form__criteria");

  const elmContainer = document.getElementById("name");
  const propContainer = document.getElementById("prop");
  const btn = document.querySelector(".form__elements-button--b");
  const allElements = [...elmContainer.childNodes];
  let data;

  [elmContainer, propContainer].forEach((el) => {
    el.addEventListener("click", (e) => {
      const parent = e.target.closest(".form__elements-elm");
      if (parent) parent.classList.toggle("form__elements-elm--check");
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.matches(".form__input"))
      return formElement.classList.add("form__elements--show");

    if (e.target.matches(".form__cri"))
      return formCriteria.classList.toggle("form__elements--show");

    if (!e.target.closest("#prop") && !e.target.closest("#name")) {
      formElement.classList.remove("form__elements--show");
      formCriteria.classList.remove("form__elements--show");
    }
  });

  elmInput.addEventListener("keydown", (e) => {
    let value = elmInput.value;
    value = e.key.length > 1 ? value.slice(0, -1) : value + e.key;
    console.log(value);

    const filteredElm = allElements.filter(
      (el) => !el.firstElementChild.textContent.toLowerCase().includes(value)
    );

    allElements.forEach((el) => el.classList.remove("form__elements-elm--h"));
    filteredElm.forEach((el) => el.classList.add("form__elements-elm--h"));

    // display result
  });

  const renderHtml = function (obj) {
    const handleElms = (a) =>
      a.map((el) => `<div class="comp-row__result-elm">${el}</div>`).join("\n");

    let html = "";
    let contHtml = `
     <div class="com-row-container">
         {HTM}
     </div>
    `;
    const keys = Object.keys(obj);
    Object.values(obj).forEach((elm, i) => {
      let myHtml = `
      <div class="comp-row">
      <div class="comp-row__title">${keys[i]} :</div>
      <div class="comp-row__result">
        ${handleElms(elm)}
      </div>
    </div>
      `;
      html = html.concat(myHtml);
    });

    document
      .querySelector(".comp-container")
      .insertAdjacentHTML("beforeend", contHtml.replace("{HTM}", html));
  };

  // TODO
  btn.addEventListener("click", async (e) => {
    try {
      e.preventDefault();
      const elementsO = Array.from(elmContainer.children).filter((el) =>
        el.classList.contains("form__elements-elm--check")
      );
      const comparingCriteriaO = Array.from(
        propContainer.children
      ).filter((el) => el.classList.contains("form__elements-elm--check"));

      const elements = elementsO.map((el) => +el.firstElementChild.dataset.atn);

      const comparingCriteria = comparingCriteriaO.map((el) =>
        el.firstElementChild.textContent.split(" ").join("")
      );

      elementsO.forEach((el) => {
        el.classList.remove("form__elements-elm--check");
      });

      comparingCriteriaO.forEach((el) => {
        el.classList.remove("form__elements-elm--check");
      });

      // prepare Ui
      document.documentElement.style.setProperty("--bH", "auto");
      document.querySelector(".com-row-container")?.remove();

      document
        .querySelector(".comp-container")
        .insertAdjacentHTML(
          "beforeend",
          `<div class="com-row-container"></div>`
        );

      spinController.startAnimation(
        document.querySelector(".com-row-container")
      );

      sBtn.classList.add("btn--sort--sh");

      const result = await axios({
        method: "POST",
        url: "/api/v1/element",
        data: {
          elements,
          comparingCriteria,
        },
      });

      spinController.stopAnimation(
        document.querySelector(".com-row-container")
      );

      document.querySelector(".com-row-container").remove();

      renderHtml(result.data.data);
      data = result.data.data;
    } catch (err) {
      console.error(err);
    }
  });

  let turn = true;
  sBtn.addEventListener("click", (e) => {
    e.target.innerHTML = `&downarrow; ${turn ? "A" : "DE"}SC`;
    const arr = [];
    Object.values(data).forEach((el) => {
      el.reverse();
      arr.push(el);
    });

    const ar = arr.flat();
    document.querySelectorAll(".comp-row__result-elm").forEach((el, i) => {
      el.textContent = ar[i];
    });

    turn = !turn;
    // data.elements.reverse();
    // document
    //   .querySelectorAll(".com-row__result-elm")
    //   .forEach((el) => (el.textContent = data.elements[i]));
  });
};

module.exports = init;
