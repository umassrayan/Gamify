import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const days = ['W', 'M', 'T', 'W', 'T', 'F'];
const daysFullName = ['Weekend', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const getTodayName = () => new Date().toLocaleDateString(undefined, { weekday: 'long' });

type AgendaItem = {
    title: string;
    completed: boolean;
};

const WeeklyAgenda: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const location = useLocation();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [counts, setCounts] = useState<{
        [day: string]: { total: number; done: number };
    }>({});
    const todayName = getTodayName();

    // Get week ID like "2025-W19"
    const getCurrentWeekId = () => {
        const today = new Date();
        const year = today.getFullYear();
        const week = Math.ceil(((today.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7);
        return `${year}-W${week}`;
    };

    const fetchAgenda = async () => {
        if (!currentUser) return;
        const weekId = getCurrentWeekId();

        const baseRef = collection(db, 'users', currentUser.uid, 'agenda', weekId, 'days');
        const snapshot = await getDocs(baseRef);

        const dayCounts: { [day: string]: { total: number; done: number } } = {};
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const tasks: AgendaItem[] = data.tasks || [];
            const completedCount = tasks.filter((t) => t.completed).length;
            dayCounts[docSnap.id] = {
                total: tasks.length,
                done: completedCount,
            };
        });

        setCounts(dayCounts);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAgenda();
        }, 300); // Small delay to allow Firestore updates to finish
        return () => clearTimeout(timer);
    }, [location, currentUser]);

    return (
        <div
            style={{
                backgroundColor: '#BEB5AA',
                width: '35vh',
                height: '55vh',
                display: 'grid',
                gridTemplateRows: 'repeat(6, 2fr)',
                padding: '1rem',
                gap: '.25rem',
                borderRadius: '25px',
                marginLeft: '15px',
                marginTop: '5px',
            }}
        >
            {days.map((label, index) => {
                const full = daysFullName[index];
                const isToday = todayName === full;
                const isHovered = hoveredIndex === index;
                const stat = counts[full] || { total: 0, done: 0 };

                return (
                    <button
                        key={index}
                        onClick={() => navigate(`/todo/${full}`)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            backgroundColor: isToday || isHovered ? '#fff' : '#CDC6BD',
                            textAlign: 'center',
                            border: 'none',
                            borderRadius: '50px',
                            minWidth: '34vh',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            fontSize: '1.5rem',
                            marginTop: '5px',
                            justifyContent: 'flex-start',
                            padding: '0 1rem',
                            transition: 'background-color 0.2s ease',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            style={{
                                width: '6vh',
                                height: '6vh',
                                borderRadius: '50%',
                                backgroundColor: isToday || isHovered ? 'white' : '#e2deda',
                                textAlign: 'center',
                                lineHeight: '6vh',
                                marginLeft: '-0.25rem',
                            }}
                        >
                            {label}
                        </div>
                        <div
                            style={{
                                flexDirection: 'column',
                                textAlign: 'left',
                                margin: 0,
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    margin: 0,
                                }}
                            >
                                {isToday || isHovered ? full : ''}
                            </p>
                            <p
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 'lighter',
                                    margin: 0,
                                    marginTop: '-0.15rem',
                                }}
                            >
                                {isToday || isHovered ? stat.total - stat.done + ' Uncompleted' : ''}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
    {
        /* <div style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              {stat.done} / {stat.total}
            </div> */
    }
};

export default WeeklyAgenda;
