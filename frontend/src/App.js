import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Import the custom CSS file

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchMessages();
    fetchFiles();
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

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/files');
      setFiles(response.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const fileData = new FormData();
    fileData.append('file', file);

    try {
      await axios.post('http://localhost:5000/upload', fileData);
      alert('File uploaded successfully!');
      fetchFiles();
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Error uploading file.');
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  return (
    <div className="app-container">
      <h1 className="heading">Public Message Board</h1>

      <div className="message-form">
        <textarea
          className="message-input"
          rows="4"
          placeholder="Write your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>
        <button className="send-btn" onClick={handleSendMessage}>Send Message</button>
      </div>

      <div className="messages-list">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="message-item">
              <p className="message-content">{message.content}</p>
              <small className="message-timestamp">
                {new Date(message.created_at).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p className="no-messages">No messages yet. Be the first to post!</p>
        )}
      </div>

      <div className="file-section">
        <h2 className="file-heading">File Upload and Download</h2>
        <input type="file" className="file-input" onChange={handleFileChange} />
        <button className="upload-btn" onClick={handleUpload}>Upload</button>

        <h3 className="file-list-heading">Files:</h3>
        <ul className="file-list">
          {files.map((file) => (
            <li key={file.id} className="file-item">
              {file.name}
              <button
                className="download-btn"
                onClick={() => handleDownload(file.id, file.name)}
              >
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
