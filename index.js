const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const System =
  'You have been given a text enclosed within tripple quotation. Your job is to understand what the text is about and categories it to any one of the given categories. The categories are "Beauty", "Entertainment", "Sports" and "Travel". Give the response in a javascript object format such as these examples - {"Sunscreen can prevent skin cancer" : "Beauty"}, {"Virat Kohli made another century in the yesterday match": "Sports"}';

app.post("/generate-response", async (req, res) => {
  try {
    const { text } = req.body;

    // const prompt = PROMPT.replace("$", text);

    const prompt = `Here is the text '''${text}'''`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: System },
        { role: "user", content: prompt },
      ],
    });

    const answer = completion.data.choices[0].message.content.trim();
    res.json(answer);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
