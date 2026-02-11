import { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

const InfoBox = ({ title, data, type, onSave, readOnly = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState(data || []);

    const handleAddItem = () => {
        // Default empty item structure based on type
        if (type === 'payment') setItems([...items, { label: 'New Invoice', value: 'Pending', id: Date.now() }]);
        else if (type === 'metric') setItems([...items, { label: 'Metric', value: '0', id: Date.now() }]);
        else setItems([...items, { label: 'Resource', value: 'https://', id: Date.now() }]);
    };

    const handleUpdateItem = (id, field, value) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleSave = () => {
        onSave(items);
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
                {!readOnly && (
                    isEditing ? (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg">
                                <X size={16} />
                            </button>
                            <button onClick={handleSave} className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg">
                                <Save size={16} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                            <Edit2 size={16} />
                        </button>
                    )
                )}
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {items.length === 0 && !isEditing && (
                    <p className="text-gray-500 text-sm italic text-center py-4">No data available</p>
                )}

                {items.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
                        {isEditing ? (
                            <div className="w-full flex items-center gap-2">
                                <div className="flex-1 space-y-2">
                                    <input
                                        value={item.label}
                                        onChange={(e) => handleUpdateItem(item.id, 'label', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 text-xs text-white rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                        placeholder="Label"
                                    />
                                    <input
                                        value={item.value}
                                        onChange={(e) => handleUpdateItem(item.id, 'value', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 text-xs text-gray-400 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                        placeholder="Value/Link"
                                    />
                                </div>
                                <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 p-1 hover:bg-red-500/10 rounded">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="text-sm font-medium text-gray-300">{item.label}</p>
                                    {type === 'resource' ? (
                                        <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate block max-w-[150px]">
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className={`text-xs ${type === 'payment' && item.value === 'Pending' ? 'text-yellow-500' :
                                            type === 'payment' && item.value === 'Overdue' ? 'text-red-500' :
                                                'text-gray-400'
                                            }`}>
                                            {item.value}
                                        </p>
                                    )}
                                </div>
                                {/* Optional Status Icon or indicator could go here */}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <button
                    onClick={handleAddItem}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-white hover:border-gray-500 hover:bg-gray-800/50 transition-all text-sm"
                >
                    <Plus size={16} />
                    <span>Add Item</span>
                </button>
            )}
        </div>
    );
};

export default InfoBox;
