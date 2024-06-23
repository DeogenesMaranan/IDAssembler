from common import *
from index import *
from layout import *
from project import *

@app.route("/ping", methods=["GET"])
def ping():
  return jsonify(msg="I'm alive!")

@app.route('/robots.txt')
def robots_txt():
    robots_content = """
    User-agent: *
    Disallow: /
    Allow: /$
    """
    return Response(robots_content, mimetype='text/plain')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == '__main__':
  app.run(debug=True)