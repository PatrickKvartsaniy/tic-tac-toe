import asyncio
# import websockets
from aiohttp import web

async def handler(request):
    with open('templates/game.html', 'rb') as tmp:
        content = tmp.read()
        return web.Response(body=content, content_type='text.html')

async def wshandler(request):
    app = request.app
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    app['sockets'].append(ws)

    while True:
        msg = await ws.receive()
        if msg.tp == web.MsgType.text:
            print(f"Got message {msg.data}")
            for ws in app['sockets']:
                await ws.send_str(msg.data)
        elif msg.tp == web.MsgType.close or msg.tp == web.MsgType.error:
            break

    app['sockets'].remove(ws)
    print("Closed connection")
    return ws
    
async def game_loop(app):
    while True:
        for ws in app['sockets']:
            # ws.send_str("Hello")
            pass
        await asyncio.sleep(2)

app = web.Application()
app['sockets'] = []

asyncio.ensure_future(game_loop(app))

app.router.add_route('GET', '/', handler)
app.router.add_route('GET', '/connect', wshandler)
app.router.add_static('/static/', path='static/', name='static')

web.run_app(app)


# connected = set()

# async def echo(websocket, path):
#     global connected
#     connected.add(websocket)
#     while True:
#         msg = await websocket.recv()
#         try:
#             await asyncio.wait([ws.send(msg) for ws in connected])
#             await asyncio.sleep(10)
#         finally:
#             # Unregister.
#             # connected.remove(websocket)
#             pass    

# start_server = websockets.serve(echo, '127.0.0.1', 8500)

# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()  