from common import *

class HomePage:
    @app.route('/')
    def index():
        return render_template('index.html')