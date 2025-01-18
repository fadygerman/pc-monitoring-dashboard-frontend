import React, { useEffect, useState, useRef } from 'react';
import { getPCs, updatePCStatus, addPC } from './fsData';
import PCStatus from './PCStatus';
import './Dashboard.scss';

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
                const pcsData = await getPCs();
                setPcs(pcsData);
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load PCs. Please try again later.");
            }
        };

        fetchData();
    }, []);

    const updatePCStatusHandler = async (id, status) => {
        try {
            await updatePCStatus(id, status, 'currentUser');
            const updatedPcs = pcs.map(pc => 
                pc.id === id 
                    ? { ...pc, status, currentUser: 'currentUser', since: new Date() } 
                    : pc
            );
            setPcs(updatedPcs);
            setError(null);
        } catch (error) {
            console.error('Update error:', error);
            setError("Failed to update PC status. Please try again.");
        }
    };

    const handleAddPC = async (e) => {
        e.preventDefault();
        try {
            await addPC(newPC.Group, {
                name: newPC.Title,
                status: 'available',
                currentUser: '',
                since: new Date()
            });
            const updatedPCs = await getPCs();
            setPcs(updatedPCs);
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
            {/* <h1>PC Monitoring Dashboard</h1> */}
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
                                    updatePCStatus={updatePCStatusHandler}
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