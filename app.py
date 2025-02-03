from flask import Flask, request, jsonify
from models import models, scaler
from db_handler import update_model_performance
from sklearn.metrics import accuracy_score
import numpy as np
import pandas as pd

app = Flask(__name__)

iris_data = pd.read_csv('iris.csv')
X = iris_data.drop(columns=['Id', 'Species'])  # Enlever les colonnes non utilisées (par exemple, Id et Species)
y = iris_data['Species']

# Normalisation des données
X_scaled = scaler.fit_transform(X)  

# Diviser les données en test et train 
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Route de prédiction
@app.route('/predict', methods=['GET'])
def predict():
    # Récupérer les arguments de la requête
    try:
        sepal_length = float(request.args.get('sepal_length'))
        sepal_width = float(request.args.get('sepal_width'))
        petal_length = float(request.args.get('petal_length'))
        petal_width = float(request.args.get('petal_width'))
    except TypeError:
        return jsonify({'error': 'Invalid input'}), 400

    # Normaliser les données d'entrée
    input_data = scaler.transform([[sepal_length, sepal_width, petal_length, petal_width]])

    # Prédiction pour chaque modèle
    predictions = {name: model.predict(input_data)[0] for name, model in models.items()}

    # Calculer la précision et mettre à jour la base de données
    for model_name, model in models.items():
        # Prédiction sur le jeu de test
        y_pred = model.predict(X_test)

        # Calcul de la précision sur l'ensemble de test
        accuracy = accuracy_score(y_test, y_pred)

        # Logique de changement de solde (exemple simplifié, ajuste selon tes critères)
        balance_change = 0.1 if accuracy > 0.9 else -0.1

        # Mettre à jour la base de données avec la précision et le changement de solde
        update_model_performance(model_name, accuracy, balance_change)

    return jsonify(predictions)

if __name__ == '__main__':
    app.run(host="0.0.0.0")
