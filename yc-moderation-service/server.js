const express = require("express");
const moderateContent = require("./moderator");

const app = express();
app.use(express.json());

app.post("/moderate", async (req, res) => {
  const { contentId, contentType, text } = req.body;

  try {
    const result = await moderateContent(contentId, contentType, text);
    res.json(result);
  } catch (e) {
    console.error(e.response?.data || e.message || e);
    res.status(500).json({ error: e.response?.data || e.message });
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));