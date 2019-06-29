from grade_view.models import db
from grade_view.setup_database import database_setup
import logging

logging.getLogger().setLevel(logging.INFO)

logging.info('Deleting database')
db.drop_all()
logging.info('Setting up database')
database_setup(db)