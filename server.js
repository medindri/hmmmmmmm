// server.js
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(cors());

// Replace with the target site you want to proxy
const target = "https://castles.cc";

app.use(
  "/",
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { "^/": "" },
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
