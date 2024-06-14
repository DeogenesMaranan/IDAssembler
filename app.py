from flask import Flask, render_template, request, redirect, send_from_directory, url_for, jsonify

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

if __name__ == '__main__':
    app.run(debug=True)