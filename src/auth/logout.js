import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    React.useEffect(() => {
        handleLogout();
    }, [navigate]);

    return (
        <div>Logging out...</div>
    );
}

export default Logout;
