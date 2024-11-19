from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
import csv
from tensorflow.keras.models import load_model
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
    "timeOfEndSurgery", "isolate1", "microorganism2", "isolate2", "SSIEvalCheckList",
    "detected", "status", "nuid", "patientId", "secondaryBSIdeath", "antibioticGiven"
]

# Columns requiring specific encoding
categorical_columns = ["gender", "scenarioOfProcedure", "woundClass", "papGiven"]

# Default feature columns
default_columns = [
    "patientName", "age", "gender", "dateOfAdmission",
    "dateOfProcedure", "admittingDepartment",
    "departmentPrimarySurgeon", "procedureDoneBy",
    "procedureName", "diagnosis",
    "otno", "outpatientProcedure", "scenarioOfProcedure",
    "woundClass", "papGiven", "papDuration",
    "ssiEventOccurred", "dateOfSSIEvent", "microorganism1",
    "antibiotics",
    "timeOfInduction", "timeOfSkinIncision", "timeOfEndSurgery",
    "isolate1",
    "microorganism2",
    "isolate2",
    "SSIEvalCheckList",
    "detected", "status", "nuid",
    "patientId", "secondaryBSIdeath", "antibioticGiven",
    "Day 1:Purulent discharge from incision/wound",
    "Day 1: Localized pain and tenderness",
    "Day 1: Localized swelling",
    "Day 1: Fever",
    "Day 1: Incision deliberately opened/drained",
    "Day 1: Spontaneous dehiscence of wound",
    "Day 1: Abscess",
    "Day 1: Micro-organisms seen in Gram's staining of discharge material",
    "Day 1: Imaging evidence  of infection/abscess",
    "Day 1: Positive culture from discharge material",
    "Day 1: Blood culture sent",
    "Day 1: Physician institutes a diagnosis of SSI",
    "Day 1: Any other",
    "Day 2:Purulent discharge from incision/wound"  ,
    "Day 2: Localized pain and tenderness" ,
    "Day 2: Localized swelling" ,
    "Day 2: Fever"  ,
    "Day 2: Incision deliberately opened/drained" ,
    "Day 2: Spontaneous dehiscence of wound",
    "Day 2: Abscess" ,
    "Day 2: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 2: Imaging evidence  of infection/abscess",
    "Day 2: Positive culture from discharge material",
    "Day 2: Blood culture sent" ,
    "Day 2: Physician institutes a diagnosis of SSI" ,
    "Day 2: Any other" ,
    "Day 3:Purulent discharge from incision/wound"  ,
    "Day 3: Localized pain and tenderness"  ,
    "Day 3: Localized swelling"  ,
    "Day 3: Fever"  ,
    "Day 3: Incision deliberately opened/drained" ,
    "Day 3: Spontaneous dehiscence of wound" ,
    "Day 3: Abscess" ,
    "Day 3: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 3: Imaging evidence  of infection/abscess",
    "Day 3: Positive culture from discharge material",
    "Day 3: Blood culture sent" ,
    "Day 3: Physician institutes a diagnosis of SSI" ,
    "Day 3: Any other" ,
    "Day 4:Purulent discharge from incision/wound"  ,
    "Day 4: Localized pain and tenderness"  ,
    "Day 4: Localized swelling"  ,
    "Day 4: Fever"  ,
    "Day 4: Incision deliberately opened/drained" ,
    "Day 4: Spontaneous dehiscence of wound" ,
    "Day 4: Abscess" ,
    "Day 4: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 4: Imaging evidence  of infection/abscess",
    "Day 4: Positive culture from discharge material",
    "Day 4: Blood culture sent" ,
    "Day 4: Physician institutes a diagnosis of SSI" ,
    "Day 4: Any other" ,
    "Day 5:Purulent discharge from incision/wound"  ,
    "Day 5: Localized pain and tenderness"  ,
    "Day 5: Localized swelling"  ,
    "Day 5: Fever"  ,
    "Day 5: Incision deliberately opened/drained" ,
    "Day 5: Spontaneous dehiscence of wound" ,
    "Day 5: Abscess" ,
    "Day 5: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 5: Imaging evidence  of infection/abscess"   ,
    "Day 5: Positive culture from discharge material"   ,
    "Day 5: Blood culture sent" ,
    "Day 5: Physician institutes a diagnosis of SSI" ,
    "Day 5: Any other" ,
    "Day 6:Purulent discharge from incision/wound"  ,
    "Day 6: Localized pain and tenderness"  ,
    "Day 6: Localized swelling"  ,
    "Day 6: Fever"  ,
    "Day 6: Incision deliberately opened/drained" ,
    "Day 6: Spontaneous dehiscence of wound" ,
    "Day 6: Abscess" ,
    "Day 6: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 6: Imaging evidence  of infection/abscess"   ,
    "Day 6: Positive culture from discharge material"   ,
    "Day 6: Blood culture sent" ,
    "Day 6: Physician institutes a diagnosis of SSI" ,
    "Day 6: Any other" ,
    "Day 7:Purulent discharge from incision/wound"  ,
    "Day 7: Localized pain and tenderness"  ,
    "Day 7: Localized swelling"  ,
    "Day 7: Fever"  ,
    "Day 7: Incision deliberately opened/drained" ,
    "Day 7: Spontaneous dehiscence of wound" ,
    "Day 7: Abscess" ,
    "Day 7: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 7: Imaging evidence  of infection/abscess"   ,
    "Day 7: Positive culture from discharge material"   ,
    "Day 7: Blood culture sent" ,
    "Day 7: Physician institutes a diagnosis of SSI" ,
    "Day 7: Any other" ,
    "Day 8:Purulent discharge from incision/wound"  ,
    "Day 8: Localized pain and tenderness"  ,
    "Day 8: Localized swelling"  ,
    "Day 8: Fever"  ,
    "Day 8: Incision deliberately opened/drained" ,
    "Day 8: Spontaneous dehiscence of wound" ,
    "Day 8: Abscess" ,
    "Day 8: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 8: Imaging evidence  of infection/abscess"   ,
    "Day 8: Positive culture from discharge material"   ,
    "Day 8: Blood culture sent" ,
    "Day 8: Physician institutes a diagnosis of SSI" ,
    "Day 8: Any other" ,
    "Day 9:Purulent discharge from incision/wound"  ,
    "Day 9: Localized pain and tenderness"  ,
    "Day 9: Localized swelling"  ,
    "Day 9: Fever"  ,
    "Day 9: Incision deliberately opened/drained" ,
    "Day 9: Spontaneous dehiscence of wound" ,
    "Day 9: Abscess" ,
    "Day 9: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 9: Imaging evidence  of infection/abscess"   ,
    "Day 9: Positive culture from discharge material"   ,
    "Day 9: Blood culture sent" ,
    "Day 9: Physician institutes a diagnosis of SSI" ,
    "Day 9: Any other" ,
    "Day 10:Purulent discharge from incision/wound"  ,
    "Day 10: Localized pain and tenderness"  ,
    "Day 10: Localized swelling"  ,
    "Day 10: Fever"  ,
    "Day 10: Incision deliberately opened/drained" ,
    "Day 10: Spontaneous dehiscence of wound" ,
    "Day 10: Abscess" ,
    "Day 10: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 10: Imaging evidence  of infection/abscess"   ,
    "Day 10: Positive culture from discharge material"   ,
    "Day 10: Blood culture sent" ,
    "Day 10: Physician institutes a diagnosis of SSI" ,
    "Day 10: Any other" ,
    "Day 11:Purulent discharge from incision/wound"  ,
    "Day 11: Localized pain and tenderness"  ,
    "Day 11: Localized swelling"  ,
    "Day 11: Fever"  ,
    "Day 11: Incision deliberately opened/drained" ,
    "Day 11: Spontaneous dehiscence of wound" ,
    "Day 11: Abscess" ,
    "Day 11: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 11: Imaging evidence  of infection/abscess"   ,
    "Day 11: Positive culture from discharge material"   ,
    "Day 11: Blood culture sent" ,
    "Day 11: Physician institutes a diagnosis of SSI" ,
    "Day 11: Any other" , 
    "Day 12:Purulent discharge from incision/wound"  ,
    "Day 12: Localized pain and tenderness"  ,
    "Day 12: Localized swelling"  ,
    "Day 12: Fever"  ,
    "Day 12: Incision deliberately opened/drained" ,
    "Day 12: Spontaneous dehiscence of wound" ,
    "Day 12: Abscess" ,
    "Day 12: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 12: Imaging evidence  of infection/abscess"   ,
    "Day 12: Positive culture from discharge material"   ,
    "Day 12: Blood culture sent" ,
    "Day 12: Physician institutes a diagnosis of SSI" ,
    "Day 12: Any other" ,
    "Day 13:Purulent discharge from incision/wound"  ,
    "Day 13: Localized pain and tenderness"  ,
    "Day 13: Localized swelling"  ,
    "Day 13: Fever"  ,
    "Day 13: Incision deliberately opened/drained" ,
    "Day 13: Spontaneous dehiscence of wound" ,
    "Day 13: Abscess" ,
    "Day 13: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 13: Imaging evidence  of infection/abscess"   ,
    "Day 13: Positive culture from discharge material"   ,
    "Day 13: Blood culture sent" ,
    "Day 13: Physician institutes a diagnosis of SSI" ,
    "Day 13: Any other" ,
    "Day 14:Purulent discharge from incision/wound"  ,
    "Day 14: Localized pain and tenderness"  ,
    "Day 14: Localized swelling"  ,
    "Day 14: Fever"  ,
    "Day 14: Incision deliberately opened/drained" ,
    "Day 14: Spontaneous dehiscence of wound" ,
    "Day 14: Abscess" ,
    "Day 14: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 14: Imaging evidence  of infection/abscess"   ,
    "Day 14: Positive culture from discharge material"   ,
    "Day 14: Blood culture sent" ,
    "Day 14: Physician institutes a diagnosis of SSI" ,
    "Day 14: Any other" ,
    "Day 15:Purulent discharge from incision/wound"  ,
    "Day 15: Localized pain and tenderness"  ,
    "Day 15: Localized swelling"  ,
    "Day 15: Fever"  ,
    "Day 15: Incision deliberately opened/drained" ,
    "Day 15: Spontaneous dehiscence of wound" ,
    "Day 15: Abscess" ,
    "Day 15: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 15: Imaging evidence  of infection/abscess"   ,
    "Day 15: Positive culture from discharge material"   ,
    "Day 15: Blood culture sent" ,
    "Day 15: Physician institutes a diagnosis of SSI" ,
    "Day 15: Any other" , 
    "Day 16-30:Purulent discharge from incision/wound"  ,
    "Day 16-30: Localized pain and tenderness"  ,
    "Day 16-30: Localized swelling"  ,
    "Day 16-30: Fever"  ,
    "Day 16-30: Incision deliberately opened/drained" ,
    "Day 16-30: Spontaneous dehiscence of wound" ,
    "Day 16-30: Abscess" ,
    "Day 16-30: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 16-30: Imaging evidence  of infection/abscess"   ,
    "Day 16-30: Positive culture from discharge material"   ,
    "Day 16-30: Blood culture sent" ,
    "Day 16-30: Physician institutes a diagnosis of SSI" ,
    "Day 16-30: Any other" ,
    "Day 30-60:Purulent discharge from incision/wound"  ,
    "Day 30-60: Localized pain and tenderness"  ,
    "Day 30-60: Localized swelling"  ,
    "Day 30-60: Fever"  ,
    "Day 30-60: Incision deliberately opened/drained" ,
    "Day 30-60: Spontaneous dehiscence of wound" ,
    "Day 30-60: Abscess" ,
    "Day 30-60: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 30-60: Imaging evidence  of infection/abscess"   ,
    "Day 30-60: Positive culture from discharge material"   ,
    "Day 30-60: Blood culture sent" ,
    "Day 30-60: Physician institutes a diagnosis of SSI" ,
    "Day 30-60: Any other" ,
    "Day 60-90:Purulent discharge from incision/wound"  ,
    "Day 60-90: Localized pain and tenderness"  ,
    "Day 60-90: Localized swelling"  ,
    "Day 60-90: Fever"  ,
    "Day 60-90: Incision deliberately opened/drained" ,
    "Day 60-90: Spontaneous dehiscence of wound" ,
    "Day 60-90: Abscess" ,
    "Day 60-90: Micro-organisms seen in Gram's staining of discharge material" ,
    "Day 60-90: Imaging evidence  of infection/abscess"   ,
    "Day 60-90: Positive culture from discharge material"   ,
    "Day 60-90: Blood culture sent" ,
    "Day 60-90: Physician institutes a diagnosis of SSI" ,
    "Day 60-90: Any other" ,
]

