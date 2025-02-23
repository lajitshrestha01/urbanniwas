import { create } from 'zustand';

const useUserStore = create((set) => {
  // Load user from localStorage on initialization
  const storedUser = JSON.parse(localStorage.getItem('user'));
  
  return {
    user: storedUser || null, 
    isAuthenticated: !!storedUser, 
    
    loginUser: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, isAuthenticated: true });
    },
    
    logoutUser: () => {
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
    }
  };
});

export default useUserStore;
