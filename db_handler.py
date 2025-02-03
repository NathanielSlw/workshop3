import json

# Charger les données depuis le fichier JSON
def load_db():
    with open('db.json', 'r') as f:
        return json.load(f)

# Sauvegarder les données dans le fichier JSON
def save_db(data):
    with open('db.json', 'w') as f:
        json.dump(data, f, indent=4)

# Mettre à jour la précision et le solde du modèle
def update_model_performance(model_name, accuracy, balance_change):
    db = load_db()
    db[model_name]['accuracy'] = accuracy
    db[model_name]['balance'] += balance_change
    save_db(db)


