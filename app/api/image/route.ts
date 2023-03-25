import { Configuration, OpenAIApi } from 'openai'
import { z } from 'zod'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

const sleep = (n: number) => new Promise((r) => setTimeout(r, n))

export async function POST(request: Request) {
  const { prompt } = z
    .object({
      prompt: z.string(),
    })
    .parse(await request.json())

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are an assistant helping to prompt an image generation AI.

Here's a guide on how to prompt the AI:

WHAT SHOULD YOU INCLUDE IN A PROMPT?
Here are some ideas to use in your prompts, but your options are nearly endless:

Subject: Person, animal, landscape
Verb: What the subject is doing, such as standing, sitting, eating
Adjectives: Beautiful, realistic, big, colourful
Environment/Context: Outdoor, underwater, in the sky, at night
Lighting: Soft, ambient, neon, foggy
Emotions: Cosy, energetic, romantic, grim, loneliness, fear
Artist inspiration: Pablo Picasso, Van Gogh, Da Vinci, Hokusai
Art medium: Oil on canvas, watercolour, sketch, photography
Photography style: Polaroid, long exposure, monochrome, GoPro, fisheye, bokeh
Art style: Manga, fantasy, minimalism, abstract, graffiti
Material: Fabric, wood, clay
Colour scheme: Pastel, vibrant, dynamic lighting
Computer graphics: 3D, octane, cycles
Illustrations: Isometric, pixar, scientific, comic
Quality: High definition, 4K, 8K, 64K
SAMPLE PROMPT
Prompts for AI imaging are usually created in a specific structure: (Subject), (Action, Context, Environment), (Artist), (Media Type/Filter). For example, a prompt might look something like this: “An oil painting of a dalmatian wearing a tuxedo, outdoor, natural light, Da Vinci.”

The order in which the words are written is essential to getting the desired output–the words at the beginning of your prompt are weighted more than the others. You should list your description and concepts explicitly and separate each with a comma rather than create one long sentence.

For instance, these prompts will have different outcomes:

“A dog sitting on a Martian chair.”
“A dog sitting on a chair on Mars.”
“A dog sitting on a chair. The chair is on Mars.”`,
      },
      {
        role: 'user',
        content:
          "I'm playing a roguelike, and I got the following description:\n" +
          prompt +
          '\n\nI want to generate an image for this.\n\nGive me a prompt to send to an image generation AI. The prompt must be only one or two sentences.',
      },
    ],
  })

  const imagePrompt = completion.data.choices[0].message!.content

  // Lexica Art Search
  // const imageResponse = await fetch("https://lexica.art/api/v1/search?q=" + imagePrompt, { method: 'GET' });
  // const imageJSON = await imageResponse.json();
  // const imageLink = imageJSON.images[0]['src'];
  // return new Response(imageLink)

  // Stable Diffusion
  const rawImageResponse = await fetch(
    'https://api.replicate.com/v1/predictions',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + process.env.NEXT_PUBLIC_REPLICATE_KEY,
      },
      body: JSON.stringify({
        version:
          'db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
        input: {
          prompt: imagePrompt,
        },
      }),
    },
  )

  const rawJsonResponse = await rawImageResponse.json()
  const imageUrl = rawJsonResponse.urls['get']
  await sleep(10000)
  const newRawImageResponse = await fetch(imageUrl, {
    method: 'GET',
    headers: {
      Authorization: 'Token ' + process.env.NEXT_PUBLIC_REPLICATE_KEY,
    },
  })

  const newRawImageJsonResponse = await newRawImageResponse.json()
  console.log(newRawImageJsonResponse)
  const realImageURL = newRawImageJsonResponse.output[0]

  return new Response(realImageURL)
}
