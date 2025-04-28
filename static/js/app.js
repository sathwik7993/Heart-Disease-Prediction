document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('predict-form');
    const resultSection = document.getElementById('result');
    const resultContent = document.querySelector('.result-content');
    const closeResult = document.getElementById('close-result');
    const infoModal = document.getElementById('info-modal');
    const closeModal = document.getElementById('close-modal');
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');
    const loadExampleBtn = document.getElementById('load-example');
    
    // Feature descriptions for validation and tooltips
    const featureRanges = {
      age: { min: 1, max: 120 },
      sex: { values: [0, 1] },
      cp: { values: [0, 1, 2, 3] },
      trestbps: { min: 80, max: 250 },
      chol: { min: 100, max: 600 },
      fbs: { values: [0, 1] },
      restecg: { values: [0, 1, 2] },
      thalach: { min: 60, max: 220 },
      exang: { values: [0, 1] },
      oldpeak: { min: 0, max: 10 },
      slope: { values: [0, 1, 2] },
      ca: { values: [0, 1, 2, 3, 4] },
      thal: { values: [1, 2, 3] }
    };

    // Example data for "Load Example Data" button
    const exampleData = {
      age: 63,
      sex: 1,
      cp: 3,
      trestbps: 145,
      chol: 233,
      fbs: 1,
      restecg: 0,
      thalach: 150,
      exang: 0,
      oldpeak: 2.3,
      slope: 0,
      ca: 0,
      thal: 1
    };
  
    // Form submission handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form inputs before submission
      if (!validateForm()) {
        showError('Please check your inputs and try again.');
        return;
      }
      
      // Show loading state
      setLoadingState(true);
      
      // Collect form data
      const formData = {};
      document.querySelectorAll('#predict-form input, #predict-form select').forEach(input => {
        formData[input.name] = input.value;
      });
      
      try {
        // Send prediction request
        const response = await fetch('/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        // Handle response
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Server error');
        }
        
        const data = await response.json();
        displayResult(data);
      } catch (error) {
        showError(error.message || 'An unexpected error occurred. Please try again.');
      } finally {
        setLoadingState(false);
      }
    });
    
    // Form validation
    function validateForm() {
      let isValid = true;
      
      document.querySelectorAll('#predict-form input, #predict-form select').forEach(input => {
        const name = input.name;
        const value = input.value.trim();
        
        // Check if field is empty
        if (!value) {
          markInvalid(input, 'This field is required');
          isValid = false;
          return;
        }
        
        // Check if input is within valid range
        if (featureRanges[name]) {
          const range = featureRanges[name];
          
          // For numerical inputs with min/max
          if (range.min !== undefined && range.max !== undefined) {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < range.min || numValue > range.max) {
              markInvalid(input, `Value must be between ${range.min} and ${range.max}`);
              isValid = false;
              return;
            }
          }
          
          // For categorical inputs with specific values
          if (range.values && !range.values.includes(parseFloat(value))) {
            markInvalid(input, `Invalid value`);
            isValid = false;
            return;
          }
        }
        
        // Clear invalid state if valid
        input.classList.remove('invalid');
      });
      
      return isValid;
    }
    
    // Mark invalid input
    function markInvalid(input, message) {
      input.classList.add('invalid');
      
      // Show tooltip with error message
      const tooltipElement = input.parentElement.querySelector('.tooltip');
      if (tooltipElement) {
        tooltipElement.textContent = message;
      }
    }
    
    // Display prediction result
    function displayResult(data) {
      const { prediction, probability } = data;
      const probabilityPercent = (probability * 100).toFixed(1);
      const isPositive = prediction === 1;
      
      // Determine risk level based on probability
      let riskLevel, riskClass;
      if (probability < 0.3) {
        riskLevel = 'Low Risk';
        riskClass = 'low-risk';
      } else if (probability < 0.7) {
        riskLevel = 'Medium Risk';
        riskClass = 'medium-risk';
      } else {
        riskLevel = 'High Risk';
        riskClass = 'high-risk';
      }
      
      // Generate result HTML
      resultContent.innerHTML = `
        <div class="${riskClass}">
          <span class="risk-badge">${riskLevel}</span>
          <h3 class="result-value">${isPositive ? 'Heart Disease Detected' : 'No Heart Disease Detected'}</h3>
          
          <div class="probability-container">
            <p>Probability of Heart Disease</p>
            <div class="probability-bar">
              <div class="probability-fill" style="width: 0%"></div>
            </div>
            <p><strong>${probabilityPercent}%</strong></p>
          </div>
          
          <p class="info-text">
            ${isPositive ? 
              'Based on the provided parameters, our model predicts a significant likelihood of heart disease.' : 
              'Based on the provided parameters, our model predicts a lower likelihood of heart disease.'}
          </p>
          
          <div class="result-actions">
            <button id="learn-more" class="learn-more-btn">Learn more about this prediction</button>
            <button id="download-report" class="download-btn">
              <i class="fas fa-download"></i> Download Report
            </button>
          </div>
        </div>
      `;
      
      // Show result section
      resultSection.classList.remove('hidden');
      
      // Animate the probability bar
      setTimeout(() => {
        const probabilityFill = document.querySelector('.probability-fill');
        probabilityFill.style.width = `${probabilityPercent}%`;
      }, 100);
      
      // Scroll to result
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Add learn more button handler
      document.getElementById('learn-more').addEventListener('click', () => {
        infoModal.classList.remove('hidden');
        infoModal.classList.add('show');
      });

      // Add download report button handler
      document.getElementById('download-report').addEventListener('click', () => {
        generatePDF(data);
      });
    }
    
    // Generate and download PDF report
    function generatePDF(data) {
      // Get form data for report
      const formData = {};
      document.querySelectorAll('#predict-form input, #predict-form select').forEach(input => {
        formData[input.name] = input.value;
      });

      // Format the data for PDF
      const reportData = {
        prediction: data.prediction,
        probability: data.probability,
        parameters: formData,
        timestamp: new Date().toLocaleString()
      };

      // Send request to generate PDF
      fetch('/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      })
      .then(response => response.blob())
      .then(blob => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `heart-disease-prediction-${new Date().getTime()}.pdf`;
        
        // Append to the document and trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error generating report:', error);
        alert('Could not generate report. Please try again.');
      });
    }
    
    // Show error message
    function showError(message) {
      resultContent.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle" style="color: var(--danger); font-size: 2rem;"></i>
          <p style="color: var(--danger); margin-top: 10px;">${message}</p>
        </div>
      `;
      resultSection.classList.remove('hidden');
    }
    
    // Set loading state
    function setLoadingState(isLoading) {
      if (isLoading) {
        spinner.classList.remove('hidden');
        btnText.textContent = 'Processing...';
      } else {
        spinner.classList.add('hidden');
        btnText.textContent = 'Predict Risk';
      }
      
      // Disable/enable form inputs
      const formElements = form.querySelectorAll('input, select, button');
      formElements.forEach(el => {
        el.disabled = isLoading;
      });
    }
    
    // Load example data
    function loadExampleData() {
      Object.keys(exampleData).forEach(field => {
        const input = document.getElementById(field);
        if (input) {
          input.value = exampleData[field];
        }
      });
    }
    
    // Event listeners for UI interactions
    
    // Load example data button
    if (loadExampleBtn) {
      loadExampleBtn.addEventListener('click', loadExampleData);
    }
    
    // Close result
    if (closeResult) {
      closeResult.addEventListener('click', () => {
        resultSection.classList.add('hidden');
      });
    }
    
    // Close modal
    if (closeModal) {
      closeModal.addEventListener('click', () => {
        infoModal.classList.remove('show');
        setTimeout(() => {
          infoModal.classList.add('hidden');
        }, 300);
      });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === infoModal) {
        infoModal.classList.remove('show');
        setTimeout(() => {
          infoModal.classList.add('hidden');
        }, 300);
      }
    });
    
    // Add input validation on blur
    document.querySelectorAll('#predict-form input, #predict-form select').forEach(input => {
      input.addEventListener('blur', () => {
        // Clear invalid state when user starts typing again
        input.addEventListener('input', () => {
          input.classList.remove('invalid');
        }, { once: true });
        
        // Validate single input
        if (input.value.trim() === '') {
          markInvalid(input, 'This field is required');
        }
      });
    });
    
    // Reset form handler - clear the result section too
    form.addEventListener('reset', () => {
      resultSection.classList.add('hidden');
    });

    // Key shortcut for quick form submission (Ctrl+Enter)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!form.classList.contains('processing')) {
          form.dispatchEvent(new Event('submit'));
        }
      }
    });

    // Save partial form data to localStorage
    function saveFormData() {
      const savedData = {};
      document.querySelectorAll('#predict-form input, #predict-form select').forEach(input => {
        if (input.value) {
          savedData[input.name] = input.value;
        }
      });
      
      localStorage.setItem('heartDiseaseFormData', JSON.stringify(savedData));
    }

    // Load data from localStorage if available
    function loadSavedFormData() {
      const savedData = localStorage.getItem('heartDiseaseFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          Object.keys(parsedData).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
              input.value = parsedData[field];
            }
          });
        } catch (e) {
          console.error('Error loading saved form data:', e);
        }
      }
    }

    // Save form data when inputs change
    document.querySelectorAll('#predict-form input, #predict-form select').forEach(input => {
      input.addEventListener('change', saveFormData);
    });

    // Load saved form data on initial load
    loadSavedFormData();
});