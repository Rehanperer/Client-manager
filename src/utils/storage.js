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
                phone: '0771234567',
                phoneOwner: 'John Smith (Direct)',
                instagram: 'techflow_systems',
                socials: 'linkedin.com/company/techflow',
                status: 'Development',
                type: 'Project',
                price: 750000,
                recurring: 15000,
                domain: 'techflow.io',
                niche: 'SaaS',
                date: '2024-02-10',
                finalDeadline: '2024-06-01',
                expenses: [
                    { id: 'e1', type: 'Hosting', amount: 5000, date: '2024-02-12', note: 'Vercel Pro' },
                    { id: 'e2', type: 'Domain', amount: 3500, date: '2024-02-11', note: 'Namecheap' }
                ],
                timeline: [
                    { id: 't1', stage: 'Discovery', startDate: '2024-02-10', endDate: '2024-02-15', status: 'Completed', notes: 'Requirement gathering' },
                    { id: 't2', stage: 'Design', startDate: '2024-02-16', endDate: '2024-03-01', status: 'In Progress', notes: 'High-fidelity mockups' }
                ]
            },
            {
                id: '2',
                name: 'Oceanic Resorts',
                contact: 'Sarah Wilson',
                email: 'sarah@oceanic.com',
                phone: '0719876543',
                phoneOwner: 'Manager Office',
                instagram: 'oceanic_resorts_lk',
                socials: 'facebook.com/oceaniclk',
                status: 'Live',
                type: 'Maintenance',
                price: 450000,
                recurring: 25000,
                domain: 'oceanic-resorts.com',
                niche: 'Travel',
                date: '2024-01-15',
                finalDeadline: '2024-04-15',
                expenses: [
                    { id: 'e3', type: 'Premium Plugin', amount: 12000, date: '2024-01-16', note: 'WP Rocket' }
                ],
                timeline: [
                    { id: 't3', stage: 'Discovery', startDate: '2024-01-15', endDate: '2024-01-20', status: 'Completed' },
                    { id: 't4', stage: 'Design', startDate: '2024-01-21', endDate: '2024-02-05', status: 'Completed' },
                    { id: 't5', stage: 'Development', startDate: '2024-02-06', endDate: '2024-02-28', status: 'Completed' },
                    { id: 't6', stage: 'Launch', startDate: '2024-03-01', endDate: '2024-03-01', status: 'Completed' }
                ]
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockClients));
    }
};
