import os
import sys
from paver.easy import *
import paver.doctools
from paver.setuputils import setup
import subprocess
import atexit


BASE_DIR = os.path.abspath(os.curdir)
API_PROJECT = 'api'
API_PROJECT_DIR = os.path.join(BASE_DIR, API_PROJECT)
CLIENT_PROJECT = 'app'
CLIENT_PROJECT_DIR = os.path.join(BASE_DIR, CLIENT_PROJECT)

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

@task
def start_client():
	command = "gulp serve"
	subprocess.Popen(command.split(), cwd=CLIENT_PROJECT_DIR)

@task
@needs(['start_client', 'start_server'])
def start():
	pass


