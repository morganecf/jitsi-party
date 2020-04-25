from flask import Flask, send_from_directory, redirect, url_for

app = Flask(__name__, static_folder='client/js')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and not path.startswith('client'):
        return redirect(url_for('serve'))
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(use_reloader=True, port=3000, threaded=True)
