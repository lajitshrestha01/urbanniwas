import { useState, useEffect, useRef } from 'react';
import api from '../../utlis/axios';
import useUserStore from '../../zustand/store';
import { Send } from 'lucide-react';
import io from 'socket.io-client';
import DashboardLayout from '../layout/dashboardLayout';

const socket = io('http://localhost:3000', { withCredentials: true, transports: ['websocket'] });

export default function Messages() {
    const { user, isAuthenticated, setUser } = useUserStore();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        socket.auth = { userId: user.id };
        socket.connect();

        const handleNewMessage = message => {
            console.log('New message received:', message);
            setMessages(prev => [...prev, message]);

            setConversations(prev => {
                const existingConv = prev.find(
                    conv => conv.userId === message.senderId || conv.userId === message.receiverId
                );
                if (existingConv) {
                    return [
                        {
                            ...existingConv,
                            lastMessage: message.message,
                            lastMessageTime: message.createdAt,
                        },
                        ...prev.filter(
                            conv => !(conv.userId === message.senderId || conv.userId === message.receiverId)
                        ),
                    ].sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
                }
                const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
                const newConv = {
                    userId: otherUserId,
                    userName:
                        message.senderId === user.id
                            ? message.receiver?.name || 'Unknown'
                            : message.sender?.name || 'Unknown',
                    userAvatar:
                        message.senderId === user.id
                            ? message.receiver?.avatar || 'https://via.placeholder.com/40'
                            : message.sender?.avatar || 'https://via.placeholder.com/40',
                    lastMessage: message.message,
                    lastMessageTime: message.createdAt,
                };
                return [newConv, ...prev].sort(
                    (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                );
            });

            if (message.receiverId === user.id) {
                setUser(prevUser => ({
                    ...prevUser,
                    unreadCount: (prevUser.unreadCount || 0) + 1,
                }));
            }
        };

        const handleMessageSeen = message => {
            setMessages(prev => prev.map(m => (m.id === message.id ? message : m)));
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('messageSeen', handleMessageSeen);

        socket.on('connect_error', err => {
            console.log('Connection error: ', err);
            socket.connect();
        });

        const fetchConversations = async () => {
            try {
                const messageRes = await api.get('/messages', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const messages = messageRes.data;

                const convMap = {};
                messages.forEach(msg => {
                    const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
                    const key = otherUserId;
                    if (!convMap[key] || new Date(msg.createdAt) > new Date(convMap[key].lastMessageTime)) {
                        convMap[key] = {
                            userId: otherUserId,
                            userName:
                                msg.senderId === user.id
                                    ? msg.receiver?.name || 'Unknown'
                                    : msg.sender?.name || 'Unknown',
                            userAvatar:
                                msg.senderId === user.id
                                    ? msg.receiver?.avatar || 'https://via.placeholder.com/40'
                                    : msg.sender?.avatar || 'https://via.placeholder.com/40',
                            lastMessage: msg.message,
                            lastMessageTime: msg.createdAt,
                        };
                    }
                });
                const convList = Object.values(convMap).sort(
                    (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                );
                setConversations(convList);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load conversations');
            }
        };
        fetchConversations();

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('messageSeen', handleMessageSeen);
            socket.disconnect();
        };
    }, [user, isAuthenticated]);

    useEffect(() => {
        if (selectedConversation) {
            const fetchMessages = async () => {
                const messageRes = await api.get('/messages', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const filteredMessages = messageRes.data.filter(
                    msg =>
                        (msg.senderId === user.id && msg.receiverId === selectedConversation.userId) ||
                        (msg.senderId === selectedConversation.userId && msg.receiverId === user.id)
                );
                setMessages(filteredMessages);
                // setUser({ ...user, unreadCount: 0 });

                // Mark messages as seen
                filteredMessages.forEach(msg => {
                    if (!msg.seenBy.includes(user.id) && msg.receiverId === user.id) {
                        api
                            .put(
                                `/messages/${msg.id}/seen`,
                                {},
                                { headers: { Authorization: `Bearer ${user.token}` } }
                            )
                            .catch(err => console.log('Error marking as seen:', err));
                    }
                });
            };
            fetchMessages();
        }
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation, user]);

    const handleSendMessage = async e => {
        e.preventDefault();
        if (!newMessage || !selectedConversation) return;

        try {
            const messageRes = await api.get('/messages', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const propertyId =
                messageRes.data.find(
                    msg =>
                        (msg.senderId === user.id && msg.receiverId === selectedConversation.userId) ||
                        (msg.senderId === selectedConversation.userId && msg.receiverId === user.id)
                )?.propertyId || 'default-property-id';

            await api.post(
                '/messages',
                {
                    propertyId,
                    receiverId: selectedConversation.userId,
                    message: newMessage,
                },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setNewMessage('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send message');
        }
    };

    if (!isAuthenticated) {
        return (
            <DashboardLayout>
                <p className="text-[#1A2B3C]">Please log in</p>
            </DashboardLayout>
        );
    }
    console.log(conversations, 'message');

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-playfair font-bold text-[#1A2B3C] mb-6">
                {user.role === 'AGENT' ? 'Agent Messages' : 'My Messages'}
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="flex flex-col md:flex-row h-[70vh] bg-white rounded-xl shadow-lg">
                {/* Left Panel: Conversation List */}
                <div className="w-full md:w-1/3 border-r border-slate-200 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="p-4 text-gray-600">No conversations yet</p>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.userId}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-100 ${selectedConversation?.userId === conv.userId ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="flex items-center">
                                    <img
                                        src={conv.userAvatar}
                                        alt={conv.userName}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-semibold text-[#1A2B3C]">{conv.userName}</p>
                                        <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(conv.lastMessageTime).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Right Panel: Chat Window */}
                <div className="w-full md:w-2/3 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-200 bg-blue-50 flex items-center">
                                <img
                                    src={selectedConversation.userAvatar}
                                    alt={selectedConversation.userName}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <p className="font-semibold text-[#1A2B3C]">{selectedConversation.userName}</p>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-4 overflow-y-auto">
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`mb-4 flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        <div
                                            className={`max-w-xs p-3 rounded-lg ${msg.senderId === user.id
                                                ? 'bg-blue-100 text-[#1A2B3C]'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            <p className="text-xs text-gray-500">Regarding: {msg.property.title}</p>
                                            <p>{msg.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(msg.createdAt).toLocaleTimeString()}
                                            </p>
                                            {msg.seenBy && msg.seenBy.includes(user.id) && msg.receiverId !== user.id && (
                                                <p className="text-xs text-green-600 mt-1">Seen</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Message Input */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-4 border-t border-slate-200 flex items-center"
                            >
                                <textarea
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-2 border rounded-lg resize-none"
                                    rows="2"
                                />
                                <button
                                    type="submit"
                                    className="ml-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-600">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
