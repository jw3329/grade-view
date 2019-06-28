from grade_view import app


@app.route('/')
def index():
    return 'hello world'
