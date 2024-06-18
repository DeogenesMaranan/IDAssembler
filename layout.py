from common import *
from core.place import *

class LayoutPage:
    @app.route('/layout', methods=['GET'])
    def upload():
        layout_type = request.args.get('type')
        if layout_type in ['front', 'back']:
            return render_template('layout.html', layout_type=layout_type)
        else:
            raise NotFound()

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    @app.route('/upload', methods=['POST'])
    def upload_file():
        if 'file' not in request.files:
            return jsonify(success=False, message='No file part')
        
        file = request.files['file']
        if file.filename == '':
            return jsonify(success=False, message='No selected file')

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

        data = request.get_json()
        print(f"{layout_type.capitalize()} Layout Data Saved Successfully")
        try:
            save_to_excel(data, f'{layout_type}_layout.xlsx')
        except Exception as e:
            print(f"Error saving data: {e}")
            return jsonify(success=False, message="Error saving data")

        return jsonify({'message': f'{layout_type.capitalize()} Layout Canvas data received successfully!', 'success': True})