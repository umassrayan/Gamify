// ProgressBar.tsx
import React from 'react'; // Make sure React is imported

type ProgressBarProps = {
    progress: number; // 0 to 100 (can be a float)
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    // Arrow function with curly braces
    // Function to truncate to two decimal places and format
    const formatProgress = (num: number): string => {
        // Truncate the number to 2 decimal places
        // Example: 97.129 * 100 = 9712.9, Math.trunc(9712.9) = 9712, 9712 / 100 = 97.12
        // Example: 97.1 * 100 = 9710, Math.trunc(9710) = 9710, 9710 / 100 = 97.1
        const truncated = Math.trunc(num * 100) / 100;
        // .toFixed(2) ensures that if the number is 97.1, it becomes "97.10"
        // or if it's 97, it becomes "97.00"
        return truncated.toFixed(2);
    };

    // You MUST explicitly return the JSX when using curly braces for the function body
    return (
        <div>
            <div
                style={{
                    fontWeight: 'bold',
                    margin: '40px',
                    textAlign: 'center',
                }}
            >
                {formatProgress(progress)}%
            </div>
            <div
                style={{
                    height: '75vh',
                    width: '35px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    marginLeft: '40px',
                    marginTop: '-10px',
                }}
            >
                <div
                    style={{
                        height: `${progress}%`, // Use the original progress for smooth height
                        width: '100%',
                        backgroundColor: '#6D5A4F',
                        transition: 'height 0.3s ease-in-out',
                        borderRadius: '20px',
                    }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
