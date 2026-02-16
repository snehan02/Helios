import { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

const InfoBox = ({ title, data, type, onSave, readOnly = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState(data || []);

    const handleAddItem = () => {
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

    if (readOnly && items.length === 0) return null;

    return (
        <div className="bg-slate-900 border border-slate-400/20 rounded-2xl p-6 flex flex-col h-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            {/* Silver Shine Effect */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h3>
                {!readOnly && (
                    isEditing ? (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                            <button onClick={handleSave} className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors">
                                <Save size={18} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                            <Edit2 size={18} />
                        </button>
                    )
                )}
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar-silver">
                {items.length === 0 && !isEditing && (
                    readOnly ? null : <p className="text-slate-600 text-xs italic text-center py-6 border border-dashed border-slate-800 rounded-xl">No logs available</p>
                )}

                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl group/item hover:border-slate-400/30 transition-all duration-300">
                        {isEditing ? (
                            <div className="w-full flex items-center gap-3">
                                <div className="flex-1 space-y-2">
                                    <input
                                        value={item.label}
                                        onChange={(e) => handleUpdateItem(item.id, 'label', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400"
                                        placeholder="Label"
                                    />
                                    <input
                                        value={item.value}
                                        onChange={(e) => handleUpdateItem(item.id, 'value', e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 text-xs text-slate-400 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-400"
                                        placeholder="Value/Link"
                                    />
                                </div>
                                <button onClick={() => handleDeleteItem(item.id)} className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-1">{item.label}</p>
                                    {type === 'resource' ? (
                                        <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-200 hover:text-white transition-colors truncate block">
                                            {item.value.replace('https://', '')}
                                        </a>
                                    ) : (
                                        <p className={clsx(
                                            "text-sm font-medium",
                                            type === 'payment' && item.value === 'Pending' ? 'text-amber-400' :
                                                type === 'payment' && item.value === 'Overdue' ? 'text-rose-400' :
                                                    'text-slate-200'
                                        )}>
                                            {item.value}
                                        </p>
                                    )}
                                </div>
                                {type === 'payment' && (
                                    <div className={clsx(
                                        "w-2 h-2 rounded-full",
                                        item.value === 'Completed' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
                                            item.value === 'Pending' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' :
                                                'bg-rose-400 shadow-[0_0_8px_#fb7185]'
                                    )} />
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {isEditing && (
                <button
                    onClick={handleAddItem}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all text-sm font-bold"
                >
                    <Plus size={16} />
                    <span>Add Entry</span>
                </button>
            )}
        </div>
    );
};

export default InfoBox;
