const Element = require("../models/elementModel.js");

exports.view = async (req, res, next) => {
  const data = await Element.find().select("atomicNumber symbol groupBlock");
  let start = 0;
  let end = 2;
  const relations = { 1: 2, 2: 8, 3: 8, 4: 18, 5: 18, 6: 32, 7: 32 };
  const elements = Array.from({ length: 7 }, (_, i) => {
    if (i !== 0) {
      start = end;
      end = start + relations[i + 1];
    }
    return data.slice(start, end);
  });

  res.render("periodic", {
    elements,
  });
};

exports.renderCompare = async (req, res, next) => {
  const elements = await Element.find();
  const properties = Object.keys(elements[0]._doc);
  const filteredProperties = properties.filter(
    (prop) =>
      (Number.isFinite(elements[0][prop]) || prop === "ionizationEnergies") &&
      prop !== "__v"
  );

  res.render("compare", {
    elements,
    properties: filteredProperties,
  });
};
