import os
import json
import requests
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from pathlib import Path

# IPFS configuration
IPFS_URL = 'https://ipfs.infura.io:5001/api/v0/add'

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Make sure upload directory exists
Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_to_ipfs():
    # Check if the file is part of the request
    if 'file' not in request.files:
        print('No file part')
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    name = request.form.get('name')
    description = request.form.get('description')

    if file.filename == '':
        print('No selected file')
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Upload image to IPFS
        with open(filepath, 'rb') as img:
            response = requests.post(IPFS_URL, files={'file': img})
            if response.status_code == 200:
                image_hash = response.json()['Hash']
            else:
                print("Failed to upload image to IPFS")
                return jsonify({'error': 'Failed to upload image to IPFS'}), 500

        # Create metadata
        metadata = {
            'name': name,
            'description': description,
            'image': f'ipfs://{image_hash}'
        }

        # Convert metadata to JSON
        metadata_json = json.dumps(metadata)
        metadata_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{filename}_metadata.json')
        with open(metadata_path, 'w') as metadata_file:
            metadata_file.write(metadata_json)

        # Upload metadata to IPFS
        with open(metadata_path, 'rb') as meta_file:
            response = requests.post(IPFS_URL, files={'file': meta_file})
            if response.status_code == 200:
                metadata_hash = response.json()['Hash']
                return jsonify({'metadata_url': f'ipfs://{metadata_hash}'}), 200
            else:
                return jsonify({'error': 'Failed to upload metadata to IPFS'}), 500

    return jsonify({'error': 'Unknown error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)
