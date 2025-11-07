
import React, { useState } from 'react';
import { Room, RoomStatus } from '../types';
import { CloseIcon } from './icons';

interface HotelViewProps {
    rooms: Room[];
    onUpdateStatus: (roomId: string, status: RoomStatus) => void;
}

const statusStyles: { [key in RoomStatus]: { bg: string; text: string; border: string; } } = {
    'Vacant': { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500' },
    'Occupied': { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500' },
    'Needs Cleaning': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500' },
    'Out of Service': { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500' },
};

const statusOptions: RoomStatus[] = ['Vacant', 'Occupied', 'Needs Cleaning', 'Out of Service'];

const HotelView: React.FC<HotelViewProps> = ({ rooms, onUpdateStatus }) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedRoom(null);
        setIsModalOpen(false);
    };

    const handleStatusChange = (status: RoomStatus) => {
        if (selectedRoom) {
            onUpdateStatus(selectedRoom.id, status);
        }
        closeModal();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 font-serif">Hotel Room Status</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {rooms.map(room => {
                    const styles = statusStyles[room.status];
                    return (
                        <button
                            key={room.id}
                            onClick={() => openModal(room)}
                            className={`p-4 rounded-lg shadow-lg flex flex-col items-center justify-center aspect-square transition-transform duration-200 hover:-translate-y-1 ${styles.bg} border-2 ${styles.border}`}
                        >
                            <span className="text-3xl font-bold text-text-primary">{room.number}</span>
                            <span className={`mt-2 text-xs font-semibold ${styles.text}`}>{room.status}</span>
                        </button>
                    );
                })}
            </div>

            {isModalOpen && selectedRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-lg p-6 sm:p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold font-serif">Update Room {selectedRoom.number}</h2>
                            <button onClick={closeModal} className="text-text-secondary hover:text-text-primary">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-text-secondary mb-6">Select the new status for this room.</p>
                        <div className="grid grid-cols-2 gap-3">
                            {statusOptions.map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    disabled={status === selectedRoom.status}
                                    className={`w-full py-3 px-4 rounded-lg font-bold transition-colors text-white ${
                                        status === selectedRoom.status 
                                        ? 'bg-primary cursor-not-allowed' 
                                        : 'bg-secondary-light hover:bg-primary/80'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelView;
