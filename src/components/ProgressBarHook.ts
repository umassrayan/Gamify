import { useState, useEffect } from 'react';

const calculateProgress = (): number => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // --- IMPORTANT: Adjust these dates for the correct year if this code is run in a different year ---
    // For 2025 specifically:
    // const startDate = new Date(2025, 1, 1); // February 1st, 2025 (Month is 0-indexed)
    // const endDate = new Date(2025, 4, 9); // May 9th, 2025 (Month is 0-indexed)

    // If you want it to always be for the *current* year the code is run:
    const startDate = new Date(currentYear, 1, 1); // February 1st
    const endDate = new Date(currentYear, 4, 9); // May 9th

    if (currentDate < startDate) {
        return 0;
    }
    if (currentDate > endDate) {
        return 100;
    }

    const totalDuration = endDate.getTime() - startDate.getTime();
    if (totalDuration <= 0) return 100; // Avoid division by zero if dates are same or inverted

    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const progressPercentage = (elapsedTime / totalDuration) * 100;

    return Math.min(Math.max(progressPercentage, 0), 100);
};

export const useCourseProgress = (): number => {
    // Calculate initial progress
    const [progress, setProgress] = useState<number>(calculateProgress());

    // Optional: If you want the progress to update if the component stays mounted across a day change.
    // For most use cases, calculating once on mount is sufficient.
    useEffect(() => {
        const interval = setInterval(() => {
            const newProgress = calculateProgress();
            if (newProgress !== progress) {
                setProgress(newProgress);
            }
        }, 600000); // Check every minute for a change, adjust as needed

        return () => clearInterval(interval);
    }, [progress]); // Re-run effect if progress changes from an external source (less likely here)

    return progress;
};
