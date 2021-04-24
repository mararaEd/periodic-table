const path = require("path");
const express = require("express");
const helmet = require("helmet");

const viewRoutes = require("./routes/viewRoutes.js");
const elementRoutes = require("./routes/elementRoutes.js");

const app = express();

// Middlewares
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

if (process.env.NODE_ENV === "development")
  app.use((req, res, next) => {
    console.log(`new ${req.method} request, ${req.originalUrl}`);
    next();
  });

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/api/v1", elementRoutes);
app.use("/", viewRoutes);

app.get("*", (req, res, next) => {
  res.render("error", {
    msg: "404 page doesn't exist",
  });
});

module.exports = app;
