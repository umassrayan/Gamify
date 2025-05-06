// src/components/OnboardingFlow.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
// Comment out Firestore imports until needed
// import { getFirestore, doc, setDoc } from 'firebase/firestore';
// import { useAuth } from './AuthContext'; // Assuming you have an Auth context to get the user UID

// Define the structure for class details
interface ClassDetail {
    name: string;
    location: string;
    // You might add more fields like placeId from Google Maps if needed
    // placeId?: string;
}

// --- IMPORTANT: Replace with your actual Google Maps API Key ---
// Ensure this key is secured, ideally using environment variables.
const Maps_API_KEY = 'AIzaSyB5jOhFAYAzT5dkKGB7yPjTLXJPl_EE-dI';
const libraries: 'places'[] = ['places']; // Specify Places library

const OnboardingFlow: React.FC = () => {
    const navigate = useNavigate();
    // Comment out Firebase related hooks/setup until needed
    // const { currentUser } = useAuth(); // Get current user from your Auth context
    // const db = getFirestore();

    const [step, setStep] = useState<number>(1); // 1: Ask number of classes, 2: Ask class details
    const [numberOfClasses, setNumberOfClasses] = useState<number | ''>('');
    const [classDetails, setClassDetails] = useState<ClassDetail[]>([]);
    const [currentClassIndex, setCurrentClassIndex] = useState<number>(0); // Track which class we are editing

    // State for the current class being edited in step 2
    const [currentClassName, setCurrentClassName] = useState<string>('');
    const [currentClassLocation, setCurrentClassLocation] = useState<string>('');

    // Ref for Google Maps Autocomplete instance
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null); // Ref for the location input field

    // --- Step 1 Logic ---
    const handleNumberOfClassesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty string or positive integers
        if (value === '' || /^[1-9]\d*$/.test(value)) {
            setNumberOfClasses(value === '' ? '' : parseInt(value, 10));
        }
    };

    const goToStep2 = () => {
        if (typeof numberOfClasses === 'number' && numberOfClasses > 0) {
            // Initialize classDetails array with empty objects
            setClassDetails(Array(numberOfClasses).fill({ name: '', location: '' }));
            setCurrentClassIndex(0); // Start with the first class
            setCurrentClassName(''); // Reset fields for the first class
            setCurrentClassLocation('');
            setStep(2);
        } else {
            alert('Please enter a valid number of classes (1 or more).');
        }
    };

    // --- Step 2 Logic ---
    const handleClassNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentClassName(e.target.value);
    };

    // Autocomplete Load Handler
    const onAutocompleteLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocompleteInstance;
        // Set bounds or options if needed
        // autocompleteRef.current.setFields(["address_components", "formatted_address", "geometry", "name", "place_id"]);
        // console.log("Autocomplete loaded");
    }, []);

    // Autocomplete Place Changed Handler
    const onPlaceChanged = useCallback(() => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.formatted_address) {
                // console.log("Place selected:", place);
                setCurrentClassLocation(place.formatted_address);
                // You could also store place.name or place.place_id if needed
                // setClassDetails(prev => {
                //     const updatedDetails = [...prev];
                //     updatedDetails[currentClassIndex] = { ...updatedDetails[currentClassIndex], placeId: place.place_id };
                //     return updatedDetails;
                // });
            } else if (inputRef.current) {
                // Handle case where user types but doesn't select a suggestion
                // Use the raw input value
                // console.log("No place selected, using input value:", inputRef.current.value);
                setCurrentClassLocation(inputRef.current.value);
            }
        } else {
            console.error('Autocomplete instance not available');
        }
    }, [currentClassIndex]);

    // Handle manual input change for location (if user types without selecting)
    const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentClassLocation(e.target.value);
        // If user clears the input after selecting a place, we might want to clear stored place details
    };

    // Clear autocomplete instance when component unmounts or input is hidden
    useEffect(() => {
        return () => {
            // console.log("Cleaning up autocomplete ref");
            autocompleteRef.current = null;
        };
    }, []);

    // Reset location input when moving to the next class
    useEffect(() => {
        if (step === 2 && inputRef.current) {
            inputRef.current.value = ''; // Clear the input field visually
            setCurrentClassLocation(''); // Clear the state value
            setCurrentClassName(''); // Clear the class name
            autocompleteRef.current = null; // Might need to re-init or ensure it clears
        }
    }, [currentClassIndex, step]);

    const handleNextClass = () => {
        if (!currentClassName.trim()) {
            alert('Please enter a class name.');
            return;
        }
        if (!currentClassLocation.trim()) {
            alert('Please enter or select a location.');
            return;
        }

        // Save the current class details
        const updatedDetails = [...classDetails];
        updatedDetails[currentClassIndex] = { name: currentClassName, location: currentClassLocation };
        setClassDetails(updatedDetails);

        // Move to the next class or finish
        if (typeof numberOfClasses === 'number' && currentClassIndex < numberOfClasses - 1) {
            setCurrentClassIndex((prevIndex) => prevIndex + 1);
            // Reset fields for the next class (handled by useEffect)
        } else {
            // This was the last class, proceed to finish/submit
            console.log('All class details collected:', updatedDetails); // Log final data before potential submit
            submitOnboardingData(updatedDetails); // Pass the final data
        }
    };

    const handleGoBack = () => {
        if (step === 2 && currentClassIndex > 0) {
            // Save current state before going back? Optional.
            // For simplicity, we just move back and load the previous state.
            const prevIndex = currentClassIndex - 1;
            setCurrentClassIndex(prevIndex);
            setCurrentClassName(classDetails[prevIndex]?.name || '');
            setCurrentClassLocation(classDetails[prevIndex]?.location || '');
            if (inputRef.current) inputRef.current.value = classDetails[prevIndex]?.location || ''; // Update input visually
        } else if (step === 2 && currentClassIndex === 0) {
            // Go back to step 1
            setStep(1);
            setNumberOfClasses('');
            setClassDetails([]);
        }
    };

    // --- Submission Logic ---
    const submitOnboardingData = async (finalClassDetails: ClassDetail[]) => {
        console.log('Preparing to submit data:', finalClassDetails);

        // --- Firestore Submission (Commented Out) ---
        /*
        if (!currentUser) {
            console.error("No user logged in. Cannot save data.");
            alert("Error: You are not logged in. Please sign in again.");
            navigate('/login'); // Or signup
            return;
        }

        if (!db) {
             console.error("Firestore instance not available.");
             alert("Error: Database connection failed.");
             return;
        }

        try {
            const userDocRef = doc(db, 'userProfiles', currentUser.uid); // Example path: 'userProfiles/{userId}'
            console.log(`Attempting to set data for user ${currentUser.uid} at path userProfiles/${currentUser.uid}`);

            // Using setDoc with merge: true adds/updates the 'classes' field
            // without overwriting other potential fields in the user's profile.
            await setDoc(userDocRef, {
                classes: finalClassDetails, // Store the array under a 'classes' field
                onboardingComplete: true    // Mark onboarding as done
             }, { merge: true });           // Use merge: true !

            console.log("Onboarding data saved successfully for user:", currentUser.uid);
            navigate('/dashboard'); // Navigate to dashboard on success

        } catch (error) {
            console.error("Error saving onboarding data to Firestore:", error);
            alert("There was an error saving your information. Please try again.");
            // Decide if the user should stay on the onboarding page or be redirected
        }
        */
        // --- End Firestore Submission ---

        // For now, just navigate to dashboard after logging data
        console.log('Firestore submission is commented out. Navigating to dashboard.');
        navigate('/');
    };

    // --- Render Logic ---
    return (
        <LoadScript googleMapsApiKey={Maps_API_KEY} libraries={libraries}>
            <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
                <h1>Onboarding</h1>

                {step === 1 && (
                    <div>
                        <h2>Step 1: How many classes are you taking?</h2>
                        <input
                            type="number"
                            value={numberOfClasses}
                            onChange={handleNumberOfClassesChange}
                            placeholder="e.g., 4"
                            min="1"
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                        <button onClick={goToStep2} disabled={!numberOfClasses || numberOfClasses <= 0} style={buttonStyle}>
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && typeof numberOfClasses === 'number' && (
                    <div>
                        <h2>
                            Step 2: Enter Details for Class {currentClassIndex + 1} of {numberOfClasses}
                        </h2>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="className">Class Name:</label>
                            <input
                                id="className"
                                type="text"
                                value={currentClassName}
                                onChange={handleClassNameChange}
                                placeholder="e.g., Introduction to Programming"
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="classLocation">Class Location:</label>
                            <Autocomplete
                                onLoad={onAutocompleteLoad}
                                onPlaceChanged={onPlaceChanged}
                                // options={{ /* types: ['establishment'], componentRestrictions: { country: "us" } */ }} // Optional: Restrict search
                            >
                                <input
                                    id="classLocation"
                                    type="text"
                                    ref={inputRef} // Assign ref to the input
                                    placeholder="Type address or building name"
                                    onChange={handleLocationInputChange} // Handle manual typing
                                    defaultValue={currentClassLocation} // Set initial value if navigating back
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </Autocomplete>
                            <small>Start typing, select a suggestion.</small>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleGoBack} style={buttonStyleSecondary}>
                                Back
                            </button>
                            <button onClick={handleNextClass} style={buttonStyle}>
                                {currentClassIndex < numberOfClasses - 1 ? 'Next Class' : 'Finish Onboarding'}
                            </button>
                        </div>
                    </div>
                )}
                {/* Simple loading/error state for API key issues */}
                {!Maps_API_KEY && <p style={{ color: 'red' }}>Error: Google Maps API Key is missing.</p>}
            </div>
        </LoadScript>
    );
};

// Basic styles (optional)
const buttonStyle: React.CSSProperties = {
    padding: '10px 15px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1em',
};
const buttonStyleSecondary: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
};

export default OnboardingFlow;
