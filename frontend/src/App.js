import './App.css';  // Importing the CSS file
import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function App() {
  const [features, setFeatures] = useState({
    radius_mean: "",
    texture_mean: "",
    perimeter_mean: "",
    area_mean: "",
    smoothness_mean: "",
    compactness_mean: "",
    concavity_mean: "",
    concave_points_mean: "",
    symmetry_mean: "",
    fractal_dimension_mean: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeatures((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePredict = async () => {
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("https://breastcancerdetection-uceg.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: Object.values(features).map((value) => parseFloat(value)),
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPrediction(data.prediction);
      }
    } catch (err) {
      setError("Failed to fetch prediction.");
    }
  };

  const chartData = {
    labels: ["Benign (0)", "Malignant (1)"],
    datasets: [
      {
        data: [prediction === 0 ? 100 : 0, prediction === 1 ? 100 : 0],
        backgroundColor: ["#28a745", "#dc3545"],
      },
    ],
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "app-container dark-mode" : "app-container"}>
      <header className="header">
        <div className="navbar">
          <h1>Breast Cancer Prediction</h1>
          <button className="dark-mode-btn" onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <div className="input-fields">
        {Object.keys(features).map((feature) => (
          <div key={feature} className="input-group">
            <label htmlFor={feature}>{feature.replace("_", " ").toUpperCase()}:</label>
            <input
              type="number"
              name={feature}
              value={features[feature]}
              onChange={handleChange}
              placeholder={`Enter ${feature.replace("_", " ")}`}
            />
          </div>
        ))}
      </div>

      <button className="predict-btn" onClick={handlePredict}>
        Predict
      </button>

      {prediction !== null && (
        <>
          <h2>Prediction: {prediction === 1 ? "Malignant (1)" : "Benign (0)"}</h2>
          <Pie data={chartData} />
          <p className="prediction-info">
            <strong>1 means Malignant (Cancerous)</strong> and <strong>0 means Benign (Non-cancerous)</strong>.
          </p>
        </>
      )}

      {error && <p className="error-message">{error}</p>}

      {/* Example Input Block */}
      <div className="example-inputs">
        <h3>Example Inputs:</h3>
        <div className="example-card-container">
          <div className="example-card">
            <h4>Benign (0) Prediction</h4>
            <p><strong>Input:</strong> 10.31, 14.29, 65.83, 350.56, 0.0892, 0.0601, 0.0303, 0.0489, 0.1652, 0.04172</p>
            <p><strong>Prediction:</strong> Benign (0) - Non-cancerous</p>
          </div>
          <div className="example-card">
            <h4>Malignant (1) Prediction</h4>
            <p><strong>Input:</strong> 20.57, 17.77, 132.9, 1326, 0.08474, 0.07864, 0.0869, 0.07017, 0.1812, 0.05667</p>
            <p><strong>Prediction:</strong> Malignant (1) - Cancerous</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
