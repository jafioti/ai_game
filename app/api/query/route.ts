import { Configuration, OpenAIApi } from 'openai'
import { z } from 'zod'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(request: Request) {
  const raw = await request.json();
  console.log(raw);
  const { initial_description, history } = z
    .object({
      initial_description: z.string(),
      history: z.array(z.object({
        content: z.string(),
        role: z.string()
      })),
    })
    .parse(raw)

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are acting as a roguelike game. At each stage, the user will input an option, and you will then generate the next set of observations. You should then generate a list of 4 options for next actions to take.

When you generate options to take, they must be in the following format:
[Option 1] First Option
[Option 2] Second Option
[Option 3] Third Option
[Option 4] Fourth Option`,
      },
      { role: 'user', content: "Here is a description describing the start of the game:\n" + initial_description + "\n\nPlease simulate the next step of the game." },
    ].concat(history),
  })

  const response = completion.data.choices[0].message!.content

  return new Response(response)
}
