import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'

const landing = new Hono()

landing.get('/random-insult', async (c) => {
  try {
  const origin = new URL(c.req.url).origin
  const response = await fetch(origin + '/api/insults')
    const data = await response.json()

    return c.html(`
      <div class="p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
        <p class="text-2xl text-white mb-4">${data.content}</p>
        <p class="text-gray-400 text-sm">ID: ${data.id}</p>
      </div>
    `)
  } catch (error) {
    return c.html(`
      <div class="p-6 bg-red-500/20 backdrop-blur-lg rounded-lg border border-red-500/50">
        <p class="text-red-300">Failed to fetch insult</p>
      </div>
    `)
  }
})

landing.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
     <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Baibusu API</title>
      <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.cells.min.js"></script>
    </head>
    <body class="min-h-screen bg-gradient-to-b from-black via-indigo-600 to-purple-700">
      <div id="vanta-bg" class="fixed inset-0 -z-10"></div>
      <div class="container mx-auto px-4 py-16">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-6xl font-bold text-white mb-6">🍥 Baibusu API 🍥</h1>
          <p class="text-xl text-gray-300 mb-12">
            A RESTful API for getting a random insult.
          </p>

        <div id="actions" class="flex gap-4 items-center justify-center">
          <button
            hx-get="/random-insult"
            hx-target="#insult-display"
            hx-swap="innerHTML"
            hx-on::after-request="document.getElementById('actions').classList.add('mt-6')"
            class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
          >
            Get Random Insult
          </button>

          <a
            href="/docs"
            class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
          >
            API Docs
          </a>
        </div>

        <div id="insult-display" class="mt-4 text-lg font-medium"></div>
      </div>
      <script>
        VANTA.CELLS({
          el: "#vanta-bg",
          backgroundColor: 0x000000,  // background color
          color1: 0x4f46e5,           // indigo-ish
          color2: 0x8b5cf6,           // purple-ish
          color3: 0x000000,           // black-ish accents
          size: 2.00,
          speed: 1.00,
          scale: 1.00
        });
      </script>

    </body>
    </html>
  `, 200)
})

export default landing