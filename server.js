const express = require("express");
const got = require("got");
const cors = require("cors");

const app = express();
app.use(cors());

const TARGET = "https://www.kingdomofloathing.com";

app.get("*", async (req, res) => {
  try {
    const path = req.originalUrl;
    const url = `${TARGET}${path}`;

    const response = await got(url, {
      followRedirect: true,
      responseType: "buffer",
      headers: {
        "User-Agent": req.headers["user-agent"] || "",
      },
    });

    res.set("Content-Type", response.headers["content-type"] || "text/html");
    res.status(200).send(response.body);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).send("Proxy error.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy running at http://localhost:${port}`);
});
