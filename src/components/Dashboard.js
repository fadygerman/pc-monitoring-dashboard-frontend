import React, { useEffect, useState, useRef } from 'react';
import { getPCs, updatePCStatus, addPC, getGroups } from './fsData';
import PCStatus from './PCStatus';
import PCList from './PCList';
import AddPCForm from './AddPCForm';
import './Dashboard.scss';

function Dashboard() {
    const [pcs, setPcs] = useState([]);
    const [groups, setGroups] = useState({});
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const formRef = useRef(null);
    const [newPC, setNewPC] = useState({
        Title: '',
        Group: '',
        Status: 'available',
        CurrentUser: '',
        Since: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pcsData = await getPCs();
                setPcs(pcsData);
                const groupsData = await getGroups();
                setGroups(groupsData);
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please try again later.");
            }
        };

        fetchData();
    }, []);

    const refreshPCs = async () => {
        try {
            const pcsData = await getPCs();
            setPcs(pcsData);
            setError(null);
        } catch (error) {
            console.error("Error refreshing PCs:", error);
            setError("Failed to refresh PCs. Please try again later.");
        }
    };

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
        const group = pc.group_id.id;
        if (!acc[group]) acc[group] = [];
        acc[group].push(pc);
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
                    <div style={{ display: showAdminForm ? 'block' : 'none' }}>
                        <AddPCForm />
                    </div>
                </>
            )}
            <PCList />
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