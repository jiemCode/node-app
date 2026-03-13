const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const ENV = process.env.APP_ENV || "prod";
const VERSION = process.env.APP_VERSION || "local";

app.get("/", (req, res) => {
  res.json({
    app: "node-cicd-app",
    environment: ENV,
    version: VERSION,
    status: "running"
  });
});

app.get("/", (req, res) => {
  res.json({
    app: "node-cicd-app",
    environment: ENV,
    version: VERSION,
    status: "running"
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`#>> App running on port ${PORT} [env=${ENV}, version=${VERSION}]`);
});
