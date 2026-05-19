const BASE_URL = "http://localhost:5000";

export const authService = {
  checkEmail: async (email) => {
    const response = await fetch(`${BASE_URL}/users?email=${email}`);
    return response.json();
  },

  signup: async (userData) => {
    const payload = {
      ...userData,
      favourites: Array.isArray(userData.favourites) ? userData.favourites : [],
      reservations: Array.isArray(userData.reservations) ? userData.reservations : []
    };
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  },

  login: async (email) => {
    const response = await fetch(`${BASE_URL}/users?email=${email}`);
    return response.json();
  },

  toggleFavourite: async (userId, eventId, currentFavourites = []) => {
    let updatedFavourites;
    
    const safeFavourites = Array.isArray(currentFavourites) ? currentFavourites : [];
    
    if (safeFavourites.includes(eventId)) {
      updatedFavourites = safeFavourites.filter(id => id !== eventId);
    } else {
      updatedFavourites = [...safeFavourites, eventId];
    }

    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favourites: updatedFavourites })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server rejected PATCH payload:", errorData);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Network or parsing error inside toggleFavourite utility:", error);
      throw error;
    }
  },

  bookReservation: async (userId, reservationPayload, currentReservations = []) => {
    const safeReservations = Array.isArray(currentReservations) ? currentReservations : [];
    const updatedReservations = [...safeReservations, reservationPayload];

    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservations: updatedReservations })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server rejected PATCH reservation payload:", errorData);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Network or parsing failure in bookReservation service:", error);
      throw error;
    }
  }
};

export const eventService = {
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/events`);
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/events/${id}`);
    return response.json();
  },
  
  create: async (eventData) => {
    const response = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return response.json();
  },
  
  update: async (id, eventData) => {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};