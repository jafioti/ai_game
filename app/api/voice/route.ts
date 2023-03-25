import { Configuration, OpenAIApi } from 'openai'
import { z } from 'zod'

export async function POST(request: Request) {
  const { prompt } = z
    .object({
      prompt: z.string(),
    })
    .parse(await request.json())


  const data = {
    text: prompt,
    voice_settings: {
      stability: 0,
      similarity_boost: 0,
    },
  };

  // Define custom headers
  const headers = new Headers();
  headers.append("accept", "audio/mpeg");
  headers.append("Content-Type", "application/json");
  headers.append("xi-api-key", process.env.ELEVEN_KEY!);

  // Prepare the request options
  const requestOptions: RequestInit = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data), // Convert the data object to a JSON string
  };

  // Make the request
  fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the received JSON data
    })
    .then((audio_data) => {
      const audioBlob = new Blob([audio_data], { type: "audio/mpeg" });
      return new Response(audioBlob);
    });
}
