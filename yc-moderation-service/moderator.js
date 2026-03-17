require('dotenv').config();
const axios = require("axios");

const API_KEY = process.env.API_KEY;

const MODEL_URI = `gpt://b1ggs733qid7s0v6nbai/yandexgpt-5.1/latest`;

async function moderateContent(contentId, contentType, text) {
  const prompt = `
Представь, что ты модератор сайта с отзывами пользователей о городах России.
Твоя задача: проверять тексты на нежелательный контент: нецензурная лексика, оскорбления, разжигание ненависти, пропаганда насилия, спам, реклама, дезинформация.
Возвращай строго JSON по схеме:

{
    "contentId": ${contentId},
    "contentType": "${contentType}",
    "moderationResult": "approved|blocked|suspicious",
    "violationSeverity": "low|medium|high",
    "decisionDate": "текущая дата в ISO",
    "reason": "описание причины"
}

Текст для модерации:
"""${text}"""
`;

const res = await axios.post(
  "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
  {
    modelUri: MODEL_URI,
    completionOptions: { stream: false, temperature: 0 },
    messages: [
      { role: "user", text: prompt }
    ]
  },
  {
    headers: {
      Authorization: `Api-Key ${API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);

const jsonText = res.data.result.alternatives[0].message.text;

const cleanedText = jsonText.trim().replace(/^```+/, '').replace(/```+$/, '').trim();

try {
  return JSON.parse(cleanedText);
} catch (err) {
  return { error: "Invalid JSON from model", raw: jsonText };
}
}

module.exports = moderateContent;