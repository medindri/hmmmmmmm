const express = require("express");
const cors = require("cors");
const got = require("got");

const app = express();
app.use(cors());

const TARGET_URL = "https://kingdomofloathing.com"; // Change this to your target

app.get("*", async (req, res) => {
  try {
    const path = req.originalUrl;
    const url = `${TARGET_URL}${path}`;

    const response = await got(url, {
      followRedirect: true,
      headers: {
        "User-Agent": req.headers["user-agent"] || "",
      },
    });

    // Forward headers manually
    res.set("Content-Type", response.headers["content-type"] || "text/html");
    res.send(response.body);
  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
