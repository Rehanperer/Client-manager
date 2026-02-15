const STORAGE_KEY = 'client_mgr_data';

export const getClients = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveClient = (client) => {
    const clients = getClients();
    if (client.id) {
        const index = clients.findIndex(c => c.id === client.id);
        clients[index] = client;
    } else {
        client.id = Date.now().toString();
        clients.push(client);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
};

export const deleteClient = (id) => {
    const clients = getClients();
    const filtered = clients.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Initial Mock Data if empty
export const initMockData = () => {
    if (getClients().length === 0) {
        const mockClients = [
            {
                id: '1',
                name: 'TechFlow Systems',
                contact: 'John Smith',
                email: 'john@techflow.com',
                status: 'Development',
                type: 'Project',
                price: 2500,
                recurring: 0,
                domain: 'techflow.io',
                niche: 'SaaS',
                date: '2024-02-10'
            },
            {
                id: '2',
                name: 'Oceanic Resorts',
                contact: 'Sarah Wilson',
                email: 'sarah@oceanic.com',
                status: 'Live',
                type: 'Maintenance',
                price: 1500,
                recurring: 99,
                domain: 'oceanic-resorts.com',
                niche: 'Travel',
                date: '2024-01-15'
            },
            {
                id: '3',
                name: 'Pulse Fitness',
                contact: 'Mike Tyson',
                email: 'mike@pulse.com',
                status: 'Designing',
                type: 'Project',
                price: 3200,
                recurring: 0,
                domain: 'pulsefit.com',
                niche: 'Fitness',
                date: '2024-02-14'
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockClients));
    }
};
