from flask import Flask
app = Flask(__name__)


@app.route('/v1/categories/')
def categories():
    #return '[{"Title":"Affen","ID":3},{"Title":"Fische","ID":4},{"Title":"Huehner","ID":6},{"Title":"Hunde","ID":2},{"Title":"Katzen","ID":1},{"Title":"Kuscheltiere","ID":10},{"Title":"Maeuse","ID":5},{"Title":"Pferde","ID":7},{"Title":"Schlangen","ID":9},{"Title":"Voegel","ID":8}]'
    return '[{"name":"Affen","id":3}]'

@app.route('/v1/search')
def search():
    return '[{}}]'

@app.route('/v1/advertisement')
def advertisement():
    return '[{}]'

@app.route('/v1/advertisement/new')
def advertisement_new():
    return '["Hund","Katze"]'

@app.route('/v1/advertisement/{id}')
def advertisement_id(id):
    return '{}'


@app.route('/v1/user/login')
def login():
    return '{}'

@app.route('/v1/user/{email}')
def user_mail(email):
    return '{}'

@app.route('/')
def hello_geek():
    return '<h1>Hello from Flask & Docker</h2>'


if __name__ == "__main__":
    app.run(debug=True)
