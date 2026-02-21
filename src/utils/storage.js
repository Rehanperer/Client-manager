import { supabase } from './supabase';

const STORAGE_KEY = 'client_mgr_data';

// Fetch clients for the currently logged in user
export const getClients = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching clients:', error);
        // Fallback to localStorage if Supabase fails or isn't setup yet
        const localData = localStorage.getItem(STORAGE_KEY);
        return localData ? JSON.parse(localData) : [];
    }
};

export const saveClient = async (client) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            // If No auth, save to local storage as fallback
            const clients = await getClients();
            if (client.id) {
                const index = clients.findIndex(c => c.id === client.id);
                if (index !== -1) clients[index] = client;
            } else {
                client.id = Date.now().toString();
                clients.push(client);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
            return;
        }

        const clientData = {
            ...client,
            user_id: user.id,
            updated_at: new Date().toISOString()
        };

        let result;
        if (client.id && isNaN(client.id)) { // UUID or existing ID
            result = await supabase
                .from('clients')
                .update(clientData)
                .eq('id', client.id)
                .eq('user_id', user.id);
        } else {
            // New client
            const { id, ...newClientData } = clientData; // Let Supabase handle ID
            result = await supabase
                .from('clients')
                .insert([newClientData]);
        }

        if (result.error) throw result.error;
    } catch (error) {
        console.error('Error saving client:', error);
    }
};

export const deleteClient = async (id) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            const clients = await getClients();
            const filtered = clients.filter(c => c.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            return;
        }

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting client:', error);
    }
};

// Initial Mock Data sync to Supabase if empty (One time)
export const initMockData = async () => {
    const clients = await getClients();
    if (clients.length === 0) {
        // Only run if local Storage has something to sync
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            const mockClients = JSON.parse(localData);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                for (const client of mockClients) {
                    await saveClient(client);
                }
            }
        }
    }
};
