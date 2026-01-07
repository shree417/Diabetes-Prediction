import './style.css'

const API_URL = 'http://127.0.0.1:5000/predict';

const form = document.getElementById('predictionForm');
const loader = document.getElementById('loader');
const error = document.getElementById('error');
const results = document.getElementById('results');
const resultCard = document.querySelector('.result-card');
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const probabilityLabel = document.getElementById('probabilityLabel');
const progressFill = document.getElementById('progressFill');
const probabilityValue = document.getElementById('probabilityValue');
const tipsCard = document.getElementById('tipsCard');
const tipsList = document.getElementById('tipsList');

const tipsData = {
  high: [
    'Avoid sugary and processed foods immediately',
    'Exercise at least 30 minutes every day',
    'Significantly reduce carbohydrates and junk food intake',
    'Schedule regular doctor check-ups and monitoring',
    'Monitor blood glucose levels daily',
    'Consider consulting with a diabetes specialist',
    'Maintain a strict diet plan with professional guidance'
  ],
  medium: [
    'Maintain a healthy weight through balanced diet',
    'Take a 15-20 minute walk after each meal',
    'Reduce or eliminate sugary drinks from your diet',
    'Increase intake of vegetables and high-fiber foods',
    'Get regular health screenings every 6 months',
    'Practice portion control during meals',
    'Stay hydrated with water throughout the day'
  ],
  low: [
    'Continue your healthy lifestyle habits',
    'Stay physically active with regular exercise',
    'Keep up with annual health check-ups',
    'Maintain a balanced diet rich in nutrients',
    'Monitor your health parameters periodically',
    'Stay informed about diabetes prevention'
  ]
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  hideElements();
  loader.classList.remove('hidden');

  const formData = new FormData(form);
  const data = {
    Pregnancies: parseFloat(formData.get('pregnancies')),
    Glucose: parseFloat(formData.get('glucose')),
    BloodPressure: parseFloat(formData.get('bloodPressure')),
    SkinThickness: parseFloat(formData.get('skinThickness')),
    Insulin: parseFloat(formData.get('insulin')),
    BMI: parseFloat(formData.get('bmi')),
    DiabetesPedigreeFunction: parseFloat(formData.get('diabetesPedigree')),
    Age: parseFloat(formData.get('age'))
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    displayResults(result);
  } catch (err) {
    showError(`Failed to connect to the prediction service. Please ensure the backend server is running at ${API_URL}. Error: ${err.message}`);
  } finally {
    loader.classList.add('hidden');
  }
});

function hideElements() {
  error.classList.add('hidden');
  results.classList.add('hidden');
  resultCard.classList.remove('positive', 'negative');
  tipsCard.classList.remove('high-risk', 'medium-risk', 'low-risk');
  progressFill.classList.remove('high-risk', 'medium-risk', 'low-risk');
}

function showError(message) {
  error.textContent = message;
  error.classList.remove('hidden');
}

function displayResults(result) {
  const { prediction, probability } = result;
  const percentage = probability.toFixed(2);

  if (prediction === 1) {
    resultCard.classList.add('positive');
    resultIcon.textContent = '⚠️';
    resultTitle.textContent = 'Yes, you have diabetes.';
    probabilityLabel.textContent = 'Risk Percentage:';
  } else {
    resultCard.classList.add('negative');
    resultIcon.textContent = '✅';
    resultTitle.textContent = 'You do NOT have diabetes.';
    probabilityLabel.textContent = 'Chance of getting diabetes:';
  }

  progressFill.style.width = percentage + '%';
  probabilityValue.textContent = percentage + '%';

  let riskLevel;
  if (percentage >= 60) {
    riskLevel = 'high';
    progressFill.classList.add('high-risk');
    tipsCard.classList.add('high-risk');
  } else if (percentage >= 30) {
    riskLevel = 'medium';
    progressFill.classList.add('medium-risk');
    tipsCard.classList.add('medium-risk');
  } else {
    riskLevel = 'low';
    progressFill.classList.add('low-risk');
    tipsCard.classList.add('low-risk');
  }

  displayTips(riskLevel);
  results.classList.remove('hidden');

  results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayTips(riskLevel) {
  const tips = tipsData[riskLevel];
  tipsList.innerHTML = '';

  tips.forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });
}
