import express from "express";
import mongoose from "mongoose";
const transportRouter = express.Router();
const transportSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  number: { type: String, required: true },
  name: { type: String, required: true },
  normalSeats: { type: Number, required: true},
  normalSeatAmount: { type: Number, required: true },
  sleeperSeats: { type: Number, default: 0 },
  sleeperSeatAmount: { type: Number },
  acSeats: { type: Number, default: 0 },
  acSeatAmount: { type: Number },
  businessSeats: { type: Number, default: 0 },
  businessSeatAmount: { type: Number },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  mode: { type: String, required: true, enum: ['bus', 'train', 'flight'] },
});

const Transport = mongoose.model('Transport', transportSchema);

transportRouter.post('/add-transport', async (req, res) => {
  try {
    const { mode, sleeperSeats, sleeperSeatAmount, acSeats, acSeatAmount, businessSeats, businessSeatAmount } = req.body;
    if (mode === 'bus' && (!sleeperSeats || !sleeperSeatAmount)) {
      return res.status(400).json({ message: 'Sleeper seat details are required for buses.' });
    }
    if (mode === 'train' && (!acSeats || !acSeatAmount)) {
      return res.status(400).json({ message: 'AC seat details are required for trains.' });
    }
    if (mode === 'flight' && (!businessSeats || !businessSeatAmount)) {
      return res.status(400).json({ message: 'Business seat details are required for flights.' });
    }

    const newTransport = new Transport(req.body);
    await newTransport.save();

    res.status(201).json({ message: 'Transport added successfully!' });
  } catch (err) {
    console.error('Error adding transport:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

transportRouter.put('/decreaseseat', async (req, res) => {
  try {
    const { from, to, date, number, seatType,mode } = req.body;

    if (!from || !to || !date || !number || !seatType) {
      return res.status(400).json({ message: 'Missing required fields: from, to, date, number, seatType' });
    }

    const transport = await Transport.findOne({ from, to, date, number ,mode});
    if (!transport) {
      return res.status(404).json({ message: 'No matching transport found for the given criteria' });
    }

    const normalizedSeatType = seatType.toLowerCase();

    if (normalizedSeatType === 'normal' && transport.normalSeats > 0) {
      transport.normalSeats -= 1;
    } else if (normalizedSeatType === 'ac' && transport.acSeats > 0) {
      transport.acSeats -= 1;
    } else if (normalizedSeatType === 'sleeper' && transport.sleeperSeats > 0) {
      transport.sleeperSeats -= 1;
    } else if (normalizedSeatType === 'business' && transport.businessSeats > 0) {
      transport.businessSeats -= 1;
    } else {
      return res.status(400).json({ message: 'Invalid seat type or no seats available' });
    }

    await transport.save();
    res.status(200).json({ message: 'Seat successfully decreased', transport });
  } catch (err) {
    console.error('Error decreasing seat:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});
transportRouter.put('/increaseseat', async (req, res) => {
  try {
    const { from, to, date, number, seatType } = req.body;

    if (!from || !to || !date || !number || !seatType) {
      return res.status(400).json({ message: 'Missing required fields: from, to, date, number, seatType' });
    }

    const transport = await Transport.findOne({ from, to, date, number });
    if (!transport) {
      return res.status(404).json({ message: 'No matching transport found for the given criteria' });
    }

    const normalizedSeatType = seatType.toLowerCase();

    if (normalizedSeatType === 'normal') {
      transport.normalSeats += 1;
    } else if (normalizedSeatType === 'ac') {
      transport.acSeats += 1;
    } else if (normalizedSeatType === 'sleeper') {
      transport.sleeperSeats += 1;
    } else if (normalizedSeatType === 'business') {
      transport.businessSeats += 1;
    } else {
      return res.status(400).json({ message: 'Invalid seat type' });
    }

    await transport.save();
    res.status(200).json({ message: 'Seat successfully increased', transport });
  } catch (err) {
    console.error('Error increasing seat:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});


transportRouter.post('/get-transport', async (req, res) => {
  try {
    const { from, to, date, mode } = req.body;
    const data = await Transport.find({ from, to, date, mode });
    res.json(data);
  } catch (err) {
    console.error('Error fetching transport:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

transportRouter.get('/transport', async (req, res) => {
  try {
    const transport = await Transport.find();
    if (!transport || transport.length === 0) {
      return res.status(404).json({ error: 'Transport data not found' });
    }
    res.json(transport);
  } catch (err) {
    console.error('Error in /transport:', err);
    res.status(500).json({ error: 'Failed to fetch transport document' });
  }
});

export default transportRouter;
