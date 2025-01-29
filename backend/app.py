import joblib
from flask import Flask, request, jsonify
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows all domains, you can specify the origins if necessary

# Load trained model
model = joblib.load("breast_cancer_model.pkl")

@app.route('/')
def home():
    return "Breast Cancer Detection API is running."

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Expecting an array of features in the JSON request body
        data = request.json.get('features')  
        
        # Check if features exist and are in the correct format
        if not data or not isinstance(data, list):
            return jsonify({'error': 'Invalid input. Expecting an array of features.'}), 400
        
        features = np.array(data).reshape(1, -1)  # Reshape for prediction
        prediction = model.predict(features)  # Make prediction

        # Return the prediction as an integer (0 or 1)
        return jsonify({'prediction': int(prediction[0])})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return internal server error for any unexpected issues

if __name__ == '__main__':
    app.run(debug=True)
