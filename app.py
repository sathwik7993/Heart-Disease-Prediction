from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model & scaler once at startup
model  = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')

FEATURE_NAMES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak",
    "slope", "ca", "thal"
]

@app.route('/')
def home():
    return render_template('index.html', features=FEATURE_NAMES)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        feats = [float(data[name]) for name in FEATURE_NAMES]
    except (ValueError, KeyError):
        return jsonify({'error': 'Invalid input'}), 400

    x = np.array(feats).reshape(1, -1)
    x_scaled = scaler.transform(x)
    prob = model.predict_proba(x_scaled)[0,1]
    pred = int(model.predict(x_scaled)[0])
    return jsonify({
        'prediction': pred,
        'probability': round(prob, 4)
    })

if __name__ == '__main__':
    app.run(debug=True)
