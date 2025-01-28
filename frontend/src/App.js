import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/messages');
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/messages', { content: newMessage });
      setMessages([response.data, ...messages]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">Public Message Board</h1>
      <div className="space-y-4">
        <textarea
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          rows="4"
          placeholder="Write your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>
        <button
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          onClick={handleSendMessage}
        >
          Send Message
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="py-4">
              <p className="text-gray-700">{message.content}</p>
              <small className="text-gray-500">
                {new Date(message.created_at).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet. Be the first to post!</p>
        )}
      </div>
    </div>
  );
};

export default App;
