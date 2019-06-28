from grade_view.setup import app

@app.route('/')
def index():
    return 'hello world'
