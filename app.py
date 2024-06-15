from flask import Flask, render_template, request, redirect, send_from_directory, url_for, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/api/ping", methods=["GET"])
def ping():
  return jsonify(msg="I'm alive!")

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/layout/front')
def layout():
  return render_template('front-layout.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
  return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(success=False, message='No file part')
    file = request.files['file']
    if file.filename == '':
        return jsonify(success=False, message='No selected file')
    if file and allowed_file(file.filename):
        filename = 'front.png'
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return jsonify(success=True)
    return jsonify(success=False, message='File type not allowed')

@app.route('/save_front_data', methods=['POST'])
def save_canvas_data():
    # Retrieve data from the request body
    data = request.get_json()
    print(data)

    # Process the canvas object data (logic depends on your needs)
    # You can save the data to a database, file, or perform other actions

    # Return a JSON response
    return jsonify({'message': 'Canvas data received successfully!'})

if __name__ == '__main__':
  app.run(debug=True)