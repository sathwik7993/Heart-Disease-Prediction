import tkinter as tk
from tkinter import messagebox
import joblib
import numpy as np

# Load trained artifacts
model  = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')

FEATURE_NAMES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak",
    "slope", "ca", "thal"
]

def predict_patient(features):
    x = np.array(features, dtype=float).reshape(1, -1)
    x_scaled = scaler.transform(x)
    prob = model.predict_proba(x_scaled)[0, 1]
    pred = model.predict(x_scaled)[0]
    return pred, prob

def on_predict():
    try:
        feats = [float(entries[name].get()) for name in FEATURE_NAMES]
    except ValueError:
        messagebox.showerror("Invalid input", "Please enter valid numbers for all fields.")
        return
    pred, prob = predict_patient(feats)
    label = "Heart disease" if pred == 1 else "No heart disease"
    messagebox.showinfo(
        "Result",
        f"Prediction: {label} (class={pred})\nProbability of disease: {prob:.2%}"
    )

# Build GUI
root = tk.Tk()
root.title("Heart Disease Predictor")

entries = {}
for i, name in enumerate(FEATURE_NAMES):
    tk.Label(root, text=name).grid(row=i, column=0, padx=5, pady=2, sticky="e")
    entry = tk.Entry(root)
    entry.grid(row=i, column=1, padx=5, pady=2)
    entries[name] = entry

# Pre-fill example values (optional)
example_values = [63, 1, 1, 145, 233, 1, 2, 150, 0, 2.3, 3, 0, 6]
for name, val in zip(FEATURE_NAMES, example_values):
    entries[name].insert(0, str(val))

# Predict button
btn = tk.Button(root, text="Predict", command=on_predict)
btn.grid(row=len(FEATURE_NAMES), column=0, columnspan=2, pady=10)

root.mainloop()
