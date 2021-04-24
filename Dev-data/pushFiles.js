const fs = require("fs").promises;
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Element = require(`${__dirname}/../models/elementModel.js`);

dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection succesfull!");
  });

const deleteAll = async () => {
  try {
    await Element.deleteMany();
    console.log("Data deleted successfully");
    process.exit(1);
  } catch (err) {
    return console.error(err);
  }
};

const modifya2 = async () => {
  try {
    const data = JSON.parse(await fs.readFile(`${__dirname}/api2.json`, "utf8"))
      .elements;

    const filt = [
      "atomicRadius",
      "bondingType",
      "vanDelWaalsRadius",
      "yearDiscovered",
      "groupBlock",
      "oxidationStates",
      "atomicNumber",
    ];

    const myOriginal = JSON.parse(
      await fs.readFile(`${__dirname}/elements.json`, "utf8")
    ).map((ob, i) => {
      const filObj = {};
      const keys = Object.keys(ob);
      Object.values(ob).forEach((val, i) => {
        if (filt.includes(keys[i])) filObj[keys[i]] = val;
      });
      return filObj;
    });

    return data.map((el, i) => {
      const nO = { ...myOriginal[i] };
      const keys = Object.keys(el);

      Object.values(el).forEach((val, i) => {
        const mo = keys[i]
          .split("_")
          .map((el, i) => {
            let st;
            i !== 0 ? (st = el[0].toUpperCase()) : (st = el[0]);
            return st.concat(el.slice(1));
          })
          .join("");
        nO[mo] = val;
      });

      ["meltingPoint", "boilingPoint"].forEach((el, i) => {
        nO[el] = nO[i == 0 ? "melt" : "boil"];
      });

      nO.electronNegetavity = nO.electronegativityPauling;
      return nO;
    });
  } catch (err) {
    console.log(err);
  }
};

const pushElements = async () => {
  try {
    const myData = await modifya2();
    await Element.insertMany([...myData]);
    console.log("Data written successfully");
    process.exit(1);
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--save") return pushElements();
deleteAll();
