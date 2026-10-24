"""Run `python -m src.leads.worker --once` or leave running for persistent retries."""
import argparse
import asyncio

from .config import get_settings
from .service import process_next
from .storage import get_sessions


async def run(once=False):
    while True:
        state = await process_next(get_sessions(), get_settings())
        if once and state is None:
            return
        if state is None:
            await asyncio.sleep(5)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--once", action="store_true", help="Drain currently due jobs, then exit"
    )
    asyncio.run(run(parser.parse_args().once))
