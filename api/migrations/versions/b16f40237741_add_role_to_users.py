"""add role to users

Revision ID: b16f40237741
Revises: 2731b8330a43
Create Date: 2026-10-21 03:21:01.736272

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b16f40237741'
down_revision: Union[str, Sequence[str], None] = '2731b8330a43'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'users',
        sa.Column(
            'role',
            sa.String(length=20),
            server_default=sa.text("'viewer'"),
            nullable=False,
        ),
    )
    op.create_check_constraint(
        'ck_users_role_valid',
        'users',
        "role IN ('admin', 'viewer')",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('ck_users_role_valid', 'users', type_='check')
    op.drop_column('users', 'role')