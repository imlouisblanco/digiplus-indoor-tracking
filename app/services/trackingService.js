// Servicio para simular la API del proveedor externo de tracking

// Datos simulados del proveedor
const mockProviderData = [
  {
    id: 1,
    name: "Juan Pérez",
    position: [19.4326, -99.1332],
    status: "active",
    lastUpdate: new Date(),
    department: "Desarrollo",
    cardId: "CARD001",
    battery: 85
  },
  {
    id: 2,
    name: "María García",
    position: [19.4328, -99.1334],
    status: "active",
    lastUpdate: new Date(),
    department: "Marketing",
    cardId: "CARD002",
    battery: 92
  },
  {
    id: 3,
    name: "Carlos López",
    position: [19.4324, -99.1330],
    status: "active",
    lastUpdate: new Date(),
    department: "Ventas",
    cardId: "CARD003",
    battery: 78
  },
  {
    id: 4,
    name: "Ana Rodríguez",
    position: [19.4330, -99.1336],
    status: "active",
    lastUpdate: new Date(),
    department: "Recursos Humanos",
    cardId: "CARD004",
    battery: 95
  },
  {
    id: 5,
    name: "Luis Martínez",
    position: [19.4322, -99.1328],
    status: "active",
    lastUpdate: new Date(),
    department: "Finanzas",
    cardId: "CARD005",
    battery: 88
  },
  {
    id: 6,
    name: "Sofia Torres",
    position: [19.4325, -99.1331],
    status: "active",
    lastUpdate: new Date(),
    department: "Desarrollo",
    cardId: "CARD006",
    battery: 76
  },
  {
    id: 7,
    name: "Roberto Silva",
    position: [19.4327, -99.1333],
    status: "active",
    lastUpdate: new Date(),
    department: "Marketing",
    cardId: "CARD007",
    battery: 91
  },
  {
    id: 8,
    name: "Carmen Ruiz",
    position: [19.4329, -99.1335],
    status: "active",
    lastUpdate: new Date(),
    department: "Ventas",
    cardId: "CARD008",
    battery: 83
  },
  {
    id: 9,
    name: "Miguel Herrera",
    position: [19.4323, -99.1329],
    status: "active",
    lastUpdate: new Date(),
    department: "Recursos Humanos",
    cardId: "CARD009",
    battery: 87
  },
  {
    id: 10,
    name: "Patricia Vega",
    position: [19.4331, -99.1337],
    status: "active",
    lastUpdate: new Date(),
    department: "Finanzas",
    cardId: "CARD010",
    battery: 94
  }
];

// Simular movimiento aleatorio de las personas
const simulateMovement = (currentPosition) => {
  const latChange = (Math.random() - 0.5) * 0.0005;
  const lngChange = (Math.random() - 0.5) * 0.0005;
  
  return [
    currentPosition[0] + latChange,
    currentPosition[1] + lngChange
  ];
};

// Simular cambio de estado (ocasionalmente generar alarmas)
const simulateStatusChange = (currentStatus) => {
  if (currentStatus === 'alarm') {
    // Si ya hay una alarma, 80% de probabilidad de que se resuelva
    return Math.random() < 0.8 ? 'active' : 'alarm';
  } else {
    // 5% de probabilidad de generar una alarma
    return Math.random() < 0.05 ? 'alarm' : 'active';
  }
};

// Simular actualización de batería
const simulateBatteryChange = (currentBattery) => {
  const change = (Math.random() - 0.5) * 2; // Cambio de -1 a +1
  return Math.max(0, Math.min(100, currentBattery + change));
};

// Función principal para obtener datos del proveedor
export const fetchTrackingData = async () => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  // Actualizar datos simulados
  const updatedData = mockProviderData.map(person => ({
    ...person,
    position: simulateMovement(person.position),
    status: simulateStatusChange(person.status),
    lastUpdate: new Date(),
    battery: simulateBatteryChange(person.battery)
  }));
  
  // Actualizar el array original
  mockProviderData.splice(0, mockProviderData.length, ...updatedData);
  
  return {
    success: true,
    data: updatedData,
    timestamp: new Date().toISOString(),
    provider: 'DigiPlus Tracking Provider',
    version: '1.0.0'
  };
};

// Función para obtener datos de una persona específica
export const fetchPersonData = async (personId) => {
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  const person = mockProviderData.find(p => p.id === personId);
  if (!person) {
    throw new Error('Persona no encontrada');
  }
  
  return {
    success: true,
    data: person,
    timestamp: new Date().toISOString()
  };
};

// Función para simular una alarma específica
export const simulateAlarm = async (personId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const person = mockProviderData.find(p => p.id === personId);
  if (person) {
    person.status = 'alarm';
    person.lastUpdate = new Date();
  }
  
  return {
    success: true,
    message: `Alarma simulada para ${person?.name || 'persona desconocida'}`,
    timestamp: new Date().toISOString()
  };
};

// Función para obtener estadísticas del proveedor
export const fetchProviderStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const totalPeople = mockProviderData.length;
  const activePeople = mockProviderData.filter(p => p.status === 'active').length;
  const alarmPeople = mockProviderData.filter(p => p.status === 'alarm').length;
  const avgBattery = mockProviderData.reduce((sum, p) => sum + p.battery, 0) / totalPeople;
  
  return {
    success: true,
    data: {
      totalPeople,
      activePeople,
      alarmPeople,
      avgBattery: Math.round(avgBattery),
      lastUpdate: new Date().toISOString(),
      systemHealth: 'excellent'
    }
  };
};
