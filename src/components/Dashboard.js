import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PCStatus from './PCStatus';
import './Dashboard.scss';

const BaseUrl = 'https://pc-monitoring-func-app.azurewebsites.net/api/';
const ApiUrl = `${BaseUrl}ReadPC`;
const GroupsApiUrl = `${BaseUrl}ReadPC`;  // Temporarily use same endpoint until groups endpoint is ready

function Dashboard() {
    const [pcs, setPcs] = useState([]);
    const [groups, setGroups] = useState({});
    const [newPC, setNewPC] = useState({ Title: '', Status: 'available', Group: '', CurrentUser: '', Since: '' });
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(ApiUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                setPcs(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error.response?.data || error.message);
                setError("Failed to load PCs. Please try again later.");
            }
        };

        const fetchGroups = async () => {
            try {
                const response = await axios.get(GroupsApiUrl);
                // Temporarily extract groups from PCs until groups endpoint is ready
                const uniqueGroups = [...new Set(response.data.map(pc => pc.group))];
                const groupsData = uniqueGroups.reduce((acc, group, index) => {
                    acc[group] = group;
                    return acc;
                }, {});
                setGroups(groupsData);
            } catch (error) {
                console.error('Error fetching groups:', error.response?.data || error.message);
            }
        };

        fetchGroups();
        fetchData();
    }, []);

    const refreshPCs = async () => {
        try {
            const response = await axios.get(ApiUrl);
            setPcs(response.data);
            setError(null);
        } catch (error) {
            console.error('Error refreshing PCs:', error);
            setError(error.message || "An unexpected error occurred while refreshing PCs.");
        }
    };

    const updatePCStatus = async (id, status) => {
        try {
            const since = status === 'in_use' ? new Date().toISOString() : '';
            await axios.patch(`${ApiUrl}${id}/`, {
                status,
                since,
                currentUser: 'currentUser'
            });

            const updatedPcs = pcs.map(pc => (pc.id === id ? { ...pc, status, currentUser: 'currentUser', since } : pc));
            setPcs(updatedPcs);
            setError(null);
            await refreshPCs();
        } catch (error) {
            console.error('Update error:', error);
            setError("Failed to update PC status. Please try again.");
        }
    };

    const handleAddPC = async (e) => {
        e.preventDefault();
        try {
            await axios.post(ApiUrl, newPC);
            await refreshPCs();
        } catch (error) {
            console.error('Error adding PC:', error);
            setError(error.message || "An unexpected error occurred while adding a new PC.");
        }
    };

    const groupedPCs = pcs.reduce((acc, pc) => {
        const groupName = groups[pc.group] || 'Uncategorized';
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(pc);
        return acc;
    }, {});

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                setIsAdmin(true); // For demo purposes, set to true to test admin features
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            }
        };
        checkAdminStatus();
    }, []);

    return (
        <div className="dashboard">
            <h1>PC Monitoring Dashboard</h1>
            {error && <div className="error-message">{error}</div>}
            {isAdmin && (
                <>
                    <button className="adminToggle" onClick={() => setShowAdminForm(!showAdminForm)}>
                        {showAdminForm ? 'Hide Admin Form' : 'Show Admin Form'}
                    </button>
                    <form 
                        ref={formRef} 
                        onSubmit={handleAddPC} 
                        className="adminForm"
                        style={{ display: showAdminForm ? 'block' : 'none' }}
                    >
                        <input
                            type="text"
                            placeholder="PC Name"
                            value={newPC.Title}
                            onChange={(e) => setNewPC({ ...newPC, Title: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Group"
                            value={newPC.Group}
                            onChange={(e) => setNewPC({ ...newPC, Group: e.target.value })}
                            required
                        />
                        <button type="submit">Add PC</button>
                    </form>
                </>
            )}
            {Object.entries(groupedPCs)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([groupName, groupPCs]) => (
                    <div key={groupName} className="lab-group">
                        <h2>{groupName}</h2>
                        <div className="pc-grid">
                            {groupPCs.map(pc => (
                                <PCStatus
                                    key={pc.id}
                                    pc={pc}
                                    updatePCStatus={updatePCStatus}
                                    currentUser={'currentUser'}
                                />
                            ))}
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default Dashboard;