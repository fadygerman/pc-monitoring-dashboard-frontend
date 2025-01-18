import React, { useState } from 'react';
import { addPC } from './fsData';

function AddPCForm() {
    const [newPC, setNewPC] = useState({ name: '', group: '', status: 'available' });
    const [error, setError] = useState(null);

    const handleAddPC = async (e) => {
        e.preventDefault();
        try {
            await addPC(newPC.group, newPC);
            // Optionally, refresh the list of PCs or provide feedback to the user
        } catch (error) {
            setError("Failed to add PC. Please try again later.");
        }
    };

    return (
        <form onSubmit={handleAddPC}>
            <input
                type="text"
                placeholder="PC Name"
                value={newPC.name}
                onChange={(e) => setNewPC({ ...newPC, name: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Group"
                value={newPC.group}
                onChange={(e) => setNewPC({ ...newPC, group: e.target.value })}
                required
            />
            <button type="submit">Add PC</button>
            {error && <div className="error-message">{error}</div>}
        </form>
    );
}

export default AddPCForm;
