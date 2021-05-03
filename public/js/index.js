import "@babel/polyfill";

import initCompare from "./compare";
import initPeriodic from "./periodic";

if (document.querySelector(".container")) initPeriodic();
if (document.querySelector("form")) initCompare();