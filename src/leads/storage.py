from functools import lru_cache

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from .config import get_settings
from .models import Base


@lru_cache
def get_sessions():
    url = get_settings().lead_database_url
    engine = create_engine(
        url,
        connect_args={"check_same_thread": False} if url.startswith("sqlite") else {},
        echo=False,
    )
    if url.startswith("sqlite"):

        @event.listens_for(engine, "connect")
        def sqlite_setup(connection, _):
            connection.execute("PRAGMA foreign_keys=ON")
            connection.execute("PRAGMA busy_timeout=5000")

    # Additive tables only, in a separate namespace from legacy Wodify leads.
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, expire_on_commit=False)
