// src/FirestoreTest.tsx
import React, { useEffect, useState } from 'react';
import ClassAttendanceModule, { ClassDetails } from './ClassAttendanceModule';

const FirestoreTest = () => {
  const googleMapsApiKey = 'AIzaSyB5jOhFAYAzT5dkKGB7yPjTLXJPl_EE-dI';
  const hardcodedUserId = 'E0OfQZSolkauQXT7rRtQHhhalXD3';

  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserClass = async () => {
      try {
        const { db } = await import('./FirebaseConfig');
        const { doc, getDoc } = await import('firebase/firestore');

        const courseDocRef = doc(
          db,
          `users/${hardcodedUserId}/courses/AErLbp8O8BBLEjui87ao`
        );
        const docSnap = await getDoc(courseDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const firstClass = data.classes?.[0];
          if (firstClass?.name && firstClass?.location) {
            setClassDetails({
              id: 'cs320', // Arbitrary — just needs to be unique
              className: firstClass.name,
              address: firstClass.location,
            });
          }
        } else {
          console.warn('Course document not found.');
        }
      } catch (e) {
        console.error('Error loading class from nested user structure:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserClass();
  }, []);

  if (loading) return <p>Loading user class data...</p>;
  if (!classDetails) return <p>Class data not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Testing User Class for Shreya</h2>
      <ClassAttendanceModule
        googleMapsApiKey={googleMapsApiKey}
        userId={hardcodedUserId}
        initialClassDetails={classDetails} // ← dummy mode
      />
    </div>
  );
};

export default FirestoreTest;
