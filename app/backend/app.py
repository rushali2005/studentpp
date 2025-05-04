from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# File paths for dataset, model, and scaler
DATA_FILE = 'student-mat.csv'
MODEL_FILE = 'student_model.pkl'
SCALER_FILE = 'scaler.pkl'

def load_data():
    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError(f"{DATA_FILE} not found.")
    df = pd.read_csv(DATA_FILE, sep=';')
    if 'G3' not in df.columns:
        raise ValueError("Dataset missing 'G3' column.")
    return df

def train_model():
    df = load_data()

    # Only select the 5 fields you are using
    selected_features = ['studytime', 'absences', 'freetime', 'Walc']
    
    # Since 'sleepHours' isn't in original dataset, we simulate it
    df['sleepHours'] = 8  # Assuming average sleepHours = 8 for training

    X = df[selected_features + ['sleepHours']]
    y = df['G3']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    joblib.dump(model, MODEL_FILE)
    joblib.dump(scaler, SCALER_FILE)

    return model, X.columns

# Load the model and scaler if available
try:
    model = joblib.load(MODEL_FILE)
    scaler = joblib.load(SCALER_FILE)
    model_columns = ['studytime', 'absences', 'freetime', 'Walc', 'sleepHours']
except Exception as e:
    print("Training model due to:", str(e))
    model, model_columns = train_model()

@app.route('/home')
def home():
    return "🎓 Student Performance Predictor API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)

        input_df = pd.DataFrame([data])

        # Match columns exactly
        input_df = input_df.reindex(columns=model_columns, fill_value=0)

        input_scaled = scaler.transform(input_df)

        predicted_grade = model.predict(input_scaled)[0]

        # Determine letter grade based on predicted grade
        if predicted_grade >= 18:
            letter_grade = 'A+'
        elif predicted_grade >= 15:
            letter_grade = 'A'
        elif predicted_grade >= 13:
            letter_grade = 'B+'
        elif predicted_grade >= 11:
            letter_grade = 'B'
        elif predicted_grade >= 9:
            letter_grade = 'C+'
        elif predicted_grade >= 7:
            letter_grade = 'C'
        elif predicted_grade >= 5:
            letter_grade = 'D+'
        elif predicted_grade >= 3:
            letter_grade = 'D'
        else:
            letter_grade = 'F'

        print(f"Predicted grade: {predicted_grade:.2f}, Letter grade: {letter_grade}")

        return jsonify({'predicted_grade': predicted_grade, 'letter_grade': letter_grade})

    except Exception as e:
        print("Prediction error:", str(e))
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)
