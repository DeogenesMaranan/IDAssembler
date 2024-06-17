from flask import Flask, render_template, request, redirect, send_from_directory, url_for, jsonify
from werkzeug.exceptions import *
from flask_cors import CORS
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

IMAGE_EXTENTIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in IMAGE_EXTENTIONS

# error.py
from flask import render_template
from werkzeug.exceptions import HTTPException

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