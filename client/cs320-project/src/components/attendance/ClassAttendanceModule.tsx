// src/ClassAttendanceModule.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { useAuth } from "../../context/AuthContext.tsx"; // Import useAuth (adjust path)
import "./Class.css";
// Firestore imports (as before)
import LocationChecker from "./LocationChecker";

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
  // userId and classId are no longer needed as props if fetched internally
  initialClassDetails?: ClassDetails; // Keep for override/non-Firestore mode
}

const ClassAttendanceModule: React.FC<ClassAttendanceModuleProps> = ({
  googleMapsApiKey,
  initialClassDetails,
}) => {
  // --- Get classId from URL params ---
  const { id: classIdFromParams } = useParams<{ id: string }>(); // 'id' or your param name

  // --- Get currentUser from AuthContext ---
  const { currentUser, loading: authLoading } = useAuth();
  const userIdFromAuth = currentUser?.uid;

  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loadingClass, setLoadingClass] = useState<boolean>(true);
  const [classError, setClassError] = useState<string | null>(null);

  // ... (other states: userLocation, isWithinRadius, etc. remain the same) ...
  const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
  const [isWithinRadius, setIsWithinRadius] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingUserLocation, setLoadingUserLocation] = useState<boolean>(true);

  const [attendanceStatus, setAttendanceStatus] = useState<string | null>(null);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Determine effective classId and userId
  const effectiveClassId = initialClassDetails
    ? initialClassDetails.id
    : classIdFromParams;
  const effectiveUserId = userIdFromAuth; // Can also be overridden by initialClassDetails if you add it there

  const usingFirestore =
    !initialClassDetails && !!effectiveClassId && !!effectiveUserId;

  const [parentCourseDocId, setParentCourseDocId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (authLoading) {
      // Wait for auth state to resolve
      setLoadingClass(true);
      return;
    }

    if (initialClassDetails) {
      setClassDetails(initialClassDetails);
      setLoadingClass(false);
      setClassError(null);
      setParentCourseDocId(null); // Clear parent ID if using dummy data
    } else if (classIdFromParams && userIdFromAuth) {
      const fetchClassDetailsFromFirestore = async () => {
        setLoadingClass(true);
        setClassError(null);
        setParentCourseDocId(null); // Reset
        let foundClassDetails: ClassDetails | null = null;
        let foundParentCourseId: string | null = null;

        try {
          const { db } = await import("./FirebaseConfig"); // Adjust path
          // Renamed to avoid conflict if you also import 'collection' for attendance saving
          const {
            collection: firestoreCollectionFetcher,
            getDocs: firestoreGetDocsFetcher,
          } = await import("firebase/firestore");

          const coursesCollectionRef = firestoreCollectionFetcher(
            db,
            "users",
            userIdFromAuth,
            "courses"
          );
          const courseSnapshots = await firestoreGetDocsFetcher(
            coursesCollectionRef
          );

          for (const courseDoc of courseSnapshots.docs) {
            const courseData = courseDoc.data();
            // Check if courseData.classes exists and is an array
            if (courseData.classes && Array.isArray(courseData.classes)) {
              const targetClassItem = courseData.classes.find(
                (c: any) => c.name === classIdFromParams // c: any for simplicity, ideally define CourseClass type here too
              );

              if (targetClassItem) {
                // Ensure your 'targetClassItem' has these fields in Firestore
                foundClassDetails = {
                  id: classIdFromParams, // The class_code from URL is the ID for this specific session
                  className: targetClassItem.name, // The descriptive name
                  address: targetClassItem.location, // The location string
                  radius: targetClassItem.radius || 150, // EXPECTS 'radius' in this object in Firestore
                };
                foundParentCourseId = courseDoc.id; // Store the parent course document's ID
                break; // Found the class, exit loop
              }
            }
          }

          if (foundClassDetails) {
            setClassDetails(foundClassDetails);
            setParentCourseDocId(foundParentCourseId);
          } else {
            setClassError(
              `Class with code '${classIdFromParams}' not found within any of your registered courses.`
            );
          }
        } catch (err) {
          console.error("Error fetching class details from Firestore:", err);
          setClassError(
            "Failed to load class details. Check Firestore structure and permissions."
          );
        } finally {
          setLoadingClass(false);
        }
      };
      fetchClassDetailsFromFirestore();
    } else {
      if (!authLoading && !userIdFromAuth) {
        setClassError("User not authenticated. Cannot load class details.");
      } else if (!classIdFromParams) {
        setClassError("Class ID not found in URL.");
      }
      setLoadingClass(false);
    }
  }, [classIdFromParams, userIdFromAuth, initialClassDetails, authLoading]); // Dependencies

  // 2. Check for Existing Attendance
  useEffect(() => {
    if (authLoading || !effectiveUserId || !effectiveClassId || !classDetails) {
      // If not using Firestore via initialClassDetails, simulate no prior attendance
      if (initialClassDetails && !usingFirestore) {
        setIsAttendanceMarked(false);
        setAttendanceStatus(null);
      }
      return;
    }

    if (!usingFirestore) return; // Already handled above for initialClassDetails

    const checkExistingAttendanceFirestore = async () => {
      try {
        const { db } = await import("./FirebaseConfig"); // Adjust path
        const { collection, query, where, getDocs } = await import(
          "firebase/firestore"
        );
        // Path for checking attendance
        const attendanceCollectionRef = collection(
          db,
          `users/${effectiveUserId}/courses/${effectiveClassId}/attendance`
        );
        const q = query(
          attendanceCollectionRef,
          where("userId", "==", effectiveUserId)
        ); // or check against doc ID if it's userId

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // ... (same logic as before)
          const latestAttendance = querySnapshot.docs[0].data(); // Assuming latest is first or only one
          const attendanceTime = latestAttendance.timestamp?.toDate();
          setIsAttendanceMarked(true);
          setAttendanceStatus(
            `Attendance marked on ${
              attendanceTime ? attendanceTime.toLocaleString() : "record found"
            }.`
          );
        } else {
          setIsAttendanceMarked(false);
          setAttendanceStatus(null);
        }
      } catch (error) {
        /* ... */
      }
    };
    checkExistingAttendanceFirestore();
  }, [
    effectiveUserId,
    effectiveClassId,
    classDetails,
    usingFirestore,
    authLoading,
  ]);

  // 3. Fetch User's Current Location (fetchUserLocation useCallback, no change in its internal logic)
  const fetchUserLocation = useCallback(() => {
    // ... (same as before)
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
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
        // ... error handling ...
        setLoadingUserLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (!authLoading) {
      // Only fetch location once auth state is known
      fetchUserLocation();
    }
  }, [fetchUserLocation, authLoading]);

  // 4. Handle Proximity Change (handleProximityChange, no change)
  const handleProximityChange = useCallback((isWithin: boolean) => {
    setIsWithinRadius(isWithin);
  }, []);

  // 5. Handle Confirm Attendance Button Click
  const handleConfirmAttendance = async () => {
    // Uses effectiveClassId and effectiveUserId obtained internally
    if (!effectiveClassId || !effectiveUserId || !userLocation) {
      setAttendanceStatus(
        "Error: Class details, user ID, or your location is missing."
      );
      return;
    }
    // ... (rest of the logic is similar, using effectiveClassId and effectiveUserId)

    if (!usingFirestore) {
      // DUMMY data logic (if initialClassDetails is used)
      console.log("DUMMY MODE: Simulating attendance for:", {
        userId: effectiveUserId, // This would be userIdFromAuth or from dummy details
        classId: effectiveClassId,
        // ...
      });
      // ...
      return;
    }

    // Actual Firestore Submission
    setIsSubmitting(true);
    setAttendanceStatus("Submitting attendance...");
    try {
      const { db } = await import("./FirebaseConfig"); // Adjust path
      const { doc, setDoc, serverTimestamp } = await import(
        "firebase/firestore"
      );

      // Path uses internally sourced effectiveUserId and effectiveClassId
      const attendanceDocRef = doc(
        db,
        `users/${effectiveUserId}/courses/${effectiveClassId}/attendance`,
        effectiveUserId
      );

      await setDoc(
        attendanceDocRef,
        {
          userId: effectiveUserId,
          timestamp: serverTimestamp(),
          locationAtCheckIn: { ...userLocation },
          className: classDetails?.className || "N/A",
          classId: effectiveClassId,
        },
        { merge: true }
      );
      setAttendanceStatus(
        `Attendance confirmed for ${classDetails?.className || "this class"}!`
      );
      setIsAttendanceMarked(true);
    } catch (error) {
      console.error("Error submitting attendance to Firestore: ", error);
      setAttendanceStatus("Failed to submit attendance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---
  if (!googleMapsApiKey)
    return (
      <p className="error-message">Google Maps API Key is not provided.</p>
    );
  if (authLoading || loadingClass)
    return <p className="loading-message">Loading attendance information...</p>;

  // Handle cases where essential IDs are missing after loading
  if (!effectiveUserId)
    return <p className="error-message">User not authenticated.</p>;
  if (!initialClassDetails && !classIdFromParams)
    return <p className="error-message">Class ID not available.</p>;

  if (classError)
    return <p className="error-message">Class Error: {classError}</p>;
  if (!classDetails && !initialClassDetails)
    return <p className="error-message">Class details could not be loaded.</p>;

  // Use classDetails (fetched) or initialClassDetails (passed as prop)
  const currentClassDisplayDetails = classDetails || initialClassDetails;
  if (!currentClassDisplayDetails)
    return <p className="error-message">No class details to display.</p>;

  const {
    className = "Unnamed Class",
    address,
    radius = 75,
  } = currentClassDisplayDetails;

  // ... (rest of the render logic remains largely the same, using 'className', 'address', 'radius')
  // It will use `effectiveUserId` for display messages if needed.

  return (
    <div className="class-attendance-module" style={{ border: "none" }}>
      {/* ... other JSX ... */}
      <div className="map-container" style={{ marginBottom: "20px" }}>
        {/* Added wrapper for map */}
        <LocationChecker
          apiKey={googleMapsApiKey}
          targetAddress={address || ""} // Ensure address is not undefined
          radius={radius}
          userLocation={userLocation}
          onProximityChange={handleProximityChange}
        />
      </div>
      {/* Refresh Location Button */}
      <button
        onClick={fetchUserLocation}
        disabled={loadingUserLocation || isSubmitting}
        className="secondary-button"
        style={{
          position: "absolute",
          marginTop: "-550px",
          marginLeft: "-65px",
          backgroundColor: "#E0E0E0",
          border: "none",
        }}
      >
        {loadingUserLocation ? "Refreshing..." : "Refresh Location"}
      </button>
      {/* Confirm Attendance Button */}
      <button
        className="attendance-button"
        onClick={handleConfirmAttendance}
        disabled={isSubmitting || isAttendanceMarked || !isWithinRadius}
        style={{
          position: "absolute",
          marginTop: "-85px",
          marginLeft: "45px",
        }}
      >
        {isAttendanceMarked
          ? "Attendance Marked"
          : isSubmitting
          ? "Submitting..."
          : "Confirm Attendance"}
      </button>
      {/* {attendanceStatus && <p>{attendanceStatus}</p>} */}
    </div>
    // </div>
  );
};

export default ClassAttendanceModule;
