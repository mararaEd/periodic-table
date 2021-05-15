"use strict";
import initCompare from "./compare";
import initPeriodic from "./periodic";

if (document.querySelector(".per-container")) initPeriodic();
if (document.querySelector(".compare-body")) initCompare();
