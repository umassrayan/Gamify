import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface ClassDetail {
  name: string;
  location: string;
}

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries: 'places'[] = ['places'];

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const db = getFirestore();

  const [step, setStep] = useState(1);
  const [numberOfClasses, setNumberOfClasses] = useState<number | ''>('');
  const [classDetails, setClassDetails] = useState<ClassDetail[]>([]);
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const [currentClassName, setCurrentClassName] = useState('');
  const [currentClassLocation, setCurrentClassLocation] = useState('');

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleNumberOfClassesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[1-9]\d*$/.test(value)) {
      setNumberOfClasses(value === '' ? '' : parseInt(value, 10));
    }
  };

  const goToStep2 = () => {
    if (typeof numberOfClasses === 'number' && numberOfClasses > 0) {
      setClassDetails(Array(numberOfClasses).fill({ name: '', location: '' }));
      setCurrentClassIndex(0);
      setCurrentClassName('');
      setCurrentClassLocation('');
      setStep(2);
    } else {
      alert('Please enter a valid number of classes (1 or more).');
    }
  };

  const onAutocompleteLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocompleteInstance;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        setCurrentClassLocation(place.formatted_address);
      } else if (inputRef.current) {
        setCurrentClassLocation(inputRef.current.value);
      }
    }
  }, [currentClassIndex]);

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentClassLocation(e.target.value);
  };

  useEffect(() => {
    return () => {
      autocompleteRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (step === 2 && inputRef.current) {
      inputRef.current.value = '';
      setCurrentClassLocation('');
      setCurrentClassName('');
      autocompleteRef.current = null;
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

    const updatedDetails = [...classDetails];
    updatedDetails[currentClassIndex] = { name: currentClassName, location: currentClassLocation };
    setClassDetails(updatedDetails);

    if (typeof numberOfClasses === 'number' && currentClassIndex < numberOfClasses - 1) {
      setCurrentClassIndex((prevIndex) => prevIndex + 1);
    } else {
      submitOnboardingData(updatedDetails);
    }
  };

  const handleGoBack = () => {
    if (step === 2 && currentClassIndex > 0) {
      const prevIndex = currentClassIndex - 1;
      setCurrentClassIndex(prevIndex);
      setCurrentClassName(classDetails[prevIndex]?.name || '');
      setCurrentClassLocation(classDetails[prevIndex]?.location || '');
      if (inputRef.current) inputRef.current.value = classDetails[prevIndex]?.location || '';
    } else if (step === 2 && currentClassIndex === 0) {
      setStep(1);
      setNumberOfClasses('');
      setClassDetails([]);
    }
  };

  const submitOnboardingData = async (finalClassDetails: ClassDetail[]) => {
    if (!currentUser) {
      console.error("No user logged in. Cannot save data.");
      alert("Error: You are not logged in.");
      navigate('/login');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const coursesCollectionRef = collection(userDocRef, 'courses');

      await addDoc(coursesCollectionRef, {
        onboardingComplete: true,
        classes: finalClassDetails,
      });

      console.log("Courses saved successfully.");
      navigate('/');
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      alert("There was an error saving your class info.");
    }
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
        <h1>Onboarding</h1>

        {step === 1 && (
          <>
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
          </>
        )}

        {step === 2 && typeof numberOfClasses === 'number' && (
          <>
            <h2>
              Step 2: Enter Details for Class {currentClassIndex + 1} of {numberOfClasses}
            </h2>
            <input
              type="text"
              placeholder="Class Name"
              value={currentClassName}
              onChange={(e) => setCurrentClassName(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                ref={inputRef}
                placeholder="Class Location"
                onChange={handleLocationInputChange}
                defaultValue={currentClassLocation}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />
            </Autocomplete>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleGoBack} style={buttonStyleSecondary}>Back</button>
              <button onClick={handleNextClass} style={buttonStyle}>
                {currentClassIndex < numberOfClasses - 1 ? 'Next Class' : 'Finish'}
              </button>
            </div>
          </>
        )}
      </div>
    </LoadScript>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1em',
  cursor: 'pointer',
};

const buttonStyleSecondary: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
};

export default OnboardingFlow;

