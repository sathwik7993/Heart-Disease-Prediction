# ❤️ Heart Disease Prediction Web App

## 📚 Project Overview
This project builds an interactive web application that predicts the presence of heart disease in patients based on medical parameters.  
It uses Machine Learning (Logistic Regression) for prediction and a Flask backend combined with HTML, CSS, and JavaScript for a user-friendly frontend.

Users can input 13 important medical features through a simple web form and get instant results about their heart health.

---

## 🛠️ Technologies Used

| Area              | Technology                       |
|-------------------|----------------------------------|
| Machine Learning  | Logistic Regression (scikit-learn) |
| Backend           | Flask (Python)                   |
| Frontend          | HTML5, CSS3, JavaScript (Vanilla) |
| Data Handling     | Pandas, NumPy                    |
| Model Saving      | Joblib                            |
| Hosting (Optional)| Heroku / Render / Vercel         |

---

## 📦 Project Structure

```
heart_disease_lr/
├── data.csv                # Dataset
├── model.pkl                # Trained Logistic Regression Model
├── scaler.pkl               # Fitted Standard Scaler
├── main.py                  # Training Script
├── utils.py                 # Utility Functions
├── app.py                   # Flask Server (Web App Backend)
├── requirements.txt         # Python Dependencies
├── templates/
│   └── index.html           # Frontend HTML (Web Form)
└── static/
    ├── css/
    │   └── style.css        # Frontend Styling
    └── js/
        └── app.js           # Frontend Interaction (JS)
```

---

## 📝 Features

- 🔍 Predicts heart disease probability from 13 patient metrics.
- 🖥️ Easy-to-use browser interface.
- ⚡ Fast predictions powered by trained ML model.
- 🌐 Interactive form without page reload (AJAX).
- 🎨 Clean and responsive frontend UI.
- 🛡️ Validates user inputs.

---

## ⚙️ How to Setup & Run Locally

1. **Clone the repository**
```bash
git clone https://github.com/your-username/heart-disease-prediction.git
cd heart-disease-prediction
```

2. **Install the required Python packages**
```bash
pip install -r requirements.txt
```
> Make sure Python 3.8+ is installed on your system.

3. **Train the Model (if needed)**  
If you want to retrain the model:
```bash
python main.py
```
This will generate `model.pkl` and `scaler.pkl`.  
(Already provided if cloning repository)

4. **Start the Flask server**
```bash
python app.py
```
By default, the app runs at:
> 🔗 http://127.0.0.1:5000/

5. **Open the Web App**  
Visit [http://127.0.0.1:5000/](http://127.0.0.1:5000/) in your browser.  
Fill in the medical features and click "Predict" to get the result.

---

## 📊 Dataset Details

- **Dataset:** `data.csv`
- **Features Used:**  
  `age`, `sex`, `cp`, `trestbps`, `chol`, `fbs`, `restecg`, `thalach`, `exang`, `oldpeak`, `slope`, `ca`, `thal`
- **Target:**  
  - 1 → Heart Disease Present  
  - 0 → No Heart Disease

---

## 🚀 Future Enhancements

- Deploy to cloud (Render, Vercel, AWS)
- Add data visualization charts
- Improve model performance (try Random Forest, XGBoost)
- Add login/signup system for doctors/patients
- Build mobile app frontend (Flutter)

---

## ✨ Author

Developed with ❤️ by **[Sathwik.CH]**  
Connect on [www.linkedin.com/in/sathwik-chappala-4696052b1](#) | [https://github.com/sathwik7993](#)

---

## 📌 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute!

---

## 🌟 Summary

An end-to-end Machine Learning + Web Development project to predict heart disease risk with a beautiful interactive UI.
