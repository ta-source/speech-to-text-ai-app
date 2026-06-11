from database.db import db
from datetime import datetime
from datetime import datetime
from zoneinfo import ZoneInfo

class Transcript(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    text = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(
            ZoneInfo("Asia/Kolkata")
        )
    )