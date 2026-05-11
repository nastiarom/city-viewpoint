const express = require("express");
const cors = require("cors");
const axios = require("axios");
const moderateContent = require("./moderator");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const REVIEW_UPDATE_URL = "http://localhost:8081/review/status/update";
const COMMENT_UPDATE_URL = "http://localhost:8082/comment/update/status";
const SERVICE_JWT = process.env.SERVICE_JWT;

app.post("/moderate", async (req, res) => {
  const { contentId, contentType, text } = req.body;
  let finalStatus = "moderation error";
  console.log(`[LOG] Поступил запрос на модерацию: ${contentType} (ID: ${contentId})`);
  console.log(`[LOG] Текст: "${text.substring(0, 60)}..."`);

  try {
    const result = await moderateContent(contentId, contentType, text);

    console.log("ОТВЕТ YANDEX GPT:");
    console.log(JSON.stringify(result, null, 2));

    if (result.error) {
      console.error("[ERROR] Модель вернула ошибку в JSON");
      finalStatus = "moderation error";
    } else {
      const mapping = {
        "approved": "published",
        "blocked": "blocked",
        "suspicious": "undefined"
      };
      finalStatus = mapping[result.moderationResult] || "moderation error";
    }

    console.log(`[LOG] Результирующий статус для базы: [${finalStatus.toUpperCase()}]`);

    let updateUrl = "";
    let idQueryParam = "";

    if (contentType === "comment") {
      updateUrl = COMMENT_UPDATE_URL;
      idQueryParam = "comment_id";
    } else {
      updateUrl = REVIEW_UPDATE_URL;
      idQueryParam = "review_id";
    }

    const finalUrl = `${updateUrl}?${idQueryParam}=${contentId}&status=${finalStatus}`;
    console.log(`[DB] Отправка PATCH на: ${finalUrl}`);

    const dbResponse = await axios.patch(
      finalUrl,
      {},
      {
        headers: {
          "Authorization": `Bearer ${SERVICE_JWT}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`[DB] Ответ сервера БД: Статус ${dbResponse.status} (${dbResponse.statusText})`);

    res.json({
      success: true,
      newStatus: finalStatus,
      modelVerdict: result.moderationResult,
      reason: result.reason
    });

  } catch (e) {
    console.error(`\n!!! КРИТИЧЕСКАЯ ОШИБКА СЕРВИСА МОДЕРАЦИИ !!!`);
    const errorMsg = e.response?.data || e.message;
    console.error("Детали:", errorMsg);

    try {
      const fallbackUrl = contentType === "comment" ? COMMENT_UPDATE_URL : REVIEW_UPDATE_URL;
      const fallbackParam = contentType === "comment" ? "comment_id" : "review_id";

      await axios.patch(`${fallbackUrl}?${fallbackParam}=${contentId}&status=moderation error`,
        {},
        { headers: { "Authorization": `Bearer ${SERVICE_JWT}` } }
      );
      console.log("[DB] Статус 'moderation error' записан в базу.");
    } catch (dbErr) {
      console.error("[DB] Не удалось обновить статус даже на 'error':", dbErr.message);
    }

    res.status(500).json({ error: typeof errorMsg === 'string' ? errorMsg : "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Moderation Microservice is running on port 3000");
  console.log(`Review DB: ${REVIEW_UPDATE_URL}`);
  console.log(`Comment DB: ${COMMENT_UPDATE_URL}`);
});
