import Client from '../models/Client.js';

export const getClients = async (req, res) => {
  const clients = await Client.find().sort({ name: 1 });
  res.json(clients);
};

export const createClient = async (req, res) => {
  const { name, phone, startDate, endDate, isActive, ratePerLiter } = req.body;

  if (!name || !startDate) {
    return res.status(400).json({ message: 'Name and start date are required' });
  }

  const client = await Client.create({
    name,
    phone,
    startDate,
    endDate,
    isActive,
    ratePerLiter
  });

  res.status(201).json(client);
};

export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, phone, startDate, endDate, isActive, ratePerLiter } = req.body;

  const client = await Client.findById(id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }

  client.name = name ?? client.name;
  client.phone = phone ?? client.phone;
  client.startDate = startDate ?? client.startDate;
  client.endDate = endDate ?? client.endDate;
  client.isActive = typeof isActive === 'boolean' ? isActive : client.isActive;
  client.ratePerLiter = ratePerLiter ?? client.ratePerLiter;

  await client.save();

  res.json(client);
};

export const deleteClient = async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }
  await client.deleteOne();
  res.json({ message: 'Client deleted' });
};

export const toggleClientActive = async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);
  if (!client) {
    return res.status(404).json({ message: 'Client not found' });
  }
  client.isActive = !client.isActive;
  await client.save();
  res.json(client);
};

