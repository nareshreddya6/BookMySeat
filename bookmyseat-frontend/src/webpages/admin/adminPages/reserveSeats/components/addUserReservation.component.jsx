import styles from "../styles/addUserReservation.module.css";
import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GroundFloorMap } from "../../../../floorMap/components/groundFloorMap.component";
import { MezzanineFloor } from "../../../../floorMap/components/mezzanineFloorMap.component";
import { FirstFloor } from "../../../../floorMap/components/firstFloor.component";
import { SecondFloor } from "../../../../floorMap/components/secondFloor.component";
import { ThirdFloorMap } from "../../../../floorMap/components/thirdFloor.component";
import { TerraceTrainingRoom } from "../../../../floorMap/components/terraceTrainingRoom.module";
import axios from "axios";
import ReserveSeatModal from "./reserveSeatModal.component";
import UserList from "./userList.component";
import Toaster from "../../../../toaster/components/toaster.component";

export const AddUserReservation = () => {
  // state to handle map visibility
  const [mapVisibility, setMapVisibility] = useState(false);
  // state to store selected seat from map
  const [selectedSeat, setSelectedSeat] = useState(null);
  // state to store floor
  const [floors, setFloors] = useState();
  // state to store searched Query
  const [searchQuery, setSearchQuery] = useState("");
  // state to store custom dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // state to store selected floor
  const [selectedFloor, setSelectedFloor] = useState(null);
  // state containg all user data
  const [userData, setUserData] = useState([]);
  // state to store selected/input User details
  const [selectedUser, setSelectedUser] = useState();
  // state to store map content
  const [mapContent, setMapContent] = useState(null);
  // state to store Error messages
  const [error, setError] = useState("");

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // states to manage response message modal and meaasge for reservation from admins side
  const [reserveModalMessage, serReserveModalMessage] = useState("");
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveModalHeading, setReserveModalHeading] = useState("");
  // state to store current page index - for pagination purpose
  const [currentPage, setCurrentPage] = useState(1);

  // getting token from localstorage
  const token = sessionStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = token;
  //Function to get and store floors details from server
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:9006/bookmyseat/admin/floors")
        .then((response) => {
          setFloors(response.data);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage("Error fetching floor Details. Please try again.");
          setShowToaster(true);
        });
    };
    fetchData();
  }, []);

  // function to get and store details of users
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:9006/bookmyseat/admin/users")
        .then((response) => {
          const data = response.data.users;
          setUserData(data);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage("Something went Wrong. Please try again.");
          setShowToaster(true);
        });
    };
    fetchData();
  }, []);

  // function to save user seat restriction details to server
  const saveReservedSeat = () => {
    const postData = {
      userId: selectedUser.userId,
      seatId: selectedUser.seatId,
    };
    axios
      .post(
        "http://localhost:9006/bookmyseat/admin/seatrestriction/add",
        postData
      )
      .then((res) => {
        const data = res.data;
        setModalHeading("Success");
        setModalMessage(data);
        setShowToaster(true);
      })
      .catch((err) => {
        console.log(err);
        if ((err.response = "Seat is already reserved for selected user !")) {
          setModalHeading(" Already Reserved");
          setModalMessage(err.response);
          setShowToaster(true);
        }
      });
    setShowReserveModal(false);
  };

  // function to close modal
  const closeReserveModal = () => {
    setShowReserveModal(false);
  };

  // function to handle floor selection
  const handleFloorSelect = (floorId, floorName) => {
    setSelectedFloor(floorId);
    setSelectedUser((prevstate) => ({ ...prevstate, floor: floorName }));
    setDropdownOpen(false);
    openMap(floorId);
  };
  // Function to handle selecting a seat
  const handleSeatSelection = ({ seatNumber, seatId }) => {
    setSelectedUser((prevstate) => ({
      ...prevstate,
      seatNumber: seatNumber,
      seatId: seatId,
    }));
    setSelectedSeat(seatNumber);
  };
  // opening map
  const openMap = (floorId) => {
    const content = getMapContent(floorId);
    setMapContent(content);
    setMapVisibility(true);
  };
  // displaying map of selected floor
  const getMapContent = (floorId) => {
    switch (floorId) {
      case 1:
        return (
          // Rendering ground floor
          <GroundFloorMap
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 2:
        return (
          // Rendering Mezzanine floor
          <MezzanineFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 3:
        return (
          // Rendering First floor
          <FirstFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 4:
        return (
          // Rendering Second floor
          <SecondFloor
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 5:
        return (
          <ThirdFloorMap
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      case 6:
        return (
          // Rendering Terrace floor
          <TerraceTrainingRoom
            onSeatSelect={handleSeatSelection}
            setMapContent={setMapContent}
            isAdmin={true}
            setMapVisibility={setMapVisibility}
          />
        );
      default:
        return null;
    }
  };
  // handling seat click on seat to reserve
  const handleReserveSeat = () => {
    if (!selectedFloor) {
      setError("Select Floor and seat to continue.");
    } else {
      setReserveModalHeading("Reserve Seat.");
      serReserveModalMessage("Are you sure you want to reserve this seat?");
      setShowReserveModal(true);
    }
  };
  // Function to filter attendees based on search query
  const filteredData = userData.filter((user) => {
    return user.employeeId.toString().includes(searchQuery.toString());
  });

  // Function to check if the employee ID exists in userData or filteredData
  const checkEmployeeIdExists = (employeeId) => {
    const allUsers = filteredData.length > 0 ? filteredData : userData; // Use filteredData if available, otherwise use userData
    return allUsers.find(
      (user) => user.employeeId.toString() === employeeId.toString()
    );
  };

  // Function to handle changes in the search input
  const handleSearchInputChange = (e) => {
    const inputQuery = e.target.value;
    setSearchQuery(inputQuery);
    setCurrentPage(1);
    // Check if the entered employee ID exists in userData or filteredData
    const employeeIdExists = checkEmployeeIdExists(inputQuery);
    if (!employeeIdExists) {
      // Employee ID does not exist, clear selected user
      setSelectedUser(null);
    } else {
      setSelectedUser((prevstate) => ({
        ...prevstate,
        userId: employeeIdExists.id,
        employeeId: employeeIdExists.employeeId,
      }));
    }
  };

  return (
    <>
      <h1 className={styles.heading}>Add User Reservation.</h1>
      {/* form container */}
      {error ? <h2 className={styles.errorMessage}>{error}</h2> : " "}
      <div className={styles.formContainer}>
        {/* floor dropdown */}
        <div className={styles.floorSelection}>
          <div className={styles.customDropdown}>
            <div
              className={styles.selectedFloor}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedFloor
                ? floors.find((floor) => floor.id === selectedFloor).floorName
                : "Select Floor"}{" "}
              <ChevronDown />
            </div>
            {dropdownOpen && (
              <div className={styles.dropdownList}>
                {floors.map((floor) => (
                  <div
                    key={floor.id}
                    className={styles.dropdownItem}
                    onClick={() => {
                      handleFloorSelect(floor.id, floor.floorName);
                    }}
                  >
                    {floor.floorName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* selected seat Container */}
        <div className={styles.selectSeat}>
          <div className={styles.seatNumber}>
            <label className={styles.formLabel} htmlFor="seatNumber">
              Selected Seat:
            </label>
            <input
              className={styles.formInput}
              type="text"
              name="seatNumber"
              id="seatNumber"
              placeholder="Seat Number"
              value={selectedSeat}
              readOnly
            />
          </div>
        </div>
        {/* search container - input field to search for employees */}
        <div className={styles.searchContainer}>
          {/* Input for search query */}
          <input
            className={styles.formInput}
            type="number"
            id="employeeId"
            name="employeeId"
            placeholder="Enter Empoloyee ID"
            autoComplete="off"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={5}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      {/* User List Component - containing details of evey user */}
      <UserList
        filteredData={filteredData}
        setSelectedUser={setSelectedUser}
        handleReserveSeat={handleReserveSeat}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      {/* map modal - modal for map visibility */}
      <div className={styles.mapModal}>
        {/* <button onClick={openMap}>open floor</button> */}
        {mapVisibility && mapContent}
      </div>

      {/* modal for showimg click event on reserve button by admin */}
      {showReserveModal && (
        <ReserveSeatModal
          heading={reserveModalHeading}
          message={reserveModalMessage}
          onCancel={closeReserveModal}
          onConfirm={saveReservedSeat}
          userDetail={selectedUser}
        />
      )}
      {/* modal displaying error/success messages */}
      {showToaster && (
        <Toaster
          message={modalMessage}
          setShowToaster={setShowToaster}
          heading={modalHeading}
        />
      )}
    </>
  );
};
