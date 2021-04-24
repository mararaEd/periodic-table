const Element = require("../models/elementModel.js");

exports.getAllElements = async (req, res, next) => {
  try {
    const query = {};
    const keys = Object.keys(req.query);
    Object.values(req.query).forEach(
      (val, i) => (query[keys[i]] = Number(val) || val)
    );

    let elements;
    if (req.query.name)
      elements = await Element.find({
        name: { $regex: query.name, $options: "ix" },
      });

    if (!elements) elements = await Element.find(req.query);

    res.status(200).json({
      status: "success",
      result: elements.length,
      data: {
        elements,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.compareElements = async (req, res, next) => {
  try {
    const required = req.body;
    // getRequired elements
    let elements = await Element.find({
      atomicNumber: { $in: required.elements },
    }).select(
      `${required.comparingCriteria.join(" ")} atomicNumber symbol name`
    );

    if (required.comparingCriteria.includes("ionizationEnergies"))
      elements = elements.map((el) => {
        el.ionizationEnergies = el.ionizationEnergies[0];
        return el;
      });

    // Sort elements with requiredCriterias
    const result = {};

    required.comparingCriteria.forEach((cri, i) => {
      const sortedEl = [...elements]
        .sort((a, b) => {
          const A = Math.abs(a[cri]);
          const B = Math.abs(b[cri]);

          if (A < B) return -1;
          if (A === B) return 0;
          return 1;
        })
        .map((el, i) => el.symbol);

      result[cri] = sortedEl;
    });

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
