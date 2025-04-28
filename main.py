import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score
import joblib
from utils import plot_confusion_matrix, plot_roc_curve

# 1. Load & clean
df = pd.read_csv('data.csv', na_values='?')
df = df.dropna()  # or df.fillna(...)

# 2. Split features/target
X = df.drop('target', axis=1)
y = (df['target'] > 0).astype(int)  # binarize: 0 = no disease, 1 = disease

# 3. Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)

# 5. Train
model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

# 6. Evaluate
y_pred = model.predict(X_test_scaled)
y_prob = model.predict_proba(X_test_scaled)[:,1]

print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(f"ROC AUC:   {roc_auc_score(y_test, y_prob):.3f}")
cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:\n", cm)

# 7. Plots
plot_confusion_matrix(cm)
plot_roc_curve(y_test, y_prob)

# 8. Save
joblib.dump(model, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')
print("Saved → model.pkl, scaler.pkl")
