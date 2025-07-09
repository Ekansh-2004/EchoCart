import { create } from 'zustand';

export const useAIStore = create((set, get) => ({
  isActive: false,
  duration: 15,
  alerts: [],
  socket: null,
  connectionStatus: 'disconnected',
  
  setSocket: (socket) => {
    console.log('🔧 Setting socket in AI store');
    set({ socket });
    
    if (socket) {
      // Listen for AI status updates
      socket.on('aiStatus', (status) => {
        console.log('📊 AI Status update:', status);
        set({ 
          isActive: status.isActive,
          duration: status.checkInterval || 15,
          connectionStatus: 'connected'
        });
      });
      
      // Listen for stock alerts
      socket.on('stockAlert', (alerts) => {
        console.log('🚨 Stock alerts received:', alerts);
        set({ alerts });
        
        // Show browser notifications if permission granted
        if (Notification.permission === 'granted') {
          alerts.forEach(alert => {
            if (alert.severity === 'critical') {
              new Notification('🚨 Critical Stock Alert', {
                body: alert.message,
                icon: '/vite.svg'
              });
            }
          });
        }
      });

      socket.on('connect', () => {
        console.log('✅ Socket connected in AI store');
        set({ connectionStatus: 'connected' });
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected in AI store');
        set({ connectionStatus: 'disconnected' });
      });
    }
  },
  
  startAI: (duration) => {
    const { socket } = get();
    console.log('🚀 Starting AI with duration:', duration);
    if (socket && socket.connected) {
      socket.emit('startAI', { duration });
      set({ duration });
    } else {
      console.error('❌ Socket not connected, cannot start AI');
    }
  },
  
  stopAI: () => {
    const { socket } = get();
    console.log('🛑 Stopping AI');
    if (socket && socket.connected) {
      socket.emit('stopAI');
    } else {
      console.error('❌ Socket not connected, cannot stop AI');
    }
  },
  
  clearAlerts: () => {
    console.log('🧹 Clearing alerts');
    set({ alerts: [] });
  },
  
  requestNotificationPermission: async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.log('🔔 Notification permission:', permission);
    }
  }
}));