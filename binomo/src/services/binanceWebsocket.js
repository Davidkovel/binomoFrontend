class BinanceWebSocketService {
    constructor() {
        this.ws = null;
        this.subscribers = new Set();
        this.isConnected = false;
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback); // Функция отписки
    }

    connect() {
        if (this.ws) return;

        const symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'solusdt', 'xrpusdt', 'adausdt'];
        const streams = symbols.map(sym => `${sym}@ticker`).join('/');
        
        this.ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.data) {
                const symbol = data.data.s; // "BTCUSDT"
                const price = parseFloat(data.data.c); // CUrrent price
                
                this.subscribers.forEach(callback => {
                    callback(symbol, price);
                });
            }
        };

        this.ws.onopen = () => {
            console.log('✅ Binance WebSocket connected');
            this.isConnected = true;
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }
}

export const binanceWebSocket = new BinanceWebSocketService();