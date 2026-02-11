import { LogOut, Calendar, AlertTriangle, ChevronLeft, ChevronRight, ExternalLink, LayoutGrid, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

export default function ClientPortal({ user }: { user: any }) {
    const brandColor = user.client?.primaryColor || '#0066FF';
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const queryClient = useQueryClient();

    const { data: client } = useQuery({
        queryKey: ['client', user.clientId],
        queryFn: async () => {
            const { data } = await api.get(`/clients/${user.clientId}`);
            return data;
        },
        enabled: !!user.clientId
    });

    const { data: logs } = useQuery({
        queryKey: ['logs', user.clientId, format(currentMonth, 'yyyy-MM')],
        queryFn: async () => {
            const start = startOfMonth(currentMonth).toISOString();
            const end = endOfMonth(currentMonth).toISOString();
            const { data } = await api.get(`/work-logs?clientId=${user.clientId}&startDate=${start}&endDate=${end}`);
            return data;
        },
        enabled: !!user.clientId
    });

    const markBlocked = useMutation({
        mutationFn: async () => {
            return api.post('/notifications', { clientId: user.clientId, message: 'Client initiated blocking status' });
        },
        onSuccess: () => {
            alert('Your account manager has been notified.');
        }
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const monthDays = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const todayLog = logs?.find((l: any) => isToday(new Date(l.date)));

    return (
        <div className="min-h-screen bg-[#FAFBFF] flex flex-col font-inter text-slate-900">
            {/* Elegant Header */}
            <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-50">
                <div className="flex items-center space-x-6">
                    {client?.logoUrl ? (
                        <img src={client.logoUrl} alt="Logo" className="h-12 object-contain" />
                    ) : (
                        <div className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 font-black text-slate-800 tracking-tight text-lg shadow-sm">
                            {client?.companyName}
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-8">
                    <button
                        className="flex items-center space-x-3 px-8 py-3.5 rounded-2xl text-white font-black text-sm hover:opacity-90 transition-all shadow-2xl active:scale-95 group relative overflow-hidden"
                        style={{ backgroundColor: brandColor }}
                        onClick={() => markBlocked.mutate()}
                        disabled={markBlocked.isPending}
                    >
                        <AlertTriangle size={20} className="group-hover:animate-bounce" />
                        <span>{markBlocked.isPending ? 'Alerting...' : "Status: Blocked"}</span>
                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-700"></div>
                    </button>

                    <div className="h-8 w-px bg-slate-200"></div>

                    <button
                        onClick={handleLogout}
                        className="p-3 text-slate-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-2xl"
                        title="Logout"
                    >
                        <LogOut size={24} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-12 space-y-12">
                {/* Hero / Pulse Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black tracking-tight text-slate-900">Project Visibility</h2>
                            <p className="text-slate-500 mt-2 font-medium">Real-time pulse of your agency's progress and daily logs.</p>

                            <div className="mt-10 flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Status</span>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className={`w-4 h-4 rounded-full ${todayLog?.status === 'GREEN' ? 'bg-green-500 shadow-lg shadow-green-200 animate-pulse' : 'bg-slate-200'}`}></div>
                                        <span className="font-black text-xl">{todayLog ? todayLog.status : 'Awaiting Log'}</span>
                                    </div>
                                </div>
                                <div className="w-px h-12 bg-slate-100"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Last Update</span>
                                    <span className="font-black text-xl mt-2">{todayLog ? format(new Date(todayLog.updatedAt), 'h:mm a') : '---'}</span>
                                </div>
                            </div>

                            {todayLog?.description && (
                                <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-sm italic font-medium text-slate-600 line-clamp-2">"{todayLog.description}"</p>
                                </div>
                            )}
                        </div>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold">Quick Actions</h3>
                            <div className="mt-8 space-y-4">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="font-bold text-sm">Review Timeline</span>
                                    <ChevronRight size={18} className="text-slate-500" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <span className="font-bold text-sm">Open Drive</span>
                                    <ExternalLink size={18} className="text-slate-500" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-10 relative z-10">
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">Agency Support</p>
                            <p className="text-sm font-bold opacity-80 underline underline-offset-4 cursor-pointer hover:text-blue-400 transition-colors">Contact Your Manager</p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                </div>

                {/* Modern Calendar Section */}
                <section className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 p-12 border border-slate-100 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900">Work History</h2>
                            <p className="text-slate-500 mt-1 font-medium">Select a date to view detailed transmission data.</p>
                        </div>
                        <div className="flex items-center bg-slate-50 p-1.5 rounded-3xl border border-slate-100 shadow-inner">
                            <button
                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                            >
                                <ChevronLeft size={24} className="text-slate-400" />
                            </button>
                            <span className="font-black text-lg min-w-[180px] text-center text-slate-800">{format(currentMonth, 'MMMM yyyy')}</span>
                            <button
                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all"
                            >
                                <ChevronRight size={24} className="text-slate-400" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-6">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="pb-6 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                {day}
                            </div>
                        ))}
                        {monthDays.map((day, i) => {
                            const dayLog = logs?.find((l: any) => isSameDay(new Date(l.date), day));
                            const itToday = isToday(day);
                            return (
                                <div key={i} className={`group relative bg-white aspect-[5/4] rounded-3xl border transition-all duration-300 flex flex-col p-4 ${itToday ? 'border-primary ring-4 ring-primary/5' : 'border-slate-50 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/30'
                                    }`}>
                                    <span className={`text-lg font-black ${itToday ? 'text-primary' : 'text-slate-300 group-hover:text-slate-900'}`}>{format(day, 'd')}</span>

                                    {dayLog && (
                                        <div className="mt-auto flex justify-center">
                                            <div
                                                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200 transition-transform group-hover:scale-110 ${dayLog.status === 'GREEN' ? 'bg-green-500' :
                                                        dayLog.status === 'YELLOW' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                title={dayLog.description}
                                            >
                                                {dayLog.status === 'GREEN' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Adaptive Dashboard Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {client?.dashboardBoxes?.map((box: any) => (
                        <DashboardBox key={box.id} title={box.title}>
                            <div className="text-sm text-slate-500 font-medium leading-relaxed">
                                {typeof box.data === 'string' ? box.data : JSON.stringify(box.data)}
                            </div>
                        </DashboardBox>
                    ))}

                    {!client?.dashboardBoxes?.length && (
                        <>
                            <DashboardBox title="Recent Progress" type="PROGRESS">
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-4">
                                        <LayoutGrid size={32} />
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium">No custom boards published yet.</p>
                                </div>
                            </DashboardBox>
                            <DashboardBox title="Resources" type="RESOURCE">
                                <div className="space-y-3">
                                    <ResourceLink title="Agency Knowledge base" url="#" />
                                    <ResourceLink title="Partner Handbook" url="#" />
                                </div>
                            </DashboardBox>
                        </>
                    )}
                </section>
            </main>

            <footer className="p-12 text-center text-slate-400 text-sm font-medium">
                <p>Powered by <span className="font-black text-slate-900 tracking-tighter">HELIOS</span> Platform</p>
            </footer>
        </div>
    );
}

function DashboardBox({ title, children }: any) {
    return (
        <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/20 border border-slate-50 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 group">
            <h3 className="text-xl font-black mb-6 text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
            {children}
        </div>
    );
}

function ResourceLink({ title, url }: any) {
    return (
        <a href={url} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-lg transition-all group">
            <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{title}</span>
            <ExternalLink size={20} className="text-slate-300 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
        </a>
    );
}
