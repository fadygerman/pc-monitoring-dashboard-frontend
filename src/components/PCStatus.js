import React, { useState } from 'react';
import './PCStatus.scss'; // Updated to import SCSS file

const UserDisplay = ({ userName, compact }) => (
  <div className={`user-display ${compact ? 'compact' : ''}`} title={`In use by: ${userName}`}>
    <div className="user-coin">
      <div className="user-initials">
        {userName.split(' ').map(n => n[0]).join('')}
      </div>
    </div>
  </div>
);

const PCStatus = ({ pc, updatePCStatus, currentUser }) => {
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(pc.status);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async () => {
        if (pc.status !== 'maintenance' && pc.status !== 'offline') {
            // Check pc.status instead of local status
            if (pc.status === 'in_use' && pc.currentUser && pc.currentUser !== currentUser) {
                setError(`Only ${pc.currentUser} can set this PC to available.`);
                return;
            }
            try {
                setLoading(true);
                const newStatus = pc.status === 'available' ? 'in_use' : 'available';
                await updatePCStatus(pc.id, newStatus);
                setStatus(newStatus);
            } catch (err) {
                setError(err.message || "An error occurred while updating PC status");
            } finally {
                setLoading(false);
            }
        }
    };

    const formatDateTime = (dateString) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    };

    const getStatusDisplay = (status) => {
        const map = {
            available: 'Available',
            in_use: 'In Use',
            maintenance: 'Maintenance',
            offline: 'Offline',
            loading: 'Loading...'
        };
        return map[status] || status;
    };

    return (
        <section className="pc-status-container">
            {error && <div className="error-message">{error}</div>}
            
            <div
                className={`pc-status ${pc.status} ${loading ? 'loading' : ''}`}
                onClick={handleStatusChange}        >
                {loading && <div className="loading-spinner" />}
                <h3>{pc.name}</h3>
                <p>{getStatusDisplay(status)}</p>
                {status === 'in_use' && pc.currentUser && (
                    <div className="user-info">
                        <UserDisplay userName={pc.currentUser} compact />
                    </div>
                )}

                {(status === 'maintenance' || status === 'offline') && (
                    <div className={`hover-info ${status}`}>
                        <div>{status === 'maintenance' ? 'Under Maintenance' : 'System Offline'}</div>
                        {pc.currentUser && <div>User: {pc.currentUser}</div>}
                        {pc.since && <div>Since: {formatDateTime(pc.since)}</div>}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PCStatus;