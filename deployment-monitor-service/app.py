from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)

# Lightweight mock model for demonstration
# In a real scenario, this would be loaded from a .pkl file
class MockModel:
    def predict_proba(self, X):
        # Rule-based simulation matching the requested logic
        results = []
        for _, row in X.iterrows():
            # High CPU + high restart count = risky
            # High latency = unhealthy
            risk_score = 0
            if row['cpu_usage'] > 80:
                risk_score += 30
            if row['restart_count'] > 2:
                risk_score += 40
            if row['response_time_ms'] > 500:
                risk_score += 20
            if row['failed_requests'] > 5:
                risk_score += 10
            
            # Confidence is inversely proportional to risk + some base
            confidence = max(0, 100 - risk_score)
            results.append([risk_score / 100.0, confidence / 100.0])
        return results

model = MockModel()

@app.route('/analyze', methods=['POST'])
def analyze_deployment():
    data = request.json
    
    # Extract features
    features = pd.DataFrame([{
        'cpu_usage': data.get('cpu_usage', 0),
        'memory_usage': data.get('memory_usage', 0),
        'restart_count': data.get('restart_count', 0),
        'response_time_ms': data.get('response_time_ms', 0),
        'failed_requests': data.get('failed_requests', 0)
    }])
    
    # Predict
    proba = model.predict_proba(features)[0]
    risk_score = int(proba[0] * 100)
    confidence_score = int(proba[1] * 100)
    
    # Decision logic
    status = "Healthy"
    action = "Continue Deployment"
    
    if risk_score > 70 or data.get('restart_count', 0) > 3:
        status = "Unhealthy"
        action = "Rollback Recommended"
    elif risk_score > 40:
        status = "Warning"
        action = "Monitor Closely"
        
    return jsonify({
        "deployment_status": status,
        "risk_score": risk_score,
        "confidence_score": confidence_score,
        "recommended_action": action
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
