from aiohttp import web, log
import aiohttp_jinja2
import asyncio
import jinja2
import handlers

async def static_process(request):
    return {'STATIC_URL': '/static/'}

async def get_app():

    middlewares = []

    app = web.Application(middlewares=middlewares)
    router = app.router

    # Routes

    router.add_route('GET', '/', handlers.index_handler)
    router.add_route('GET', '/game/{channel}', handlers.websocket_handler)
    router.add_static('/static', 'static')

    # Jinja2

