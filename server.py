import asyncio
import datetime
import random
import websockets

async def echo(websocket, path):
    async for msg in websocket:
        await websocket.send(msg)

start_server = websockets.serve(echo, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()