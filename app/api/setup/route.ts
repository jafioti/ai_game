import { Configuration, OpenAIApi } from 'openai'
import { z } from 'zod'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(request: Request) {
  const { initial_desc } = z
    .object({
      initial_desc: z.string(),
    })
    .parse(await request.json())

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant helping with a roguelike game.`,
      },
      { role: 'user', content: "Come up with a description for the start of a roguelike game, in the following style: " + initial_desc + "\n\nMake the description no more than 4 sentences." },
    ],
  })

  const response = completion.data.choices[0].message!.content

  return new Response(response)
}
