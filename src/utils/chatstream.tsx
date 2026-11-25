import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { apiUrlWs } from './axios';

interface WebSocketContextType {
    socket: WebSocket | null,
    latestMessage: string | null,
    connecting: boolean,
}

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    latestMessage: null,
    connecting: false
});

export const useChatStream = () => useContext(WebSocketContext);

export const ChatStreamProvider: React.FC<{ children: React.ReactNode, token?: string | null }> = ({ children, token }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [latestMessage, setLatestMessage] = useState<any | null>(null);
    const [connecting, setConnecting] = useState<boolean>(false);

    const reconnectTimeoutRef = useRef<any>(null);

    useEffect(() => {
        if (!token) {
            if (socket) socket.close();
            setSocket(null);
            return;
        }

        let ws: WebSocket;

        const connectSocket = () => {
            setConnecting(true);
            ws = new WebSocket(apiUrlWs + `/v4/chat/updates?auth=${token}`);

            ws.onopen = () => {
                setConnecting(false);
                setSocket(ws);
                if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            };

            ws.onmessage = (event) => {
                setLatestMessage(event.data);
            };

            ws.onclose = (event) => {
                setConnecting(true);
                setSocket(null);

                if (!event.wasClean) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectSocket();
                    }, 3000);
                }
            };

            ws.onerror = (error) => {
                console.error('Socket err:', error);
                ws.close();
            };
        };

        // connectSocket();

        return () => {
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            if (ws) ws.close();
        };
    }, [token]);

    return (
        <WebSocketContext.Provider value={{ socket, latestMessage, connecting }}>
            {children}
        </WebSocketContext.Provider>
    );
};
