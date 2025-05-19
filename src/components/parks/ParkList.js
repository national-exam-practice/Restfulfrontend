import React from 'react';
import ParkCard from './ParkCard';

const ParkList = ({ parks }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parks.map(park => (
                <ParkCard key={park._id} park={park} />
            ))}
        </div>
    );
};

export default ParkList;