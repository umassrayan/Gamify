import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { getFirestore, collection, addDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { style } from "framer-motion/client";

interface ClassDetail {
  name: string;
  location: string;
}

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries: "places"[] = ["places"];

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const db = getFirestore();

  const [step, setStep] = useState(1);
  const [numberOfClasses, setNumberOfClasses] = useState<number | "">("");
  const [classDetails, setClassDetails] = useState<ClassDetail[]>([]);
  const [currentClassIndex, setCurrentClassIndex] = useState(0);
  const [currentClassName, setCurrentClassName] = useState("");
  const [currentClassLocation, setCurrentClassLocation] = useState("");

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleNumberOfClassesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^[1-9]\d*$/.test(value)) {
      setNumberOfClasses(value === "" ? "" : parseInt(value, 10));
    }
  };

  const goToStep2 = () => {
    if (typeof numberOfClasses === "number" && numberOfClasses > 0) {
      setClassDetails(Array(numberOfClasses).fill({ name: "", location: "" }));
      setCurrentClassIndex(0);
      setCurrentClassName("");
      setCurrentClassLocation("");
      setStep(2);
    } else {
      alert("Please enter a valid number of classes (1 or more).");
    }
  };

  const onAutocompleteLoad = useCallback(
    (autocompleteInstance: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocompleteInstance;
    },
    []
  );

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

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentClassLocation(e.target.value);
  };

  useEffect(() => {
    return () => {
      autocompleteRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (step === 2 && inputRef.current) {
      inputRef.current.value = "";
      setCurrentClassLocation("");
      setCurrentClassName("");
      autocompleteRef.current = null;
    }
  }, [currentClassIndex, step]);

  const handleNextClass = () => {
    if (!currentClassName.trim()) {
      alert("Please enter a class name.");
      return;
    }
    if (!currentClassLocation.trim()) {
      alert("Please enter or select a location.");
      return;
    }

    const updatedDetails = [...classDetails];
    updatedDetails[currentClassIndex] = {
      name: currentClassName,
      location: currentClassLocation,
    };
    setClassDetails(updatedDetails);

    if (
      typeof numberOfClasses === "number" &&
      currentClassIndex < numberOfClasses - 1
    ) {
      setCurrentClassIndex((prevIndex) => prevIndex + 1);
    } else {
      submitOnboardingData(updatedDetails);
    }
  };

  const handleGoBack = () => {
    if (step === 2 && currentClassIndex > 0) {
      const prevIndex = currentClassIndex - 1;
      setCurrentClassIndex(prevIndex);
      setCurrentClassName(classDetails[prevIndex]?.name || "");
      setCurrentClassLocation(classDetails[prevIndex]?.location || "");
      if (inputRef.current)
        inputRef.current.value = classDetails[prevIndex]?.location || "";
    } else if (step === 2 && currentClassIndex === 0) {
      setStep(1);
      setNumberOfClasses("");
      setClassDetails([]);
    }
  };

  const submitOnboardingData = async (finalClassDetails: ClassDetail[]) => {
    if (!currentUser) {
      console.error("No user logged in. Cannot save data.");
      alert("Error: You are not logged in.");
      navigate("/login");
      return;
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const coursesCollectionRef = collection(userDocRef, "courses");

      await addDoc(coursesCollectionRef, {
        onboardingComplete: true,
        classes: finalClassDetails,
      });

      console.log("Courses saved successfully.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      alert("There was an error saving your class info.");
    }
  };

  const isDisabledStep1 = numberOfClasses === "" || numberOfClasses < 1;
  const isDisabledStep2 =
    currentClassName.trim() === "" || currentClassLocation.trim() === "";

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <div style={styles.page}>
        <div style={styles.form}>
          {/* <h2 style={styles.title}>Onboarding Step 1</h2> */}

          {step === 1 && (
            <>
              <h2 style={styles.inputText}>How many classes are you taking?</h2>
              <input
                type="number"
                value={numberOfClasses}
                onChange={handleNumberOfClassesChange}
                placeholder="e.g. 4"
                min="1"
                style={styles.input}
              />
              <button
                onClick={goToStep2}
                disabled={isDisabledStep1}
                style={{
                  padding: "0.75rem",
                  fontSize: "1rem",
                  backgroundColor: "#6E645E", // Muted brown color
                  opacity: isDisabledStep1 ? 0.5 : 1, // Adjust opacity based on disabled state
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease", // Smooth hover transition
                  marginTop: "0.5rem", // Add some space above the button}}
                }}
              >
                Next
              </button>
            </>
          )}

          {step === 2 && typeof numberOfClasses === "number" && (
            <>
              <h2 style={styles.inputText}>
                Enter Details for Class {currentClassIndex + 1} of{" "}
                {numberOfClasses}
              </h2>
              <input
                type="text"
                placeholder="Class Name"
                value={currentClassName}
                onChange={(e) => setCurrentClassName(e.target.value)}
                style={styles.input}
              />
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  ref={inputRef}
                  placeholder="Class Location"
                  onChange={handleLocationInputChange}
                  defaultValue={currentClassLocation}
                  style={styles.input}
                />
              </Autocomplete>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={handleGoBack} style={styles.button}>
                  Back
                </button>
                <button
                  onClick={handleNextClass}
                  disabled={isDisabledStep2}
                  style={{
                    padding: "0.75rem",
                    fontSize: "1rem",
                    backgroundColor: "#6E645E", // Muted brown color
                    opacity: isDisabledStep2 ? 0.5 : 1, // Adjust opacity based on disabled state
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease", // Smooth hover transition
                    marginTop: "0.5rem", // Add some space above the button}}
                  }}
                  // style={styles.button}
                >
                  {currentClassIndex < numberOfClasses - 1
                    ? "Next Class"
                    : "Finish"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </LoadScript>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F4F2", // Light beige background
  },
  form: {
    backgroundColor: "#fff", // White form background
    padding: "2rem",
    borderRadius: "10px",
    minWidth: "350px", // Ensure minimum width
    maxWidth: "500px", // Max width
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)", // Subtle shadow
    display: "flex",
    flexDirection: "column",
    gap: "1rem", // Spacing between elements
  },
  title: {
    marginBottom: "1rem",
    textAlign: "center",
    color: "#333", // Darker title color
  },
  error: {
    color: "#dc3545", // Bootstrap's danger color
    fontSize: "0.9rem",
    textAlign: "center",
    backgroundColor: "#f8d7da", // Light red background for error
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #f5c6cb",
  },
  input: {
    padding: "0.75rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box", // Include padding and border in element's total width/height
    width: "100%", // Full width for inputs
  },
  inputText: {
    fontSize: "1rem",
    fontWeight: "lighter",
  },
  button: {
    padding: "0.75rem",
    fontSize: "1rem",
    backgroundColor: "#6E645E", // Muted brown color
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s ease", // Smooth hover transition
  },

  // const buttonStyle: React.CSSProperties = {
  //   padding: "10px 15px",
  //   backgroundColor: "#007bff",
  //   color: "#fff",
  //   border: "none",
  //   borderRadius: "4px",
  //   fontSize: "1em",
  //   cursor: "pointer",
  // };

  // const buttonStyleSecondary: React.CSSProperties = {
  //   ...buttonStyle,
  //   backgroundColor: "#6c757d",
};

export default OnboardingFlow;
