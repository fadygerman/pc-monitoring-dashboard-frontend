import React, { useState } from 'react';

function AddPCForm({ newPC, setNewPC, handleAddPC }) {
    const [error, setError] = useState(null);

    // If you want localized error handling, you can wrap handleAddPC in a try/catch here:
    const localSubmit = (e) => {
        try {
            handleAddPC(e);
        } catch (err) {
            setError("Failed to add PC. Please try again later.");
        }
    };

    return (
        <form onSubmit={localSubmit}>
            <input
                type="text"
                placeholder="PC Title"
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
            {error && <div className="error-message">{error}</div>}
        </form>
    );
}

export default AddPCForm;
