import "@babel/polyfill";

import initCompare from "./compare";
import initPeriodic from "./periodic";

if (document.querySelector(".container")) initPeriodic();
if (document.querySelector("form")) initCompare();
// const container = document.querySelector(".container");

// const handleName = (name) => {
//   const capitalI = [...name].findIndex((el, i) => el === el.toUpperCase());
//   return `${name.slice(0, capitalI)} ${name.slice(capitalI)}`;
// };

// const generateDetails = function (det) {
//   let html = "";
//   const keys = Object.keys(det);
//   Object.values(det).forEach((val, i) => {
//     const node = `
//     <div class="elem__overview-row">
//       <h3 class="elem__title">${handleName(keys[i])}</h3>
//       <p class="elem__detail">${val}</p>
//     </div>
//     `;
//     html = html.concat(node);
//   });

//   return html;
// };

// const generateHtml = function (prop) {
//   const exclude = ["symbol", "groupBlock", "name", "density", "__v", "_id"];
//   const filteredObj = {};
//   const keys = Object.keys(prop);
//   Object.values(prop).forEach((val, i) => {
//     if (!exclude.includes(keys[i])) filteredObj[keys[i]] = val;
//   });

//   return `
//   <div class="popup__element">
//   <h2 class="elem__sym">${prop.symbol}</h2>
//   <p class="elem__group">${handleName(prop.groupBlock)}</p>
//   <p class="elem__name">${prop.name}</p>
//   <p class="elem__den">${prop.density} g/mol</p>

//   <div class="elem__overview">
//      ${generateDetails(filteredObj)}
//   </div>

//   <div class="elem__row">
//     <span class="elm__num">${prop.atomicNumber}</span>
//     <span class="elm__num c">${prop.atomicNumber}</span>
//     <span class="elm__num e">${Math.trunc(
//       prop.atomicMass - prop.atomicNumber
//     )}</span>
//     <span class="elm__e">electrons</span>
//     <span class="elm__p c">protons</span>
//     <span class="elm__n e">neutrons</span>
//   </div>
// </div>
//   `;
// };

// container.addEventListener("click", async (e) => {
//   try {
//     const atN = +e.target.closest(".elm")?.firstElementChild.textContent;
//     if (!atN) return "error";

//     const popup = document.querySelector(".popup");
//     const popupC = document.querySelector(".popup__content");
//     popup.addEventListener("click", (e) => {
//       if (e.target.closest(".popup__close")) {
//         popup.classList.remove("popup--show");
//         spinController.stopAnimation();
//       }
//     });
//     popup.classList.add("popup--show");
//     spinController.startAnimation();

//     // Prepare
//     const myElm = await axios(`/api/v1/element/${atN}`);
//     const [elementProp] = myElm.data.data.element;
//     const html = generateHtml(elementProp);

//     // Remove Spinner

//     // Remove spinner and Render Element
//     setTimeout(() => {
//       spinController.delInterval();
//       document.querySelector(".popup__content").innerHTML = html;
//     }, 1500);
//   } catch (err) {
//     console.log(err);
//   }
// });
