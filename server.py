import asyncio
import aiohttp
from aiohttp import web

async def handler(request):

    ws = web.WebSocketResponse()
    await ws.prepare(request)

    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.TEXT:
            if msg.data == "close":
                ws.close()
            else:
                await ws.send_str(msg.data + '/answer')
        elif msg.type == aiohttp.WSMsgType.ERROR:
            print('ws connection closed with exception %s' %
                  ws.exception())
    print("WebSocket connection closed")
    return ws

app = web.Application()
app.route.add_get('/game', handler)

loop = asyncio.get_evet_loop()