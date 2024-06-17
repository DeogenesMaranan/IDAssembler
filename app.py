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

@app.route('/layout/<layout_type>')
def layout(layout_type):
    if layout_type in ['front', 'back']:
        return render_template('layout.html', layout_type=layout_type)
    else:
        return "Layout type not found", 404

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

    # Debugging: Print the value of 'type' received from the form
    upload_type = request.form.get('type')
    print(f"Received type parameter: {upload_type}")

    if file and allowed_file(file.filename):
        filename = 'front.png' if upload_type == 'front' else 'back.png'
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify(success=True)

    return jsonify(success=False, message='File type not allowed')


@app.route('/save', methods=['POST'])
def save_canvas_data():
    layout_type = request.args.get('type')
    if layout_type not in ['front', 'back']:
        return jsonify(success=False, message='Invalid layout type')
    
    # Proceed with processing and saving canvas data based on layout_type
    data = request.get_json()
    print(f"{layout_type.capitalize()} Layout Data:", data)
    # Example logic: Save data to database, file, etc.
    
    return jsonify({'message': f'{layout_type.capitalize()} Layout Canvas data received successfully!', 'success': True})


if __name__ == '__main__':
  app.run(debug=True)