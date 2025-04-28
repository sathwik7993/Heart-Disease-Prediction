import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay, RocCurveDisplay

def plot_confusion_matrix(cm):
    disp = ConfusionMatrixDisplay(confusion_matrix=cm)
    disp.plot()
    plt.title("Confusion Matrix")
    plt.show()

def plot_roc_curve(y_true, y_score):
    RocCurveDisplay.from_predictions(y_true, y_score)
    plt.title("ROC Curve")
    plt.show()
