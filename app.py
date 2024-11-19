from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
import csv
from tensorflow.keras.models import load_model # type: ignore
from flask_cors import CORS
from sklearn.preprocessing import OrdinalEncoder,OneHotEncoder

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the saved model and encoders
scaler = joblib.load("scaler.pkl")
model = load_model("ann_model.h5")
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])  # Compile the model

# Define the target class mapping
class_mapping = {0: "DIP", 1: "DIS", 2: "SIP", 3: "SIS", 4: "organ/space"}  # Update with your actual class labels

# Columns to drop during preprocessing
columns_to_drop = [
    "patientName", "dateOfAdmission", "dateOfProcedure", "admittingDepartment",
    "departmentPrimarySurgeon", "procedureDoneBy", "procedureName", "diagnosis",
    "otno", "outpatientProcedure", "papDuration", "ssiEventOccurred", "dateOfSSIEvent",
    "microorganism1", "antibiotics", "timeOfInduction", "timeOfSkinIncision",
    "antibioticGiven",
    "timeOfEndSurgery", "isolate1", "microorganism2", "isolate2", "SSIEvalCheckList",
    "detected", "status", "nuid", "patientId", "secondaryBSIdeath", "antibioticPrescriptions","organSpace","reviewedAt","reviewedBy","specificEvent"
]

# Columns requiring specific encoding
categorical_columns = ["gender", "scenarioOfProcedure", "woundClass", "papGiven"]

@app.route("/")
def home():
    return "Welcome to the Prediction API!"

@app.route("/predict", methods=["POST"])
def predict():
    # Define a custom sorting key for days, so '16-30' comes after '15' and before '31-60'
    def sort_key(day):
        day = int(day)
        print(day)
        if isinstance(day, int):
            return day
        else:
            # For ranges like '16-30', '31-60', we use a special sorting mechanism
            range_start, range_end = map(int, day.split('-'))
            return range_start + 0.5  # Make sure range days are placed after the last integer day

    def convert_data_to_format(symptomsDict):
        import json
    
        # Parse the string if it's not already a dictionary
        if isinstance(symptomsDict, str):
            symptomsDict = json.loads(symptomsDict)
        elif isinstance(symptomsDict, pd.Series):
            # If it's a pandas Series, get the first item and parse it
            symptomsDict = json.loads(symptomsDict.iloc[0])
        
        result = {}
        # day_keys = sorted(symptomsDict["abscess"].keys(), key=sort_key)
        
        day_keys = symptomsDict["abscess"].keys()
        i = 0
        for day in day_keys:
            # day = int(day)
            for symptom_key, day_values in symptomsDict.items():
                day_str = f"Day {day}"
                # Convert JavaScript 'true'/'false' strings to Python boolean string format
                status_str = "Yes" if (list(day_values.values())[i])=='True' else "No"
                result[f"{day_str}: {symptom_key.replace('_', ' ')}"] = status_str
            i+=1
            result[f"Day {day}: Any other"] = "No"
        
        return result

    try:
        form_data = request.form.to_dict()

        raw_data = pd.DataFrame([form_data])
        raw_data.to_csv('new2.csv')
        print("AAA")
        # Step 1: Drop unnecessary columns
        raw_data = raw_data.drop(columns=columns_to_drop, errors="ignore")
        print("BBB")

        # Get the formatted data
        formatted_data = convert_data_to_format(raw_data["symptomsDict"])

        for key, value in formatted_data.items():
            raw_data[key] = value
        raw_data = raw_data.drop(columns=["symptomsDict"], errors="ignore")
        # Step 2: Replace "Yes"/"No" with 1/0 in Day-related columns
        day_columns = [col for col in raw_data.columns if col.startswith("Day ")]
        print(raw_data[day_columns])
        raw_data[day_columns] = raw_data[day_columns].replace({"Yes": 1, "No": 0})
        raw_data.to_csv('output.csv',index=False)
        # print(raw_data)
        # Ordinal Encoding for woundClass
        ordinal_encoder = OrdinalEncoder(categories=[["Clean", "Clean Contaminated", "Contaminated", "Dirty/Infected"]])
        print("HHHh")
        raw_data["woundClass_encoded"] = ordinal_encoder.fit_transform(raw_data[['woundClass']])
        print("r4gtrsdf")
        # Binary Encoding for "papGiven"
        raw_data["papGiven_encoded"] = raw_data["papGiven"].apply(lambda x: 1 if x == "TRUE" else 0)

        # Gender Encoding
        raw_data["gender_M"] = raw_data["gender"].apply(lambda x: 1 if x == "M" else 0)
        # Scenario Encoding
        raw_data["scenarioOfProcedure_emergency"] = raw_data["scenarioOfProcedure"].apply(lambda x: 1 if x == "emergency" else 0)
        raw_data = raw_data.drop(columns=categorical_columns)
        print(raw_data)
        raw_data.to_csv('output3.csv',index=False)

        print("BBBB")
        # Step 4: Scale features
        # Assuming scaler is loaded elsewhere in your code
        scaled_features = scaler.transform(raw_data)
        print("AAAA")
        print(scaled_features)
        
        # Prediction
        probabilities = model.predict(scaled_features)
        #print(probabilities)
        predicted_class = probabilities.argmax(axis=1)[0]
        predicted_class_name = class_mapping[predicted_class]

        # Output the result
        print("Probabilities:", probabilities.tolist()[0])
        print("Predicted Class:", predicted_class_name)

        predicted_class = probabilities.argmax(axis=1)[0]
        predicted_class_name = class_mapping[predicted_class]
        # Return the response
        # return jsonify({"message": "Prediction logic goes here."})
        return jsonify({"message": predicted_class_name})

    except Exception as e:
        return jsonify({"errorasadsfrt": str(e)}), 400

if __name__ == "__main__":
    try:
        app.run(debug=False)
        # app.run(debug=True, use_reloader=False, port=5050)
    except SystemExit:
        print("Flask app exited.")