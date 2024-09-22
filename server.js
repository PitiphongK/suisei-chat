import OpenAI from "openai";
import bodyParser from 'body-parser';
import express from 'express';
import fs from 'node:fs/promises';
import cors from 'cors';
const app = express();
const port = 8002;

app.use(bodyParser.json())

app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/message', async (req, res) => {
    const request = req.body.messages;
    try {
        const description = await fs.readFile('suisei_description.txt', { encoding: 'utf8' });
        const completion  = await openai.chat.completions.create({
            messages: [{"role": "system", "content": description}].concat(request),
            model: "gpt-4o-mini",
        });
    
        res.status(200).send({ message: completion.choices[0].message.content, });
    } catch (err) {
        console.error(err);
        res.status(500).send(`Error processing request: ${request}`)
    }
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})