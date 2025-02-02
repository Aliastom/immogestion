import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async ({ email, password, ...userData }) => {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};

export const signIn = async ({ email, password }) => {
  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
};

// Database helpers
export const getProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    throw error;
  }
};

export const createProperty = async (propertyData) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating property:', error.message);
    throw error;
  }
};

// Storage helpers
export const uploadDocument = async (file, path) => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, file);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading document:', error.message);
    throw error;
  }
};

export const getDocumentUrl = (path) => {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path);
  
  return data.publicUrl;
};
