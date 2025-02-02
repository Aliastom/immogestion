// Configuration de l'API
const API_CONFIG = {
  BASE_URL: 'https://api.example.com/v1',
  TIMEOUT: 5000,
};

// Gestionnaire d'erreurs HTTP
async function handleResponse(response) {
  try {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}. description: ${await response.text()}`);
    }
    return await response.json();
  } catch (error) {
    reportError(error);
    throw error;
  }
}

// Fonctions API pour les biens immobiliers
const propertyAPI = {
  async list() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/properties`);
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async get(id) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/properties/${id}`);
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/properties/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  }
};

// Fonctions API pour les locataires
const tenantAPI = {
  async list() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tenants`);
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async get(id) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tenants/${id}`);
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tenants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tenants/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  }
};

// Fonctions API pour les transactions financières
const financeAPI = {
  async listTransactions(period) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/finances/transactions?period=${period}`);
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async createTransaction(data) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/finances/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async getReport(period) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/finances/reports?period=${period}`);
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  }
};

// Fonctions API pour l'assistant IA
const aiAPI = {
  async analyze(data) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async predict(data) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/ai/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  }
};

// Fonctions API pour les documents
const documentAPI = {
  async upload(file, type) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${API_CONFIG.BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async list(type) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/documents?type=${type}`);
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/documents/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    } catch (error) {
      reportError(error);
      throw error;
    }
  }
};

// Export des APIs
const api = {
  property: propertyAPI,
  tenant: tenantAPI,
  finance: financeAPI,
  ai: aiAPI,
  document: documentAPI
};
