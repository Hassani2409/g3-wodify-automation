"""Add lead nurturing state management

Revision ID: 001_add_lead_nurturing_state
Revises: 
Create Date: 2025-01-27 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = '001_add_lead_nurturing_state'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add nurturing_state column to leads table
    op.add_column('leads', sa.Column('nurturing_state', sa.String(), nullable=False, server_default='NEW'))
    
    # Add new email tracking columns
    op.add_column('leads', sa.Column('response_email_sent', sa.Boolean(), nullable=True, server_default='0'))
    op.add_column('leads', sa.Column('response_email_sent_at', sa.DateTime(), nullable=True))
    op.add_column('leads', sa.Column('nurturing_2_sent', sa.Boolean(), nullable=True, server_default='0'))
    op.add_column('leads', sa.Column('nurturing_2_sent_at', sa.DateTime(), nullable=True))
    op.add_column('leads', sa.Column('nurturing_5_sent', sa.Boolean(), nullable=True, server_default='0'))
    op.add_column('leads', sa.Column('nurturing_5_sent_at', sa.DateTime(), nullable=True))
    op.add_column('leads', sa.Column('nurturing_7_sent', sa.Boolean(), nullable=True, server_default='0'))
    op.add_column('leads', sa.Column('nurturing_7_sent_at', sa.DateTime(), nullable=True))
    
    # Add opt-out tracking
    op.add_column('leads', sa.Column('opted_out', sa.Boolean(), nullable=True, server_default='0'))
    op.add_column('leads', sa.Column('opted_out_at', sa.DateTime(), nullable=True))
    
    # Create index on nurturing_state for faster queries
    op.create_index('ix_leads_nurturing_state', 'leads', ['nurturing_state'])


def downgrade():
    # Drop index
    op.drop_index('ix_leads_nurturing_state', table_name='leads')
    
    # Drop columns
    op.drop_column('leads', 'opted_out_at')
    op.drop_column('leads', 'opted_out')
    op.drop_column('leads', 'nurturing_7_sent_at')
    op.drop_column('leads', 'nurturing_7_sent')
    op.drop_column('leads', 'nurturing_5_sent_at')
    op.drop_column('leads', 'nurturing_5_sent')
    op.drop_column('leads', 'nurturing_2_sent_at')
    op.drop_column('leads', 'nurturing_2_sent')
    op.drop_column('leads', 'response_email_sent_at')
    op.drop_column('leads', 'response_email_sent')
    op.drop_column('leads', 'nurturing_state')

