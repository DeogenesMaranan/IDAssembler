from common import *

class ProjectManager:
    @app.route('/<project_name>', methods=['GET'])
    def show_project(project_name):
        front_path = os.path.abspath(os.path.join('projects', project_name, 'front_layout.xlsx'))
        back_path = os.path.abspath(os.path.join('projects', project_name, 'back_layout.xlsx'))
        
        if not os.path.exists(front_path):
            return redirect(url_for('show_layout', project_name=project_name, type='front'))
        elif not os.path.exists(back_path):
            return redirect(url_for('show_layout', project_name=project_name, type='back'))
        else:
            
            return render_template('project.html', front_path=front_path, back_path=back_path, project_name=project_name)

    @app.route('/download/<project_name>/<type>', methods=['GET'])
    def download_layout(project_name, type):
        layout_path = os.path.abspath(os.path.join('projects', project_name, f'{type}_layout.xlsx'))
        
        if type == 'front' or type == 'back':
            if os.path.exists(layout_path):
                return send_file(layout_path, as_attachment=True)
        
        return jsonify({'error': 'File not found'}), 404