const express = require("express");
const cors = require("cors");
const { createProxyMiddleware, responseInterceptor } = require("http-proxy-middleware");

const app = express();
app.use(cors());

const target = "https://kingdomofloathing.com"; // Replace with your target site

app.use(
  "/",
  createProxyMiddleware({
    target,
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      const contentType = proxyRes.headers['content-type'] || '';
      if (contentType.includes("text/html")) {
        let html = responseBuffer.toString("utf8");
        // Optionally rewrite links or scripts here
        return html;
      }
      return responseBuffer;
    }),
    pathRewrite: { "^/": "" },
    followRedirects: true, // Important: follow redirects instead of forwarding them
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
