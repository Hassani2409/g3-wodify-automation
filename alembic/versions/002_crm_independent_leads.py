"""Add isolated CRM-independent intake tables without altering legacy Wodify leads."""
from alembic import op
from src.leads.models import Base

revision = "002_crm_independent_leads"
down_revision = "001_add_lead_nurturing_state"
branch_labels = None
depends_on = None


def upgrade():
    Base.metadata.create_all(bind=op.get_bind())


def downgrade():
    Base.metadata.drop_all(bind=op.get_bind())
