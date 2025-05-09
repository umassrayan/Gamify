// src/ClassAttendanceModule.tsx
import React, { useState, useEffect, useCallback } from 'react';
// Firestore imports are no longer strictly needed if only using dummy data,
// but kept for when you switch back.
// import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
// import { db } from './firebaseConfig'; // Kept for future use
import LocationChecker from './LocationChecker';

interface LatLngLiteral {
    lat: number;
    lng: number;
}

export interface ClassDetails {
    // Exporting for use in App.tsx for dummy data
    id: string;
    className?: string;
    address?: string;
    radius?: number;
}

interface ClassAttendanceModuleProps {
    googleMapsApiKey: string;
    userId?: string; // Optional: ID of the logged-in user

    // Option 1: For Firestore-driven data
    classId?: string; // Make optional if initialClassDetails is primary for dummy mode

    // Option 2: For hardcoded dummy data
    initialClassDetails?: ClassDetails;
}

const ClassAttendanceModule: React.FC<ClassAttendanceModuleProps> = ({
    googleMapsApiKey,
    userId,
    classId, // Used if initialClassDetails is not provided
    initialClassDetails, // New prop for dummy data
}) => {
    const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
    const [loadingClass, setLoadingClass] = useState<boolean>(true);
    const [classError, setClassError] = useState<string | null>(null);

    const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
    const [isWithinRadius, setIsWithinRadius] = useState<boolean>(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [loadingUserLocation, setLoadingUserLocation] = useState<boolean>(true);

    const [attendanceStatus, setAttendanceStatus] = useState<string | null>(null);
    const [isAttendanceMarked, setIsAttendanceMarked] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const usingFirestore = !initialClassDetails && !!classId; // Determine if we should use Firestore

    // 1. Set or Fetch Class Details
    useEffect(() => {
        if (initialClassDetails) {
            setClassDetails(initialClassDetails);
            setLoadingClass(false);
            setClassError(null);
        } else if (classId) {
            // This part remains for when you want to use Firebase
            // For now, it needs `db` to be defined from firebaseConfig.
            // If `db` is not set up, this will error.
            // You might want to conditionally import/use `db` or ensure firebaseConfig is robust.
            const fetchClassDetailsFromFirestore = async () => {
                setLoadingClass(true);
                setClassError(null);
                try {
                    // Dynamically import Firestore and db if needed, or handle potential undefined db
                    const { db } = await import('./FirebaseConfig');
                    const { doc, getDoc } = await import('firebase/firestore');

                    const classDocRef = doc(db, 'classes', classId);
                    const docSnap = await getDoc(classDocRef);
                    if (docSnap.exists()) {
                        setClassDetails({ id: docSnap.id, ...docSnap.data() } as ClassDetails);
                    } else {
                        setClassError(`Class with ID '${classId}' not found in Firestore.`);
                    }
                } catch (err) {
                    console.error('Error fetching class details from Firestore:', err);
                    setClassError('Failed to load class details. Is Firebase configured and running?');
                } finally {
                    setLoadingClass(false);
                }
            };
            fetchClassDetailsFromFirestore();
        } else {
            setClassError('No classId or initialClassDetails provided to the module.');
            setLoadingClass(false);
        }
    }, [classId, initialClassDetails]);

    // 2. Check for Existing Attendance (Simulated for dummy data)
    useEffect(() => {
        if (!usingFirestore) {
            // Simulate no prior attendance for dummy data, or you could add a dummy check
            setIsAttendanceMarked(false);
            setAttendanceStatus(null);
            return;
        }

        if (!userId || !classId || !classDetails) {
            setIsAttendanceMarked(false);
            return;
        }
        // Firestore logic for checking attendance (keep for future use)
        const checkExistingAttendanceFirestore = async () => {
            try {
                const { db } = await import('./FirebaseConfig');
                const { collection, query, where, getDocs } = await import('firebase/firestore');
                const attendanceCollectionRef = collection(db, `classes/${classId}/attendance`);
                const q = query(attendanceCollectionRef, where('userId', '==', userId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const latestAttendance = querySnapshot.docs[0].data();
                    const attendanceTime = latestAttendance.timestamp?.toDate();
                    setIsAttendanceMarked(true);
                    setAttendanceStatus(`Attendance marked on ${attendanceTime ? attendanceTime.toLocaleString() : 'record found'}.`);
                } else {
                    setIsAttendanceMarked(false);
                    setAttendanceStatus(null);
                }
            } catch (error) {
                console.error('Error checking existing attendance (Firestore):', error);
                setAttendanceStatus('Could not verify prior attendance.');
            }
        };
        checkExistingAttendanceFirestore();
    }, [userId, classId, classDetails, usingFirestore]);

    // 3. Fetch User's Current Location (No changes here)
    const fetchUserLocation = useCallback(() => {
        // ... (same as before)
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            setLoadingUserLocation(false);
            setIsWithinRadius(false);
            return;
        }
        setLoadingUserLocation(true);
        setLocationError(null);
        setAttendanceStatus(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLoadingUserLocation(false);
            },
            (error) => {
                console.error('Error getting user location:', error);
                let errMsg = 'Failed to retrieve location.';
                if (error.code === error.PERMISSION_DENIED) errMsg = 'Location permission denied. Please enable location services in your browser/OS settings.';
                else if (error.code === error.POSITION_UNAVAILABLE) errMsg = 'Location information is currently unavailable. Please try again later.';
                else if (error.code === error.TIMEOUT) errMsg = 'The request to get user location timed out. Please try again.';
                setLocationError(errMsg);
                setIsWithinRadius(false);
                setLoadingUserLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
    }, []);

    useEffect(() => {
        fetchUserLocation();
    }, [fetchUserLocation]);

    // 4. Handle Proximity Change from LocationChecker (No changes here)
    const handleProximityChange = useCallback((isWithin: boolean) => {
        setIsWithinRadius(isWithin);
    }, []);

    // 5. Handle Confirm Attendance Button Click (Modified for dummy data)
    const handleConfirmAttendance = async () => {
        const currentClassId = initialClassDetails ? initialClassDetails.id : classId;

        if (!currentClassId || !userLocation) {
            setAttendanceStatus('Error: Class details or your location is missing.');
            return;
        }
        // For dummy data, we can use a placeholder userId if not provided
        const currentUserId = userId || 'dummyUser001';

        if (isAttendanceMarked) {
            setAttendanceStatus('You have already marked attendance for this session.');
            return;
        }
        if (!isWithinRadius) {
            setAttendanceStatus('You are not within the required radius to mark attendance.');
            alert('You must be within the designated area to mark attendance.');
            return;
        }

        setIsSubmitting(true);
        setAttendanceStatus('Submitting attendance...');

        if (!usingFirestore) {
            // Using DUMMY data
            console.log('DUMMY MODE: Simulating attendance submission for:', {
                userId: currentUserId,
                classId: currentClassId,
                locationAtCheckIn: { ...userLocation },
                className: classDetails?.className || 'N/A',
                timestamp: new Date().toISOString(),
            });
            // Simulate network delay
            setTimeout(() => {
                setAttendanceStatus(`DUMMY: Attendance confirmed for ${classDetails?.className || 'this class'}!`);
                setIsAttendanceMarked(true);
                setIsSubmitting(false);
                alert('DUMMY: Attendance Confirmed!');
            }, 1000);
            return;
        }

        // ---- Actual Firestore Submission (if not using dummy data) ----
        try {
            const { db } = await import('./FirebaseConfig');
            const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

            const attendanceDocRef = doc(db, `classes/${currentClassId}/attendance`, currentUserId);
            await setDoc(
                attendanceDocRef,
                {
                    userId: currentUserId,
                    timestamp: serverTimestamp(),
                    locationAtCheckIn: { ...userLocation },
                    className: classDetails?.className || 'N/A',
                    classId: currentClassId,
                },
                { merge: true },
            );

            setAttendanceStatus(`Attendance confirmed for ${classDetails?.className || 'this class'}!`);
            setIsAttendanceMarked(true);
            console.log('Attendance data sent to Firestore for user:', currentUserId);
        } catch (error) {
            console.error('Error submitting attendance to Firestore: ', error);
            setAttendanceStatus('Failed to submit attendance. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Logic (mostly the same) ---
    if (!googleMapsApiKey) return <p className="error-message">Google Maps API Key is not provided to the attendance module.</p>;
    if (loadingClass) return <p className="loading-message">Loading class information...</p>;
    if (classError) return <p className="error-message">Class Error: {classError}</p>;
    if (!classDetails) return <p className="error-message">Class details could not be loaded.</p>;

    const { className = 'Unnamed Class', address, radius = 75 } = classDetails;

    if (!address) {
        // Assuming LocationChecker needs address
        return (
            <div className="class-attendance-module">
                <h3>{className} - Attendance</h3>
                <p className="warning-message">Location address is not configured for this class.</p>
            </div>
        );
    }

    const actionButtonDisabled = isSubmitting || loadingUserLocation || !!locationError || !isWithinRadius || isAttendanceMarked;
    const effectiveUserId = userId || (initialClassDetails ? 'dummyUser001' : undefined);

    return (
        <div className="class-attendance-module">
            <h3>
                {className} - Attendance Check-in {initialClassDetails ? '(Dummy Data Mode)' : ''}
            </h3>
            <p>
                Required Location: <strong>{address}</strong> (within {radius}m).
            </p>
            {effectiveUserId && <p className="info-message">Checking in as: User {effectiveUserId}</p>}
            {!effectiveUserId && !initialClassDetails && <p className="warning-message">User ID not provided. Attendance cannot be saved to Firestore.</p>}

            <div className="controls">
                <button onClick={fetchUserLocation} disabled={loadingUserLocation || isSubmitting}>
                    {loadingUserLocation ? 'Refreshing Location...' : 'Refresh My Location'}
                </button>
            </div>

            {loadingUserLocation && <p className="status-message">Getting your location...</p>}
            {locationError && <p className="error-message">Location Error: {locationError}</p>}
            {!loadingUserLocation && !locationError && userLocation && (
                <p className="status-message">
                    Your current location: Lat: {userLocation.lat.toFixed(5)}, Lng: {userLocation.lng.toFixed(5)}
                </p>
            )}
            {!loadingUserLocation && !locationError && (
                <p className={`status-message proximity-status ${isWithinRadius ? 'in-radius' : 'out-radius'}`}>
                    Proximity Status: You are currently <strong>{isWithinRadius ? 'INSIDE' : 'OUTSIDE'}</strong> the designated radius.
                </p>
            )}

            <LocationChecker apiKey={googleMapsApiKey} targetAddress={address} radius={radius} userLocation={userLocation} onProximityChange={handleProximityChange} />

            <div className="controls" style={{ marginTop: '20px' }}>
                <button
                    onClick={handleConfirmAttendance}
                    disabled={actionButtonDisabled || (!effectiveUserId && !initialClassDetails)}
                    title={
                        !effectiveUserId && !initialClassDetails
                            ? 'User ID is required to confirm attendance'
                            : isAttendanceMarked
                            ? 'Attendance already marked'
                            : isWithinRadius
                            ? 'Confirm your attendance'
                            : 'Move into the radius to enable'
                    }
                >
                    {isSubmitting ? 'Submitting...' : isAttendanceMarked ? 'Attendance Marked' : 'Confirm My Attendance'}
                </button>
                {attendanceStatus && <p className={`status-message ${isAttendanceMarked ? 'success-message' : isSubmitting ? '' : 'info-message'}`}>{attendanceStatus}</p>}

                {actionButtonDisabled && !isAttendanceMarked && !isSubmitting && !loadingUserLocation && (
                    <p className="info-message small-text">
                        {!effectiveUserId && !initialClassDetails ? 'User ID needed. ' : ''}
                        {!isWithinRadius ? 'Must be inside radius. ' : ''}
                        {locationError ? 'Fix location error. ' : ''}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ClassAttendanceModule;
