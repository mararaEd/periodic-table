import axios from "axios";
import { setTimeout } from "core-js";
import spinController from "./loader";

class Unit {
  constructor(units, perference, def, stF) {
    this.units = units;
    this.perference = perference;
    this.def = def;
    this.stF = stF;
  }

  calc(v, u) {
    const conditions = {
      [this.perference.trim() === this.def.trim()]: v,
      "o C": v - 273.15,
      "o F": (v - 273.15) * (9 / 5) + 32,
      "kg/m 3": v * 1000,
    };

    return conditions[true] || conditions[u].toFixed(2);
  }
}

const pref = (localStorage.getItem("unitsP") || "k, k, g/cm 3").split(",");

const units = [
  new Unit(["k", "o F", "o C"], pref[0], "k", "boiling point"),
  new Unit(["k", "o F", "o C"], pref[1], "k", "melting point"),
  new Unit(["g/cm 3", "kg/m 3"], pref[2], "g/cm 3", "density"),
];

const handlePref = function (pre) {
  let rev;
  let st = pre.split(" ");

  if (st.length < 2) return pre;

  if (pre.includes("/")) {
    st = st.reverse();
    rev = true;
  }

  const str = st.map((s, i) => {
    if (i === 0) return `<sup>${s}</sup>`;
    return s;
  });

  if (rev) str.reverse();
  return str.join("");
};

const reversePref = (txt) =>
  txt.length < 2 ? txt : txt.slice(0, txt.length - 1) + " " + txt.slice(-1);

