import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BIN_URL = process.env.BIN_URL;
const MASTER_KEY = process.env.MASTER_KEY;

export const readData = async () => {
  try {
    if (!BIN_URL || !MASTER_KEY) {
      throw new Error("Missing BIN_URL or MASTER_KEY in environment variables");
    }
    const response = await axios.get(BIN_URL, {
      headers: {
        'X-Master-Key': MASTER_KEY
      }
    });
    return response.data.record || response.data;
  } catch (error) {
    console.error('Error fetching data from JSONbin:', error.message);
    throw error;
  }
};

export const writeData = async (newData) => {
  try {
    if (!BIN_URL || !MASTER_KEY) {
      throw new Error("Missing BIN_URL or MASTER_KEY in environment variables");
    }
    await axios.put(BIN_URL, newData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY
      }
    });
    return true;
  } catch (error) {
    console.error('Error updating data on JSONbin:', error.message);
    throw error;
  }
};
