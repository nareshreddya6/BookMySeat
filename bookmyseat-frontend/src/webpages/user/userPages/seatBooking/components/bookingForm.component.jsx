import React, { useEffect, useState } from "react";
import styles from "../styles/bookingForm.module.css";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { FirstFloor } from "../../../../floorMap/components/firstFloor.component";
import { SecondFloor } from "../../../../floorMap/components/secondFloor.component";
import { ThirdFloorMap } from "../../../../floorMap/components/thirdFloor.component";
import { TerraceTrainingRoom } from "../../../../floorMap/components/terraceTrainingRoom.module";
import { MezzanineFloor } from "../../../../floorMap/components/mezzanineFloorMap.component";
import { GroundFloorMap } from "../../../../floorMap/components/groundFloorMap.component";
import Toaster from "../../../../toaster/components/toaster.component";

const BookMySeat = ({ setActiveComponent, setActiveLink, userInformation }) => {
  //Different States for all the variables
  const [formData, setFormData] = useState({
    bookingType: "",
    startDate: "",
    endDate: "",
    shift: "",
    floor: "",
    seatId: "",
    seatNumber: "",
    monitorOption: "",
    lunchOption: "",
    beveragesOption: "",
    parkingOption: "",
    parkingType: "WHEELER_2",
  });
  const [selectedBookingType, setSelectedBookingType] = useState("Daily");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [floors, setFloors] = useState([]);
  const [missingFields, setMissingFields] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mapVisibility, setMapVisibility] = useState(false);
  // console.log(selectedSeat);

  // states to manage response message modal and message
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);

  //Current Date
  const today = new Date().toISOString().split("T")[0];

  //Function to get and store floors details from server
  useEffect(() => {
    const fetchData = () => {
      const token = sessionStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .get("http://localhost:9006/bookmyseat/user/seatbooking")
        .then((response) => {
          // console.log("response", response);
          setShifts(response.data.shiftDetails);
          setFloors(response.data.floors);

          // console.log("heheh",response.data);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage(
            "Something went wrong while fetching shifts. Please try again."
          );
          // setShowModal(true);
          setShowToaster(true);
        });
    };
    fetchData();
  }, []);

  //Handling Click on bookingType buttons
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      bookingType: selectedBookingType,
    }));
  }, [selectedBookingType]);

  //Function to handle endDate based on the startDate and BookingType
  useEffect(() => {
    if (formData.bookingType && formData.startDate) {
      const calculateEndDate = (days) => {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(
          startDate.getTime() + days * 24 * 60 * 60 * 1000
        );
        return endDate.toISOString().split("T")[0];
      };

      if (formData.bookingType === "Daily") {
        setFormData((prevData) => ({
          ...prevData,
          endDate: calculateEndDate(0),
        }));
      } else if (formData.bookingType === "Weekly") {
        setFormData((prevData) => ({
          ...prevData,
          endDate: calculateEndDate(6),
        }));
      } else if (formData.bookingType === "Monthly") {
        setFormData((prevData) => ({
          ...prevData,
          endDate: calculateEndDate(29),
        }));
      }
    }
  }, [formData.bookingType, formData.startDate]);

  //Function to handle submit click and send data to server
  const handleSubmit = () => {
    setAttemptedSubmit(true);

    //Required Fields for sending Data
    const requiredFields = [
      "bookingType",
      "startDate",
      "endDate",
      "shift",
      "floor",
      "seatNumber",
      "monitorOption",
      "lunchOption",
      "beveragesOption",
      "parkingOption",
    ];

    //Checking if any missing fields
    const missingFields = requiredFields.filter((field) => !formData[field]);
    setMissingFields(missingFields);

    if (missingFields.length > 0) {
      return;
    }

    //User object to be sent as data to server
    const user = {
      bookingRange: formData.bookingType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      lunch: formData.lunchOption,
      beverage: formData.beveragesOption,
      parking: formData.parkingOption,
      vehicleType: formData.parkingType,
      additionalDesktop: formData.monitorOption,
      seatId: formData.seatId,
      shiftId: formData.shift,
    };

    if (formData.parkingOption === "true") {
      user.vehicleType = formData.parkingType;
    }

    //Setting Authorization Token  as header
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;

    //Axios req to send booking data to server
    axios
      .post("http://localhost:9006/bookmyseat/user/seatbooking", user)
      .then((res) => {
        setModalHeading("Success");
        setModalMessage(res.data);
        // setShowModal(true);
        setShowToaster(true);
        handleNavigate();
      })
      .catch((err) => {
        setModalHeading("Error");
        setModalMessage(err.response.data);
        // setShowModal(true);
        setShowToaster(true);
      });
  };

  // Function to navigate to dashboard
  const handleNavigate = () => {
    setTimeout(() => {
      setActiveComponent("/user/dashboard");
      setActiveLink("/user/dashboard");
    }, 5000);
  };

  //Function to handle changes in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Function to handle click on cancel button
  const handleCancel = () => {
    setActiveLink("/user/dashboard");
    setActiveComponent("/user/dashboard");
  };

  // Function to handle selecting a seat
  const handleSeatSelection = ({ seatNumber, seatId }) => {
    setSelectedSeat(seatId);
    setFormData((prevData) => ({
      ...prevData,
      seatNumber: seatNumber,
      seatId: seatId,
    }));
  };

  const [mapData, setMapData] = useState({
    floorId: 0,
  });

  useEffect(() => {
    setMapData((prevState) => ({
      ...prevState,
      startDate: formData.startDate,
      endDate: formData.endDate,
    }));
  }, [formData]);

  const [mapContent, setMapContent] = useState(null);
  const openMap = (floorId) => {
    const content = getMapContent(floorId);
    setMapContent(content);
    setMapVisibility(true);
  };

  // console.log(formData);

  const getMapContent = (floorId) => {
    switch (floorId) {
      case 1:
        return (
          // JSX for rendering the ground floor
          <GroundFloorMap
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            mapData={mapData}
            userInformation={userInformation}
            setMapVisibility={setMapVisibility}
          />
        );
      case 2:
        return (
          // JSX for rendering the Mezzanine floor
          <MezzanineFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            mapData={mapData}
            userInformation={userInformation}
            setMapVisibility={setMapVisibility}
          />
        );
      case 3:
        return (
          // JSX for rendering the First floor
          <FirstFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            mapData={mapData}
            userInformation={userInformation}
            setMapVisibility={setMapVisibility}
          />
        );
      case 4:
        return (
          // JSX for rendering the Second floor
          <SecondFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            mapData={mapData}
            userInformation={userInformation}
            setMapVisibility={setMapVisibility}
          />
        );
      case 5:
        return (
          <ThirdFloorMap
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            mapData={mapData}
            userInformation={userInformation}
            setMapVisibility={setMapVisibility}
          />
        );
      case 6:
        return (
          // JSX for rendering the Terrace floor
          <TerraceTrainingRoom
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            mapData={mapData}
            userInformation={userInformation}
            setMapVisibility={setMapVisibility}
          />
        );
      default:
        return null; // Return null for unrecognized floor IDs
    }
  };

  // Function to handle floor selection
  const handleFloorSelect = (floorId) => {
    // Updating formData with selected floorId
    setFormData((prevData) => ({
      ...prevData,
      floor: floorId,
    }));

    // Updating mapData with selected floorId
    setMapData((prevData) => ({
      ...prevData,
      floorId: floorId,
    }));

    // Open map if floorId is same
    if (mapData.floorId === formData.floor) {
      openMap(floorId);
    }
  };

  // Effect to open map when mapData.floorId changes
  useEffect(() => {
    openMap(mapData.floorId);
  }, [mapData.floorId]);

  return (
    <>
      <div className={styles.bookSeatContainer}>
        {/* Booking Page */}
        <div className={styles.formHeading}>
          <h3>Book Your Seat</h3>
        </div>
        <div className={styles.bookingPage}>
          <div className={styles.formDivision}>
            {/* Section for taking User input */}
            <div className={styles.formDetails}>
              {/* Section for BookingType input */}
              <div className={styles.bookingType}>
                {["Daily", "Weekly", "Monthly"].map((type) => (
                  <button
                    key={type}
                    className={`${styles.bookingTypeBtn} ${
                      selectedBookingType === type &&
                      styles.selectedBookingTypeBtn
                    }`}
                    onClick={() => setSelectedBookingType(type)}
                  >
                    {type} Booking
                  </button>
                ))}
              </div>

              {/* User input for startDate */}
              <div className={styles.selectedDates}>
                <div className={styles.startDate}>
                  <label
                    className={styles.registrationLabel}
                    htmlFor="startDate"
                  >
                    Start Date:
                  </label>
                  <input
                    className={styles.registerationInput}
                    type="date"
                    id="startDate"
                    name="startDate"
                    min={today}
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.endDate}>
                  <label className={styles.registrationLabel} htmlFor="endDate">
                    End Date:
                  </label>
                  <input
                    className={styles.registerationInput}
                    type="date"
                    id="endDate"
                    name="endDate"
                    // min={formData.endDate}
                    // max={formData.endDate}
                    value={formData.endDate}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              {/* User input for floors */}
              <div className={styles.floorSelection}>
                <div className={styles.customDropdown}>
                  <p className={styles.registrationLabel}>FloorName: </p>
                  <div
                    className={styles.selectedFloor}
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    {formData.floor
                      ? floors.find((floor) => floor.id === formData.floor)
                          .floorName
                      : "Select Floor"}
                    <ChevronDown />
                  </div>
                  {dropdownOpen && (
                    <div className={styles.dropdownList}>
                      {floors.map((floor) => (
                        <div
                          key={floor.id}
                          className={styles.dropdownItem}
                          onClick={() => {
                            handleFloorSelect(floor.id);
                            setDropdownOpen(false);
                          }}
                        >
                          {floor.floorName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User input for seats */}
                <div className={styles.selectSeat}>
                  <div className={styles.seatNumber}>
                    <label
                      className={styles.registrationLabel}
                      htmlFor="seatNumber"
                    >
                      Seat:
                    </label>
                    <input
                      className={styles.registerationInput}
                      type="text"
                      name="seatNumber"
                      id="seatNumber"
                      placeholder="Seat ID"
                      value={formData.seatNumber}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className={styles.shiftNmonitor}>
                {/* User input for Shifts */}
                <div className={styles.shiftSelection}>
                  <label htmlFor="shift" className={styles.registrationLabel}>
                    Shift Time:
                  </label>
                  <select
                    className={styles.registerationInput}
                    name="shift"
                    id="shift"
                    onChange={handleChange}
                  >
                    <option className={styles.selectOptions} value="">
                      Select Shift
                    </option>
                    {shifts.map((shift) => (
                      <option
                        className={styles.selectOptions}
                        key={shift.id}
                        value={shift.id}
                      >
                        {shift.startTime + " To " + shift.endTime}
                      </option>
                    ))}
                  </select>
                </div>

                {/* User input for Additional Desktop */}
                <div className={styles.monitorOptions}>
                  <label
                    className={styles.selectLabels}
                    htmlFor="monitorOption"
                  >
                    Monitor:
                  </label>
                  <select
                    className={styles.registerationInput}
                    name="monitorOption"
                    id="monitorOption"
                    value={formData.monitorOption}
                    onChange={handleChange}
                  >
                    <option className={styles.selectOptions} value="">
                      Select
                    </option>
                    <option className={styles.selectOptions} value="true">
                      Yes
                    </option>
                    <option className={styles.selectOptions} value="false">
                      No
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.lunchNbeverage}>
                {/* User input for Lunch */}
                <div className={styles.lunchOptions}>
                  <label className={styles.selectLabels} htmlFor="lunchOption">
                    Lunch:
                  </label>
                  <select
                    className={styles.registerationInput}
                    name="lunchOption"
                    id="lunchOption"
                    value={formData.lunchOption}
                    onChange={handleChange}
                  >
                    <option className={styles.selectOptions} value="">
                      Select
                    </option>
                    <option className={styles.selectOptions} value="true">
                      Yes
                    </option>
                    <option className={styles.selectOptions} value="false">
                      No
                    </option>
                  </select>
                </div>

                {/* User input for Beverages */}
                <div className={styles.beveragesOptions}>
                  <label
                    className={styles.selectLabels}
                    htmlFor="beveragesOption"
                  >
                    Beverages:
                  </label>
                  <select
                    className={styles.registerationInput}
                    name="beveragesOption"
                    id="beveragesOption"
                    value={formData.beveragesOption}
                    onChange={handleChange}
                  >
                    <option className={styles.selectOptions} value="">
                      Select
                    </option>
                    <option className={styles.selectOptions} value="true">
                      Yes
                    </option>
                    <option className={styles.selectOptions} value="false">
                      No
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.parking}>
                {/* User input for Parking */}
                <div className={styles.parkingOptions}>
                  <label
                    className={styles.selectLabels}
                    htmlFor="parkingOption"
                  >
                    Parking:
                  </label>
                  <select
                    className={styles.registerationInput}
                    name="parkingOption"
                    id="parkingOption"
                    value={formData.parkingOption}
                    onChange={handleChange}
                  >
                    <option className={styles.selectOptions} value="">
                      Select
                    </option>
                    <option className={styles.selectOptions} value="true">
                      Yes
                    </option>
                    <option className={styles.selectOptions} value="false">
                      No
                    </option>
                  </select>
                </div>
                {formData.parkingOption === "true" && (
                  <div className={styles.vehicleType}>
                    <label
                      className={styles.selectLabels}
                      htmlFor="parkingType"
                    >
                      Vehicle:
                    </label>
                    <select
                      className={styles.registerationInput}
                      name="parkingType"
                      id="parkingType"
                      value={formData.parkingType}
                      onChange={handleChange}
                    >
                      {/* <option value="">Select Vehicle Type</option> */}
                      <option value="WHEELER_2">2 Wheeler</option>
                      <option value="WHEELER_4">4 Wheeler</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section to display all the user Inputs */}
          <div className={styles.bookingData}>
            <div className={styles.bookingDetails}>
              <p className={styles.heading}>Booking Details</p>
              <div className={styles.validationWarning}>
                {attemptedSubmit && missingFields.length > 0 && (
                  <p>Fill all the inputs to proceed with seat booking.</p>
                )}
              </div>
              {/* Section for BookingType */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>Booking Type</div>
                <div className={styles.choosenInputValue}>
                  {formData.bookingType}
                </div>
              </div>
              {/* Section for StartDate */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>From</div>
                <div className={styles.choosenInputValue}>
                  {formData.startDate}
                </div>
              </div>
              {/* Section for endDate */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>To</div>
                <div className={styles.choosenInputValue}>
                  {formData.endDate}
                </div>
              </div>
              {/* Section for shifts */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>Shift</div>
                <div className={styles.choosenInputValue}>
                  {formData.shift &&
                    shifts.find(
                      (shift) => shift.id === parseInt(formData.shift)
                    ) && (
                      <>
                        {`${
                          shifts.find(
                            (shift) => shift.id === parseInt(formData.shift)
                          ).startTime
                        } To ${
                          shifts.find(
                            (shift) => shift.id === parseInt(formData.shift)
                          ).endTime
                        }`}
                      </>
                    )}
                </div>
              </div>
              {/* Section for Floors */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>Floor</div>
                <div className={styles.choosenInputValue}>
                  {formData.floor &&
                    floors.find(
                      (floor) => floor.id === parseInt(formData.floor)
                    ) && (
                      <>
                        {`${
                          floors.find(
                            (floor) => floor.id === parseInt(formData.floor)
                          ).floorName
                        }`}
                      </>
                    )}
                </div>
              </div>
              {/* Section for Seat */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>Seat</div>
                <div className={styles.choosenInputValue}>
                  {formData.seatNumber}
                </div>
              </div>
              {/* Section for shifts */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>Shift</div>
                <div className={styles.choosenInputValue}>
                  {formData.shift &&
                    shifts.find(
                      (shift) => shift.id === parseInt(formData.shift)
                    ) && (
                      <>
                        {`${
                          shifts.find(
                            (shift) => shift.id === parseInt(formData.shift)
                          ).startTime
                        } To ${
                          shifts.find(
                            (shift) => shift.id === parseInt(formData.shift)
                          ).endTime
                        }`}
                      </>
                    )}
                </div>
              </div>
              {/* Section for Additonal Monitor */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>Monitor</div>
                <div className={styles.choosenInputValue}>
                  {formData.monitorOption && (
                    <div>
                      {formData.monitorOption === "true" ? "Yes" : "No"}
                    </div>
                  )}
                </div>
              </div>
              {/* Section for Lunch */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>Lunch</div>
                <div className={styles.choosenInputValue}>
                  {formData.lunchOption && (
                    <div>{formData.lunchOption === "true" ? "Yes" : "No"}</div>
                  )}
                </div>
              </div>
              {/* Section for Beverages */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>Beverages</div>
                <div className={styles.choosenInputValue}>
                  {formData.beveragesOption && (
                    <div>
                      {formData.beveragesOption === "true" ? "Yes" : "No"}
                    </div>
                  )}
                </div>
              </div>
              {/* Section for Parking */}
              <div className={styles.choosenInputs}>
                <div className={styles.choosenInputLabel}>Parking</div>
                <div className={styles.choosenInputValue}>
                  {formData.parkingOption && (
                    <div>
                      {formData.parkingOption === "true"
                        ? formData.parkingType === "WHEELER_2"
                          ? "2 Wheeler"
                          : "4 Wheeler"
                        : "No"}
                    </div>
                  )}
                </div>
              </div>

              {/* Section for Buttons */}
              <div className={styles.RegisterationBtn}>
                {/* Submit Button */}
                <button
                  className={styles.registerationSubmitBtn}
                  onClick={handleSubmit}
                >
                  Book
                </button>
                {/* Cancel Button */}
                <button
                  className={styles.registerationResetBtn}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* map modal */}
          <div className={styles.mapModal}>
            {/* <button onClick={openMap}>open floor</button> */}
            {mapVisibility && mapContent}
          </div>
        </div>

        {/* Conditional Rendering of Toasrer Comp */}
        {showToaster && (
          <Toaster
            message={modalMessage}
            setShowToaster={setShowToaster}
            heading={modalHeading}
          />
        )}
      </div>
    </>
  );
};

export default BookMySeat;
