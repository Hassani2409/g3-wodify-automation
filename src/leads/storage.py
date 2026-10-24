from functools import lru_cache

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from .config import get_settings
from .models import Base


@lru_cache
def get_sessions():
    settings = get_settings()
    url = settings.lead_database_url
    engine = create_engine(
        url,
        connect_args={"check_same_thread": False} if url.startswith("sqlite") else {},
        echo=False,
        poolclass=NullPool if not url.startswith("sqlite") else None,
        execution_options={
            "schema_translate_map": {None: settings.lead_database_schema}
        }
        if settings.lead_database_schema
        else {},
    )
    if url.startswith("sqlite"):

        @event.listens_for(engine, "connect")
        def sqlite_setup(connection, _):
            connection.execute("PRAGMA foreign_keys=ON")
            connection.execute("PRAGMA busy_timeout=5000")

    # Additive tables only, in a separate namespace from legacy Wodify leads.
    if settings.lead_initialize_schema:
        Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, expire_on_commit=False)
