
// Mock API service - replace with actual backend endpoints
const API_BASE_URL = '/api';

// Simulated delay for demo purposes
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authAPI = {
  login: async (phone: string, password: string) =>
  {
    await delay(1000);

    // Mock authentication logic
    const mockUsers = [
      { id: '1', phone: '03214884763', password: 'Test@123', name: 'Admin User', role: 'admin' as const },
      { id: '2', phone: '03007654321', password: 'dist123', name: 'Ahmed Khan', role: 'distributor' as const, businessName: 'Khan Trading' },
      { id: '3', phone: '03009876543', password: 'dist456', name: 'Muhammad Ali', role: 'distributor' as const, businessName: 'Ali Enterprises' },
    ];

    const user = mockUsers.find(u => u.phone === phone && u.password === password);

    if (user)
    {
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }

    throw new Error('Invalid phone number or password');
  },
};

// Products API
export const productsAPI = {
  getAll: async () =>
  {
    await delay(500);
    return [
      {
        id: '1',
        name: 'Diamond Polishing Pad 4 inch',
        description: 'High quality diamond pad for marble polishing',
        price: 1250,
        category: 'Polishing Pads',
        imageUrl: '/placeholder.svg?height=200&width=200',
        stock: 50,
        unit: 'piece'
      },
      {
        id: '2',
        name: 'Diamond Polishing Pad 5 inch',
        description: 'Professional grade diamond pad for floor polishing',
        price: 1450,
        category: 'Polishing Pads',
        imageUrl: '/placeholder.svg?height=200&width=200',
        stock: 35,
        unit: 'piece'
      },
      {
        id: '3',
        name: 'Marble Polishing Compound',
        description: 'Premium polishing compound for marble surfaces',
        price: 850,
        category: 'Compounds',
        imageUrl: '/placeholder.svg?height=200&width=200',
        stock: 20,
        unit: 'kg'
      },
    ];
  },

  create: async (product: any) =>
  {
    await delay(500);
    return { ...product, id: Date.now().toString() };
  },

  update: async (id: string, product: any) =>
  {
    await delay(500);
    return { ...product, id };
  },

  delete: async (id: string) =>
  {
    await delay(500);
    return { success: true };
  },
};

// Distributors API
export const distributorsAPI = {
  getAll: async () =>
  {
    await delay(500);
    return [
      {
        id: '2',
        phone: '03007654321',
        name: 'Ahmed Khan',
        businessName: 'Khan Trading',
        address: 'Shop 15, Main Market, Lahore',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '3',
        phone: '03009876543',
        name: 'Muhammad Ali',
        businessName: 'Ali Enterprises',
        address: 'Plaza 22, Commercial Area, Karachi',
        isActive: true,
        createdAt: '2024-02-10T14:30:00Z'
      },
    ];
  },

  create: async (distributor: any) =>
  {
    await delay(500);
    return { ...distributor, id: Date.now().toString(), createdAt: new Date().toISOString() };
  },

  update: async (id: string, distributor: any) =>
  {
    await delay(500);
    return { ...distributor, id };
  },

  delete: async (id: string) =>
  {
    await delay(500);
    return { success: true };
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () =>
  {
    await delay(500);
    return [
      {
        id: '1',
        distributorId: '2',
        distributorName: 'Ahmed Khan',
        items: [
          { productId: '1', productName: 'Diamond Polishing Pad 4 inch', quantity: 10, price: 1250, unit: 'piece' },
          { productId: '3', productName: 'Marble Polishing Compound', quantity: 5, price: 850, unit: 'kg' }
        ],
        total: 16750,
        deliveryType: 'delivery', // <- new
        status: 'pending' as const,
        createdAt: '2024-06-14T08:30:00Z',
        updatedAt: '2024-06-14T08:30:00Z'
      },
    ];
  },

  create: async (order: any) =>
  {
    await delay(500);
    return {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  updateStatus: async (id: string, status: string) =>
  {
    await delay(500);
    return { success: true };
  },

  updateDeliveryType: async (id: string, deliveryType: string) =>
  {
    await delay(500);
    return { success: true };
  }
};
