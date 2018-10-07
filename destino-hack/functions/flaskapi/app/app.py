from flask import Flask
from flask import jsonify #

app = Flask(__name__)

@app.route('/category/<cat>')
def category(cat):
    return jsonify(
        category=cat
    )


if __name__ == "__main__":
    app.run(host='0.0.0.0')
