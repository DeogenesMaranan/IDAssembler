from flask import Flask, render_template, request, redirect, send_from_directory, url_for, jsonify, send_file, Response
from werkzeug.exceptions import *
from flask_cors import CORS
import os
import shutil
import json
from core.spreadsheet import *
from core.overlay import *

app = Flask(__name__)
CORS(app)

IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in IMAGE_EXTENSIONS

def initialize_project(project_name):
    template_folder = os.path.join('projects', '0b0a999979cc5f89916dd5e6d803f6500a8a3cdde7733f755072022ff0a17a4e')
    project_path = os.path.abspath(os.path.join('projects', project_name))

    if not os.path.exists(project_path):
        try:
            shutil.copytree(template_folder, project_path)
            print(f"Template '{template_folder}' copied and renamed to '{project_name}' successfully.")
        except Exception as e:
            print(f"Error copying template: {e}")

def count_folders_starts_with(path, folder_prefix):
    count = int(0)
    for entry in os.listdir(path):
        full_path = os.path.join(path, entry)
        if os.path.isdir(full_path) and entry.startswith(folder_prefix):
            count += 1
    return count

class ErrorHandling:
    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        error_code = e.code
        error_message = e.description
        return render_template('error.html', error_code=error_code, error_message=error_message), error_code

    @app.errorhandler(Exception)
    def handle_exception(e):
        error_code = 500
        error_message = 'An unexpected error occurred.'
        return render_template('error.html', error_code=error_code, error_message=error_message), error_code