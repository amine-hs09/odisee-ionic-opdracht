import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://www.mohamedaminehssinoui-odisee.be/oef1/api',
  headers: { 'Content-Type': 'application/json' }
});

// Concerts
export const getConcerts = () => api.get('/concerts.php');
export const addConcert = (payload) => api.post('/concerts.php', payload);
export const updateConcert = (id, payload) => api.put(`/concerts.php?id=${id}`, payload);
export const deleteConcert = (id) => api.delete(`/concerts.php?id=${id}`);

// Visitors
export const getVisitors = () => api.get('/visitors.php');
export const addVisitor = (payload) => api.post('/visitors.php', payload);
export const updateVisitor = (id, payload) => api.put(`/visitors.php?id=${id}`, payload);
export const deleteVisitor = (id) => api.delete(`/visitors.php?id=${id}`);

// Tickets
export const getTickets = () => api.get('/tickets.php');
export const buyTicket = async (payload) => {
  try {
    return await api.post('/tickets.php', payload);
  } catch (e) {
    if (e.response?.data?.error?.includes('Duplicate entry')) {
      return api.post('/tickets.php?action=upsert', payload);
    }
    throw e;
  }
};
