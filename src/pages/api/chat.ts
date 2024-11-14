import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API key from environment variables
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res
      .status(400)
      .json({ message: "Messages are required and must be an array" });
  }

  try {
    // Communicate with OpenAI's Chat API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Replace with your desired model (e.g., 'gpt-4' or 'gpt-3.5-turbo')
      messages: messages,
    });

    const message = completion.choices[0].message.content;
    res.status(200).json({ message });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ message: "Error generating response", error });
  }
}
