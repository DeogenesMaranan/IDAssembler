from common import *
from core.spreadsheet import *
from core.overlay import *

class LayoutPage:
    @app.route('/<project_name>/layout', methods=['GET'])
    def upload(project_name):
        layout_type = request.args.get('type')
        if layout_type in ['front', 'back']:
            return render_template('layout.html', layout_type=layout_type, project_name=project_name)
        else:
            raise NotFound()

    @app.route('/<project_name>/backgrounds/<filename>')
    def uploaded_backgrounds(project_name, filename):
        uploads_path = os.path.join('projects', project_name, 'backgrounds')
        return send_from_directory(uploads_path, filename)

    @app.route('/<project_name>/upload/background', methods=['POST'])
    def upload_background(project_name):
        uploads_path = os.path.join('projects', project_name, 'backgrounds')

        if 'file' not in request.files:
            return jsonify(success=False, message='No file part')
        
        file = request.files['file']
        if file.filename == '':
            return jsonify(success=False, message='No selected file')

        upload_type = request.form.get('type')
        print(f"Received type parameter: {upload_type}")

        if file and allowed_file(file.filename):
            filename = 'front.png' if upload_type == 'front' else 'back.png'
            file.save(os.path.join(uploads_path, filename))
            return jsonify(success=True)

        return jsonify(success=False, message='File type not allowed')

    @app.route('/<project_name>/save', methods=['POST'])
    def save_canvas_data(project_name):
        layout_type = request.args.get('type')
        client_width = int(request.args.get('width'))
        client_height = int(request.args.get('height'))
        if layout_type not in ['front', 'back']:
            return jsonify(success=False, message='Invalid layout type')

        data = request.get_json()
        print(f"{layout_type.capitalize()} Layout Data Saved Successfully")
        try:
            save_to_excel(data, os.path.join('projects', project_name, f'{layout_type}_layout.xlsx'))

        except Exception as e:
            print(f"Error saving data: {e}")
            return jsonify(success=False, message="Error saving data")
        
        try:
            overlayGenerator = OverlayGenerator()
            overlay_path = os.path.join('projects', project_name, 'try.png')
            overlayGenerator.generate_image(data, client_width, client_height, overlay_path)

        except Exception as e:
            print(f"Error generating overlay image: {e}")
            return jsonify(success=False, message="Error generating overlay image")

        return jsonify(success=True, message=f"{layout_type.capitalize()} Layout Data and Overlay Image Saved Successfully")