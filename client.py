from aiohttp import web, log
import aiohttp_jinja2
import asyncio
import jinja2
import handlers
from collections import defaultdict

async def static_processor(request):
    return {'STATIC_URL': '/static/'}

# Websockets  container

class Blist(list):

    def broadcast(self,message):
        log.ws_logger.info('Sending message to %d waiters', len(self))
        for waiter in self:
            try:
                waiter.send_str(message)
            except:
                log.ws_logger.error('Error was happened during broadcasting: ', exc_info=True)


async def get_app():

    middlewares = []

    # App initialization 

    app = web.Application(middlewares=middlewares)
    app['waiters'] = defaultdict(Blist)
    # Routes

    router = app.router

    router.add_route('GET', '/', handlers.index_handler)
    router.add_route('GET', '/game/{channel}', handlers.websocket_handler)
    router.add_static('/static', 'static')

    # Jinja2

    aiohttp_jinja2.setup(
        app,
        loader = jinja2.FileSystemLoader('templates'),
        context_processors = [static_processor,]
    )

    #Closing websocket

    async def close_websocket(app):
        for channel in app['waiters'].values():
            for ws in channel:
                await ws.close(code = 1000, message = 'Server shutdown')

    app._on_shutdown.append(close_websocket)

    return app


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    app = loop.run_until_complete(get_app)
    web.run_app(app)