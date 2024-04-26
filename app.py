from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from keras.models import load_model
import cv2
import numpy as np
from flask_cors import CORS
from keras.preprocessing import image
from keras.applications.resnet50 import preprocess_input
from keras.applications.resnet50 import preprocess_input
from keras.preprocessing import image
import numpy as np
from keras.models import load_model
import csv


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


model = load_model("best_ResNet50.h5")

unique_labels = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]


def get_full_row(short_name, csv_file):

    with open(csv_file, "r") as file:
        reader = csv.reader(file)
        for row in reader:
            if row[0] == short_name:
                return row
    return None


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["POST"])
def upload_file():
    print(f"Starting")
    if "image" not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No selected file"})

    if file and allowed_file(file.filename):
        filename = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(filename)
        print(f"Image received and saved: {filename}")

    img = cv2.imread(filename)
    img = cv2.resize(img, (128, 128))
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=0)
    predictions = model.predict(img)

    predicted_class_index = np.argmax(predictions[0])
    predicted_class_label = unique_labels[predicted_class_index]
    print(f"Predicted Class: {predicted_class_label}")

    body = {}
    data = {}

    data["class"] = unique_labels[predicted_class_index]

    full_row = get_full_row(predicted_class_label, "types.csv")
    if full_row:
        short_name, full_name, description, symptoms, treatment = full_row
        data["fullName"] = full_name
        data["description"] = description
        data["symptoms"] = symptoms
        data["treatment"] = treatment
    else:
        print(f"Short name '{predicted_class_label}' not found in the CSV file.")

    body["data"] = data
    print(body)
    return buildResponse(body)


def buildResponse(body):
    response = jsonify(body)
    return response


if __name__ == "__main__":
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.debug = True
    app.run(port=5000, threaded=True)
