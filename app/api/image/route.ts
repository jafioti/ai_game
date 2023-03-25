import { Configuration, OpenAIApi } from 'openai'
import { z } from 'zod'

export async function POST(request: Request) {
  const { prompt } = z
    .object({
      prompt: z.string(),
    })
    .parse(await request.json())


  // Get image
  const rawImageResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + process.env.NEXT_PUBLIC_REPLICATE_KEY,
    },
    body: JSON.stringify({
      version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      input: {
        prompt: prompt
      }
    }),
  });

  const rawJsonResponse = await rawImageResponse.json()
  const imageUrl = rawJsonResponse.urls['get']
  const newRawImageResponse = await fetch(imageUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + process.env.NEXT_PUBLIC_REPLICATE_KEY,
    },
  });

  const newRawImageJsonResponse = await newRawImageResponse.json();
  const realImageURL = newRawImageJsonResponse.output[0];

  return new Response(realImageURL);
}
