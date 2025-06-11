import { http, HttpResponse } from 'msw';
import bookingsData from './data/bookings.json';
import cabangsData from './data/cabangs.json';
import unitsData from './data/units.json';

// Use the same environment variable for consistency
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MOCK_BOOKINGS_URL = `${API_BASE_URL}/bookings`;
const MOCK_CABANGS_URL = `${API_BASE_URL}/cabangs`;
const MOCK_UNITS_URL = `${API_BASE_URL}/units`;

// Add this log to see the exact URL MSW is listening for
console.log('MSW is listening for GET requests to:', MOCK_BOOKINGS_URL);

export const handlers = [
    http.get(MOCK_BOOKINGS_URL, () => {
        return HttpResponse.json(bookingsData);
    }),
    http.get(MOCK_CABANGS_URL, () => {
        return HttpResponse.json(cabangsData);
    }),
    http.get(MOCK_UNITS_URL, () => {
        return HttpResponse.json(unitsData);
    }),
];