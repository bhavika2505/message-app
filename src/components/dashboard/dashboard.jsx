import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.css';
import io from 'socket.io-client';
import ChatComponent from '../chatComponents/chatComponent';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found");
                navigate('/');
                return;
            }

            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            try {
                const usersResponse = await axios.get('http://localhost:8000/api/users/usernames', config);
                setUsers(usersResponse.data);

                const currentUserResponse = await axios.get('http://localhost:8000/api/users/currentuser', config);
                setCurrentUser(currentUserResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }

            const newSocket = io('http://localhost:8000', { query: { token } });
            setSocket(newSocket);
            return () => newSocket.close();
        };
        init();
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('token');
            if (socket) socket.disconnect();
            navigate('/');
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user); // Store the whole user object
    };

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <div className="navbar-left">
                </div>
                <div className="navbar-right">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="content">
                <div className="user-list">
                    <h2>Registered Users</h2>
                    <ul>
                        {users.map((user) => (
                            <li key={user.id} onClick={() => handleUserSelect(user)}>
                                {user.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="message-area">
                    {selectedUser && (
                        <ChatComponent
                            selectedUserId={selectedUser.id}
                            selectedUserName={selectedUser.name}
                            socket={socket}
                            currentUser={currentUser}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
