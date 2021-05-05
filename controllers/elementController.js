const Element = require("../models/elementModel.js");

exports.getAllElements = async (req, res, next) => {
  try {
    const query = {};
    const keys = Object.keys(req.query);
    Object.values(req.query).forEach(
      (val, i) => (query[keys[i]] = Number(val) || val)
    );

    let elements;
    if (req.query.name) {
      elements = await Element.find().find({
        name: { $regex: query.name, $options: "ix" },
      });

      elements.sort((a, b) => {
        if (a.name.toLowerCase().startsWith(req.query.name)) return -1;
        if (b.name.toLowerCase().startsWith(req.query.name)) return 1;
        return 0;
      });
    }

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
          let nIn = false;

          const orignalA = [a, b].map((prop, i) => {
            const newObj = { ...prop._doc };
            const conditions = {
              Br: (newObj.exceeds = ["Se"]),
              N: (newObj.exceeds = ["Cl"]),
            };

            if (cri === "electronNegetavity")
              if (conditions[prop.symbol]) nIn = i + 1;
            console.log(conditions[prop.symbol], i);
            return newObj;
          });

          if (
            nIn &&
            orignalA[nIn - 1].exceeds.includes(
              orignalA.find((_, i) => i !== nIn - 1).symbol
            )
          )
            return nIn - 1 === 0 ? 1 : -1;

          const A = Math.abs(a[cri]);
          const B = Math.abs(b[cri]);
          return A - B;
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
