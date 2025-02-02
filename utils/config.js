// Configuration de l'application
const config = {
  // Firebase config
  firebase: {
    apiKey: "AIzaSyCHo9wZCojTSuomCjsqT7x84UpCmhXd26I",
    authDomain: "gestionimmo-8242b.firebaseapp.com",
    projectId: "gestionimmo-8242b",
    storageBucket: "gestionimmo-8242b.firebasestorage.app",
    messagingSenderId: "84368712006",
    appId: "1:84368712006:web:94f28baba6cbfa67764547",
    measurementId: "G-1TSHS81LPD"
  },
  
  // API endpoints
  api: {
    baseUrl: 'https://api.immogestion.com',
    version: 'v1'
  }
};

// Validate Firebase config
const validateFirebaseConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(
    field => !config.firebase[field]
  );

  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration fields:', missingFields);
    throw new Error('Configuration Firebase incomplète');
  }

  if (!config.firebase.apiKey.startsWith('AIza')) {
    console.error('Invalid Firebase API key format');
    throw new Error('Clé API Firebase invalide');
  }
};

try {
  validateFirebaseConfig();
  // Export the config
  window.appConfig = config;
} catch (error) {
  console.error('Firebase configuration error:', error);
  // Show error in UI
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1a202c;
          color: white;
          padding: 20px;
          text-align: center;
        ">
          <div>
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">
              Erreur de configuration
            </h1>
            <p style="color: #e53e3e;">
              ${error.message}
            </p>
            <p style="color: #718096; margin-top: 8px;">
              Veuillez vérifier la configuration Firebase dans le fichier config.js
            </p>
          </div>
        </div>
      `;
    }
  });
}
