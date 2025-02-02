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
      const { data, error } = await window.supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async get(id) {
    try {
      const { data, error } = await window.supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const { data: newProperty, error } = await window.supabase
        .from('properties')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return newProperty;
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const { data: updatedProperty, error } = await window.supabase
        .from('properties')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedProperty;
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { error } = await window.supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      reportError(error);
      throw error;
    }
  }
};

// Export des APIs
window.api = {
  property: propertyAPI
};
