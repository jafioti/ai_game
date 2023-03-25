// These styles apply to every route in the application
import './globals.css'
import Provider from './Provider'

export const metadata = {
    title: 'AI Roguelike',
    description: 'AI game',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en' className='h-full w-full'>
            <body className='h-full w-full'>
                <Provider>{children}</Provider>
            </body>
        </html>
    )
}
