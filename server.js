const express = require("express");
const cors = require("cors");
const got = require("got");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

const TARGET = "https://kingdomofloathing.com"; // CHANGE THIS

app.get("*", async (req, res) => {
  try {
    const url = `${TARGET}${req.originalUrl}`;
    const response = await got(url, {
      followRedirect: true,
      headers: {
        "user-agent": req.headers["user-agent"] || "",
      },
    });

    let contentType = response.headers["content-type"] || "";
    if (contentType.includes("text/html")) {
      const $ = cheerio.load(response.body);

      // Remove JS-based redirects
      $('script').each((i, el) => {
        const content = $(el).html();
        if (content && content.includes("window.location")) {
          $(el).remove();
        }
      });

      // Rewrite <a href="..."> links to go through your proxy
      $("a").each((i, el) => {
        let href = $(el).attr("href");
        if (href && href.startsWith("/")) {
          $(el).attr("href", href);
        } else if (href && href.startsWith("http")) {
          if (href.startsWith(TARGET)) {
            $(el).attr("href", href.replace(TARGET, ""));
          } else {
            $(el).attr("target", "_blank"); // external links
          }
        }
      });

      res.set("Content-Type", "text/html");
      res.send($.html());
    } else {
      res.set("Content-Type", contentType);
      res.send(response.rawBody);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Proxy error.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy running at http://localhost:${port}`);
});
