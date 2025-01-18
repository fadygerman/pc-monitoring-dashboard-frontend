import React, { useEffect, useState } from 'react';
import { getPCs } from './fsData';

function PCList() {
    const [pcs, setPcs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPCs = async () => {
            try {
                const pcsData = await getPCs();
                setPcs(pcsData);
            } catch (error) {
                setError("Failed to load PCs. Please try again later.");
            }
        };

        fetchPCs();
    }, []);

    return (
        <div>
            {error && <div className="error-message">{error}</div>}
            <ul>
                {pcs.map(pc => (
                    <li key={pc.id}>{pc.name} - {pc.status}</li>
                ))}
            </ul>
        </div>
    );
}

export default PCList;
