import { Configuration, OpenAIApi } from 'openai'
import { z } from 'zod'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(request: Request) {
    const { query } = z
        .object({
            query: z.string(),
        })
        .parse(await request.json())

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
            { role: 'user', content: query },
        ],
    })

    const response = completion.data.choices[0].message!.content

    return new Response(response)
}
