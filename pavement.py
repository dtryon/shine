import os
import sys
from paver.easy import *
import paver.doctools
from paver.setuputils import setup


BASE_DIR = os.path.abspath(os.curdir)
API_PROJECT = 'api'
API_PROJECT_DIR = os.path.join(BASE_DIR, API_PROJECT)

sys.path.append(BASE_DIR)
from api import app

setup(
    name="Shine",
    packages=['shine'],
    version="0.0.1",
    url="http://www.davintryon.com/",
    author="Davin Tryon",
    author_email="davintryon@gmail.com"
)


@task
def start_server():
    app.run()
