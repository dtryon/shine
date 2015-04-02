from flask import Flask, json, request, send_file

app = Flask(__name__, static_url_path='/../')

def run():
    app.run(debug=True)

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/image/<image_id>', methods=['GET'])
def get_image(image_id):
    return 'Image %s' % image_id

@app.route('/image', methods=['POST'])
def new_image():
    return 'Image with name \'%s\'' % request.json.get('name')

if __name__ == "__main__":
    app.run()
