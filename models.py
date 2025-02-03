import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Charger le dataset
df = pd.read_csv('iris.csv')

# Séparer les caractéristiques et la cible
X = df.drop(columns=['Id', 'Species'])
y = df['Species']

# Diviser le dataset en ensembles d'entraînement et de test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normaliser les données
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Création des modèles
def knn_model():
    model = KNeighborsClassifier(n_neighbors=3)
    model.fit(X_train, y_train)
    return model

def svm_model():
    model = SVC(kernel='linear')
    model.fit(X_train, y_train)
    return model

def rf_model():
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    return model

def logreg_model():
    model = LogisticRegression(max_iter=200)
    model.fit(X_train, y_train)
    return model

# Évaluer la performance des modèles
def evaluate_model(model):
    y_pred = model.predict(X_test)
    return accuracy_score(y_test, y_pred)

# Créer un dictionnaire avec les modèles et leurs scores
models = {
    'KNN': knn_model(),
    'SVM': svm_model(),
    'RandomForest': rf_model(),
    'LogisticRegression': logreg_model(),
}