@app.route("/")
def home():
    return "Welcome to the Prediction API!"
@app.route("/predict", methods=["POST"])
def predict():
    try:
        form_data = request.form.to_dict(flat=True)
        # print(form_data)
        # # Convert form data to DataFrame
        raw_data = pd.DataFrame([form_data], columns=default_columns)

        # # Drop unnecessary columns
        # raw_data = raw_data.drop(columns=columns_to_drop, errors="ignore")

        # # Handle boolean fields (convert "true"/"false" strings to integers)
        # boolean_fields = ['papGiven', 'outpatientProcedure', 'ssiEventOccurred', 'secondaryBSIdeath']
        # for field in boolean_fields:
        #     if field in raw_data.columns:
        #         raw_data[field] = raw_data[field].map({'true': 1, 'false': 0}).astype(int)

        # # Handle categorical variables using OrdinalEncoder
        # for col in categorical_columns:
        #     if col in raw_data.columns:
        #         raw_data[col] = OrdinalEncoder.transform(raw_data[[col]])

        # # Handle numerical fields (ensure correct data types)
        # numerical_fields = ['age']
        # for field in numerical_fields:
        #     if field in raw_data.columns:
        #         raw_data[field] = pd.to_numeric(raw_data[field], errors='coerce')

        # # Handle 'symptomsDict' if present
        # if 'symptomsDict' in form_data:
        #     import json
        #     symptoms_dict = json.loads(form_data['symptomsDict'])
        #     # Flatten symptoms_dict into DataFrame columns
        #     for symptom, days in symptoms_dict.items():
        #         for day, value in days.items():
        #             column_name = f"{symptom}_{day}"
        #             raw_data[column_name] = int(value)

        #     # Drop the 'symptomsDict' column
        #     raw_data = raw_data.drop(columns=['symptomsDict'], errors='ignore')

        # # Ensure all expected columns are present
        # missing_cols = set(default_columns) - set(raw_data.columns)
        # for col in missing_cols:
        #     raw_data[col] = 0  # You might want to handle missing values differently

        # # Reorder columns to match the model's input
        # raw_data = raw_data[default_columns]

        # # Scale the data
        # scaled_data = scaler.transform(raw_data)

        # # Make prediction
        # prediction_probs = model.predict(scaled_data)
        # predicted_class_idx = np.argmax(prediction_probs, axis=1)[0]
        # predicted_class = class_mapping[predicted_class_idx]

        # # Return prediction result
        # return jsonify({"prediction": predicted_class})

    # except Exception as e:
    #     print("Error during prediction:", e)
    #     return jsonify({"error": str(e)}), 400
        # Parse input data

        # if request.data:  # Check if data is in POST body
        #     input_data = request.data.decode("utf-8").strip()
        # else:  # Fallback to query parameters
        #     input_data = request.args.get("input", "").strip()
        
        # # Split the input into a list of values
        # csv_reader = csv.reader([input_data])
        # values = next(csv_reader)  # Get the parsed row as a list
        
        # # Ensure the correct number of values are provided
        # if len(values) != len(default_columns):
        #     return jsonify({"error": f"Expected {len(default_columns)} values, but got {len(values)}"}), 400
        # print(values)
        # # Create a DataFrame from the input values
        # raw_data = pd.DataFrame([values], columns=default_columns)
        # Preprocessing Steps
        # Step 1: Drop unnecessary columns
        raw_data = raw_data.drop(columns=columns_to_drop, errors="ignore")
        
        # Step 2: Replace "Yes"/"No" with 1/0 in Day-related columns
        day_columns = [col for col in raw_data.columns if col.startswith("Day ")]
        raw_data[day_columns] = raw_data[day_columns].replace({"Yes": 1, "No": 0})
        print(raw_data)
        # Ordinal Encoding for woundClass
        ordinal_encoder = OrdinalEncoder(categories=[["clean", "clean contaminated", "contaminated", "Dirty/infected"]])
        raw_data["woundClass_encoded"] = ordinal_encoder.fit_transform(raw_data[["woundClass"]])

        # Binary Encoding for "papGiven"
#         raw_data["papGiven_encoded"] = raw_data["papGiven"].astype(int)
        raw_data["papGiven_encoded"] = raw_data["papGiven"].apply(lambda x: 1 if x == "TRUE" else 0)

        # Gender Encoding
        raw_data["gender_M"] = raw_data["gender"].apply(lambda x: 1 if x == "M" else 0)
        # Scenario Encoding
        raw_data["scenarioOfProcedure_emergency"] = raw_data["scenarioOfProcedure"].apply(lambda x: 1 if x == "emergency" else 0)
        raw_data = raw_data.drop(columns=categorical_columns)
        print(raw_data)

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
        app.run(debug=True)
        # app.run(debug=True, use_reloader=False, port=5050)
    except SystemExit:
        print("Flask app exited.")