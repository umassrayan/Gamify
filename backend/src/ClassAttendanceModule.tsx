// src/ClassAttendanceModule.tsx
import React, { useState, useEffect, useCallback } from 'react';
import LocationChecker from './LocationChecker';


interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface ClassDetails {
  id: string;
  className?: string;
  address?: string;
  radius?: number;
}

interface ClassAttendanceModuleProps {
  googleMapsApiKey: string;
  userId?: string;
  classId?: string;
  initialClassDetails?: ClassDetails;
}

const ClassAttendanceModule: React.FC<ClassAttendanceModuleProps> = ({
  googleMapsApiKey,
  userId,
  classId,
  initialClassDetails,
}) => {
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loadingClass, setLoadingClass] = useState(true);
  const [classError, setClassError] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingUserLocation, setLoadingUserLocation] = useState(true);

  const [attendanceStatus, setAttendanceStatus] = useState<string | null>(null);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usingFirestore = !initialClassDetails && !!classId;

  // Fetch Class Details
  useEffect(() => {
    if (initialClassDetails) {
      setClassDetails(initialClassDetails);
      setLoadingClass(false);
      setClassError(null);
    } else if (classId) {
      const fetchClassDetailsFromFirestore = async () => {
        try {
          const { db } = await import('./FirebaseConfig');
          const { doc, getDoc } = await import('firebase/firestore');

          const classDocRef = doc(db, 'classes', classId);
          const docSnap = await getDoc(classDocRef);

          if (docSnap.exists()) {
            setClassDetails({ id: docSnap.id, ...docSnap.data() } as ClassDetails);
          } else {
            setClassError(`Class with ID '${classId}' not found.`);
          }
        } catch (err) {
          console.error(err);
          setClassError('Error loading class from Firestore.');
        } finally {
          setLoadingClass(false);
        }
      };
      fetchClassDetailsFromFirestore();
    } else {
      setClassError('No classId or initialClassDetails provided.');
      setLoadingClass(false);
    }
  }, [classId, initialClassDetails]);

  // Fetch User Location
  const fetchUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported.');
      setLoadingUserLocation(false);
      return;
    }

    setLoadingUserLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
        setLoadingUserLocation(false);
      },
      (error) => {
        setLocationError(error.message || 'Location error');
        setLoadingUserLocation(false);
      }
    );
  }, []);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  const handleProximityChange = useCallback((isWithin: boolean) => {
    setIsWithinRadius(isWithin);
  }, []);

  const handleConfirmAttendance = async () => {
    if (isAttendanceMarked || !userLocation || !classDetails) return;

    const currentUserId = userId || 'dummyUser001';
    const currentClassId = classDetails.id;

    if (!isWithinRadius) {
      alert('You must be within the radius to mark attendance.');
      return;
    }

    setIsSubmitting(true);
    setAttendanceStatus('Submitting...');

    if (!usingFirestore) {
      setTimeout(() => {
        setAttendanceStatus('DUMMY: Attendance confirmed!');
        setIsAttendanceMarked(true);
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    try {
      const { db } = await import('./FirebaseConfig');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

      const attendanceRef = doc(db, `classes/${currentClassId}/attendance`, currentUserId);
      await setDoc(attendanceRef, {
        userId: currentUserId,
        classId: currentClassId,
        timestamp: serverTimestamp(),
        locationAtCheckIn: { ...userLocation },
        className: classDetails.className || 'N/A',
      });

      setAttendanceStatus('Attendance confirmed!');
      setIsAttendanceMarked(true);
    } catch (err) {
      console.error(err);
      setAttendanceStatus('Failed to submit attendance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!googleMapsApiKey) return <p>Missing Google Maps API Key.</p>;
  if (loadingClass) return <p>Loading class info...</p>;
  if (classError) return <p>{classError}</p>;
  if (!classDetails) return <p>Class not found.</p>;

  const { className = 'Unnamed Class', address, radius = 75 } = classDetails;

  return (
    <div>
      <h3>{className} - Attendance</h3>
      <p>Location: <strong>{address}</strong> (within {radius}m)</p>
      {userId && <p>Logged in as: {userId}</p>}
      <button onClick={fetchUserLocation} disabled={loadingUserLocation}>
        {loadingUserLocation ? 'Locating...' : 'Refresh Location'}
      </button>
      {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
      {userLocation && (
        <p>Your location: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}</p>
      )}
      <LocationChecker
        apiKey={googleMapsApiKey}
        targetAddress={address || ''}
        radius={radius}
        userLocation={userLocation}
        onProximityChange={handleProximityChange}
      />
      <button onClick={handleConfirmAttendance} disabled={isSubmitting || isAttendanceMarked || !isWithinRadius}>
        {isAttendanceMarked ? 'Attendance Marked' : isSubmitting ? 'Submitting...' : 'Confirm Attendance'}
      </button>
      {attendanceStatus && <p>{attendanceStatus}</p>}
    </div>
  );
};

export default ClassAttendanceModule;

