import React, { useEffect, useState, useRef } from 'react';
import { getPCs, updatePCStatus, addPC, getGroups } from './fsData';
import PCStatus from './PCStatus';
import PCList from './PCList';
import AddPCForm from './AddPCForm';
import './PCStatus.scss';

function Dashboard() {
    const [pcs, setPcs] = useState([]);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminForm, setShowAdminForm] = useState(false);

    // Use formRef similarly to PcStatus to focus admin form inputs
    const formRef = useRef(null);

    const [newPC, setNewPC] = useState({
        Title: '',
        Group: '',
        Status: 'available',
        CurrentUser: '',
        Since: ''
    });

    // Fetch PCs and Groups once
    useEffect(() => {
        const fetchData = async () => {
            try {
                const pcsData = await getPCs();
                setPcs(pcsData);
                const groupsData = await getGroups();
                setGroups(groupsData); // store array of group docs
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please try again later.");
            }
        };
        fetchData();
    }, []);

    // Example usage of formRef (focus first input when form is shown)
    useEffect(() => {
        if (showAdminForm && formRef.current) {
            const firstInput = formRef.current.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }, [showAdminForm]);

    // Refresh PCs from Firestore
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

    // Now use refreshPCs here instead of manually fetching updated PCs
    const handleAddPC = async (e) => {
        e.preventDefault();
        try {
            await addPC(newPC.Group, {
                name: newPC.Title,
                status: 'available',
                currentUser: '',
                since: new Date()
            });
            await refreshPCs(); // reuse refreshPCs
            setNewPC({ 
                Title: '', 
                Group: '', 
                Status: 'available', 
                CurrentUser: '', 
                Since: '' 
            });
        } catch (error) {
            console.error('Error adding PC:', error);
            setError(error.message || "An unexpected error occurred while adding a new PC.");
        }
    };

    // Optional example usage of "groups" in the UI
    // (e.g., displaying a simple group list above the PC grid)
    // The group object will have "id" and "name" if stored that way in Firestore
    // Render only if there are any groups
    const renderGroupList = () => {
        if (!groups.length) return null;
        return (
            <div style={{ marginBottom: '1rem' }}>
                <h3>Groups</h3>
                <ul>
                    {groups.map(group => (
                        <li key={group.id}>{group.name}</li>
                    ))}
                </ul>
            </div>
        );
    };

    // Group PCs (still used to display them in the UI)
    const groupedPCs = pcs.reduce((acc, pc) => {
        const group = pc.group_id?.id || 'Unknown Group';
        if (!acc[group]) acc[group] = [];
        acc[group].push(pc);
        return acc;
    }, {});

    // Check admin status
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
            {error && <div className="error-message">{error}</div>}
            {renderGroupList()}
            {isAdmin && (
                <>
                    <button
                        className="adminToggle"
                        onClick={() => setShowAdminForm(!showAdminForm)}
                    >
                        {showAdminForm ? 'Hide Admin Form' : 'Show Admin Form'}
                    </button>
                    <div 
                        style={{ display: showAdminForm ? 'block' : 'none' }} 
                        ref={formRef}
                    >
                        <AddPCForm
                            newPC={newPC}
                            setNewPC={setNewPC}
                            handleAddPC={handleAddPC}
                        />
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