export default () => {
  // Elements
  const container = document.querySelector(".container");
  const key = document.querySelector(".key");
  const popup = document.querySelector(".popup");
  const popupContent = document.querySelector(".popup__content");
  const searchBtn = document.querySelector(".fform__icon");
  const searchInp = document.querySelector(".fform__input");
  let elmRow, landscape, curDef, curOption;

  const remCustom = function () {
    if (popupContent.lastElementChild.classList.contains("fform__container"))
      Array.from(popupContent.children).forEach(
        (el, i) => i !== 0 && el.remove()
      );
    popupContent.classList.remove("popup__content--c");
  };

  const rem = (d, elm) => {
    curDef.classList.remove("fform__default--b");
    curOption.classList.remove("fform__default-options--v");
  };

  document.addEventListener("click", (e) => {
    const toggler = e.target.closest(".nav__item-toggle-cont");

    if (toggler) {
      toggler.classList.toggle("nav__item-toggle-cont--toggled");
      return setTimeout(() => {
        document.body.classList.toggle("dark");
      }, 150);
    }
    if (e.target.matches("#custom")) {
      // prepare html
      const subCollection = [];
      units.forEach((u, i) =>
        subCollection.push(`
          <div class="fform__group">
            <div class="fform__label">${u.stF}</div>
            <div class="fform__default">
              <p class="fform__default-text">${handlePref(u.perference)}</p>
              <svg class="fform__default-icon">
                 <use xlink:href='/img/sprites.svg#icon-chevron-down'></use>
              </svg>
            <div class="fform__default-options">
             ${u.units
               .map(
                 (u) =>
                   `<div class="fform__default-optionsOpt">${handlePref(
                     u
                   )}</div>`
               )
               .join("\n")}                
            </div>

            </div>
          </div>
        `)
      );

      const html = `
      <h2 class="h2 h2--black">customize your units</h2>
       <div class="fform__container">
         <div class="fform">
            ${subCollection.join("\n")}
            
            </div>
            <a class="btn btn--sa btn--form">Done</a>               
       </div>         
      `;

      // inseting html
      remCustom();
      popupContent.classList.add("popup__content--c");
      popupContent.insertAdjacentHTML("beforeend", html);
      popup.classList.add("popup--show");
    }

    if (e.target.closest(".nav__item-c"))
      return e.target.closest(".nav__item-c").classList.toggle("nav__item--v");

    if (e.target.closest("#key")) return key.classList.toggle("key--sh");

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

      const pE = document.querySelector(".popup__element");
      pE && pE.remove();
    }

    if (e.target.matches(".btn--form")) {
      // get values
      const prefs = [
        ...document.querySelectorAll(".fform__default-text"),
      ].map((el) => reversePref(el.textContent));

      prefs.forEach((el, i) => (units[i].perference = el));
      localStorage.setItem("unitsP", prefs);
      popup.classList.remove("popup--show");
    }

    if (e.target.matches(".fform__default-optionsOpt")) {
      // get the text and change
      const p = e.target.parentElement.parentElement;

      p.firstElementChild.innerHTML = e.target.innerHTML;
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

    const accTitl = e.target.closest(".elem__overview-heading");
    if (
      e.target.classList.contains("h3") ||
      e.target === accTitl ||
      e.target.closest(".elem__overview-icon")
    ) {
      const { height } = getComputedStyle(accTitl.lastElementChild);
      const trRel = {
        0: height,
        [height]: 0,
      };

      let next = document.querySelector(
        `.elem__overview-heading[data-pos="${+accTitl.dataset.pos + 1}"]`
      );

      if (!next && landscape) next = elmRow;

      if (next) {
        next.style.transitionDelay =
          getComputedStyle(next).transitionDelay.length === 2 ? "0.2s" : "0s";

        const curTy = next.dataset.tr;
        next.style.marginTop = trRel[curTy];
        next.dataset.tr = trRel[curTy];
      }

      accTitl.classList.toggle("elem__overview-heading--sA");
      accTitl.classList.toggle("elem__overview-heading--btn");
    }

    if (!e.target.closest(".fform__default-options") && curOption) return rem();
  });

  const handleName = (name) => {
    const capitalI = [...name].findIndex((el) => el === el.toUpperCase());
    return capitalI === -1
      ? name
      : `${name.slice(0, capitalI)} ${name.slice(capitalI)}`;
  };

  // o F
  // kg/m 3

  const cats = {
    History: ["yearDiscovered", "namedBy", "discoveredBy"],
    generalProperties: ["period", "electronicConfiguration", "groupBlock"],
    atomicProperties: [
      "atomicNumber",
      "atomicRadius",
      "bondingType",
      "oxidationStates",
      "electronNegetavity",
      "electronAffinity",
      "vanDelWaalsRadius",
    ],
    physicalProperties: ["boilingPoint", "meltingPoint", "appearance"],
    summary: ["summary"],
    ionizationEnergies: ["ionizationEnergies"],
  };

  const accordions = (det) => {
    const ordinals = {
      0: "1<sup>st</sup>",
      1: "2<sup>nd</sup>",
      2: "3<sup>rd</sup>",
    };
    const keys = Object.keys(cats);

    return keys.map((k, i) => {
      const nodes = [];

      cats[k].forEach((p) => {
        const pref = units
          .slice(0, 2)
          .find((u) => u.stF.split(" ").join("") === p.toLocaleLowerCase());

        if (Array.isArray(det[p]))
          return nodes.push(
            det[p]
              .filter((_, i) => i < 3)
              .map(
                (v, i) =>
                  `
          <div class="elem__overview-row">
          <h3 class="elem__title">${ordinals[i]} ionization energy</h3>
          <p class="elem__detail">${v}</p>
          </div>
          `
              )
              .join("\n")
          );

        let title =
          p === "summary"
            ? ""
            : `<h3 class="elem__title">${handleName(p)}</h3>`;

        nodes.push(`
            <div class="elem__overview-row">
            ${title}
            <p class="elem__detail">${
              pref && det[p]
                ? pref.calc(det[p], pref.perference) +
                  " " +
                  handlePref(pref.perference)
                : det[p]
            }</p>
      </div>        
      `);
      });

      return `
    <div data-tr="0" data-pos="${
      i + 1
    }" class="elem__overview-heading elem__overview-heading--sA elem__overview-heading--btn">
    <svg class="elem__overview-icon">
    <use xlink:href="/img/sprites.svg#icon-plus"></use>
    </svg>
    <h3 class="h3">${handleName(k)}</h3>
    <div class="elem__overview-accordion">
    ${nodes.join("\n")}
    </div>
        </div>
        `;
    });
  };

  const generateHtml = function (prop) {
    const d = units[2];
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
    <p class="elem__den">${
      prop.density ? d.calc(prop.density, d.perference) : prop.density
    } ${handlePref(d.perference)}</p>
    
    <div class="elem__overview" style="opacity: 0;">
    ${accordions(filteredObj)}
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
      remCustom();
      const bone = `
      <div class="popup__element">
      <div class="loader">
      <div class="loader__ball"></div>
      <div class="loader__bar loader__bar--1"></div>
      <div class="loader__bar loader__bar--2"></div>
      <div class="loader__bar loader__bar--3"></div>
      <div class="loader__bar loader__bar--4"></div>
      <div class="loader__bar loader__bar--5"></div>
      </div>  
      </div>
      `;

      popupContent.insertAdjacentHTML("beforeend", bone);
      spinController.startAnimation();
      popup.classList.add("popup--show");

      // Prepare
      const myElm = await axios(`/api/v1/element/?${field}=${query}`);
      const [elementProp] = myElm.data.data.elements;

      if (!elementProp) {
        const al = document.querySelector(".alert");
        al && al.remove();
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
      document.querySelector(".popup__element").innerHTML = html;

      // render element with appropriate height
      const allHeadings = document.querySelectorAll(".elem__overview-heading");
      const allH = [
        ...document.querySelectorAll(".elem__overview-accordion"),
      ].map((el) => getComputedStyle(el).height);

      allH.forEach((h, i) => {
        if (allHeadings.length > i + 1) {
          allHeadings[i + 1].style.marginTop = h;
          allHeadings[i + 1].dataset.tr = h;
        }
      });

      elmRow = document.querySelector(".elem__row");
      landscape = Number.parseFloat(getComputedStyle(elmRow).marginTop);

      if (landscape) {
        elmRow.style.marginTop = allH[allH.length - 1];
        elmRow.dataset.tr = allH[allH.length - 1];
      }

      document.querySelector(".elem__overview").style.opacity = 1;
      document.querySelectorAll("h3").forEach((el) => {
        el.addEventListener("mouseenter", (e) => {
          e.target.parentElement.style.animation =
            "border-dance 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite";
        });

        el.addEventListener("mouseleave", (e) => {
          e.target.parentElement.style.animation =
            "border-danc 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite";
        });
      });
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
    const atN = e.target.closest(".elm");
    if (!atN) return "error";
    loadProperties({
      field: "atomicNumber",
      query: +atN.firstElementChild.textContent,
    });
  });

  searchBtn.addEventListener("click", disElm);
  searchInp.addEventListener("keypress", function (e) {
    (e.which === 13 || e.keyCode === 13) && disElm();
  });
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
};
