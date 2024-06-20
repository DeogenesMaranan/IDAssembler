from common import *
from index import *
from layout import *
from project import *

@app.route("/ping", methods=["GET"])
def ping():
  return jsonify(msg="I'm alive!")

if __name__ == '__main__':
  app.run(debug=True)