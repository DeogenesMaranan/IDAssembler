from common import *

class ProjectManager:
    @app.route('/<project_name>', methods=['GET'])
    def show_project(project_name):
        project_dir = os.path.abspath(os.path.join('projects', project_name))
        front_path = os.path.join(project_dir, 'front_layout.xlsx')
        back_path = os.path.join(project_dir, 'back_layout.xlsx')
        
        if not os.path.exists(front_path):
            return redirect(url_for('show_layout', project_name=project_name, type='front'))
        elif not os.path.exists(back_path):
            return redirect(url_for('show_layout', project_name=project_name, type='back'))
        else:
            front_image_count = count_folders_starts_with(project_dir, 'front_layout_Image')
            back_image_count = count_folders_starts_with(project_dir, 'back_layout_Image')
            return render_template('project.html', front_path=front_path, back_path=back_path, project_name=project_name, front_image_count=front_image_count, back_image_count=back_image_count)

    @app.route('/<project_name>/download/<type>', methods=['GET'])
    def download_layout(project_name, type):
        layout_path = os.path.abspath(os.path.join('projects', project_name, 'backup', f'{type}_layout.xlsx'))
        
        if type == 'front' or type == 'back':
            if os.path.exists(layout_path):
                return send_file(layout_path, as_attachment=True)
        
        return jsonify({'error': 'File not found'}), 404
    
    @app.route('/<project_name>/upload/images', methods=['POST'])
    def upload_images(project_name):
        folder_name = request.args.get('folder')
        uploads_path = os.path.join('projects', project_name, folder_name)

        files = request.files.getlist('file')
        
        if not files or all(file.filename == '' for file in files):
            return jsonify(success=False, message='No selected file')

        for file in files:
            if file and file.filename != '':
                file.save(os.path.join(uploads_path, file.filename))

        return jsonify(success=True)
    
    @app.route('/<project_name>/upload/data', methods=['POST'])
    def upload_data(project_name):
        layout_type = request.args.get('type')
        if layout_type not in ['front', 'back']:
            return jsonify(success=False, message='Invalid layout type')

        filename = f"{layout_type}_layout.xlsx"

        files = request.files.getlist('file')
        for file in files:
            file.save(os.path.join('projects', project_name, filename))

        return jsonify(success=True)