import axios from "axios";
import styles from "../styles/modifyShiftsMain.module.css";
import { ArrowUpRightFromSquare } from "lucide-react";
import { useEffect, useState } from "react";
import Toaster from "../../../../toaster/components/toaster.component";

export const ShiftData = ({ filteredData, shifts, setShifts, searchQuery }) => {
  // States used in the code
  const [employeeModal, setEmployeeModal] = useState(false);
  const [availableShifts, setAvailableShifts] = useState([]);
  const [initialAvailableShifts, setInitialAvailableShifts] = useState([]);
  const [initialShifts, setInitialShifts] = useState([]);
  const [userId, setUserId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    // Extract available shift IDs
    // console.log("Available Shifts: ", availableShifts);
    const availableShiftIds = availableShifts.map((shift) => shift.id);
    // console.log("Available Shift IDs: ", availableShiftIds);

    setInitialShifts(shifts);
    // Filter shifts based on available shift IDs
    const filteredShifts = shifts.filter(
      (shift) => !availableShiftIds.includes(shift.id)
    );
    // console.log("Filtered Shifts: ", filteredShifts);

    // Update shifts state with filtered shifts
    setShifts(filteredShifts);

    // console.log("Shifts after filtering: ", filteredShifts);
  }, [availableShifts]);

  const handleEditClick = (user_id) => {
    const id = parseInt(user_id);
    // Setting axios header for authorization
    const token = sessionStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    console.log("Token ", token);
    axios
      .get(`http://localhost:9006/bookmyseat/admin/usershifts/${user_id}`)
      .then((res) => {
        // console.log(res.data);
        setAvailableShifts(res.data);
        setInitialAvailableShifts(res.data);
        setUserId(id);
        setEmployeeModal(true);
      })
      .catch((err) => {
        setModalHeading("Error");
        setModalMessage("Something went wrong. Please try again.");
        setShowToaster(true);
      });
  };

  const handleRemoveShift = (e) => {
    const shiftIdToRemove = parseInt(
      e.target.parentNode.querySelector("#availableShifts").value
    );

    // Find the removed shift from availableShifts
    const removedShift = availableShifts.find(
      (shift) => shift.id === shiftIdToRemove
    );

    // Filter out the removed shift from availableShifts
    const updatedAvailableShifts = availableShifts.filter(
      (shift) => shift.id !== shiftIdToRemove
    );

    // Add the removed shift to shifts
    const updatedShifts = [...shifts, removedShift];

    setAvailableShifts(updatedAvailableShifts);
    setShifts(updatedShifts);
  };

  // Function to handle Click on add button
  const handleAddShift = (e) => {
    const shiftIdToAdd = parseInt(
      e.target.parentNode.querySelector("#allShifts").value
    );

    // Find the shift to add from shifts
    const addedShift = shifts.find((shift) => shift.id === shiftIdToAdd);

    // Filter out the added shift from shifts
    const updatedShifts = shifts.filter((shift) => shift.id !== shiftIdToAdd);

    // Add the added shift to availableShifts
    const updatedAvailableShifts = [...availableShifts, addedShift];

    setShifts(updatedShifts);
    setAvailableShifts(updatedAvailableShifts);
  };

  // Function to map shifts to user
  const handleOkButtonClick = () => {
    if (availableShifts.length !== 0) {
      // Send availableShifts data to the backend using axios
      const availableShiftIds = availableShifts.map((shift) => shift.id);
      const data = {
        userId: userId,
        shiftIds: availableShiftIds,
      };
      // Setting axios header for authorization
      const token = sessionStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
      // console.log(token);
      axios
        .post("http://localhost:9006/bookmyseat/admin/mapusershifts", data)
        .then((res) => {
          setEmployeeModal(false);

          // Handle success response if needed
          setModalHeading("Success");
          setModalMessage("Shifts updated successfully.");
          setShowToaster(true);
        })
        .catch((err) => {
          // Handle error response if needed
          setModalHeading("Error");
          setModalMessage("Error updating shifts. Please try again.");
          setShowToaster(true);
        });
    } else {
      setModalHeading("Error");
      setModalMessage("Employee must have atleast 1 shift.");
      setShowToaster(true);
    }
  };

  // Function to handle Click on cancel button
  const handleCancelClick = () => {
    setAvailableShifts(initialAvailableShifts);
    setShifts(initialShifts);
    setEmployeeModal(false);
  };

  // Pagination Process
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(totalPages);
    }
  }, [itemsPerPage, currentPage, totalPages]);

  useEffect(() => {
    // Ensure currentPage is set to 1 when searchQuery changes
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      {/* Displaying Data in tabular form */}
      <table>
        {/* Table column headings */}
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Employee Email</th>
            <th>Action</th>
          </tr>
        </thead>

        {/* Table body content */}
        <tbody>
          {currentItems &&
            currentItems.map((data, index) => (
              <tr key={index}>
                {/* Employee ID */}
                <td>{data.employeeId}</td>
                {/* Employee Name */}
                <td>
                  {data.firstName} {data.lastName}
                </td>
                {/* Floor Name */}
                <td>{data.email}</td>
                <td>
                  <span onClick={() => handleEditClick(data.id)}>
                    Edit Shifts <ArrowUpRightFromSquare color="green" />
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal to map shifts to user */}
      {employeeModal && (
        <div className={styles.shiftModal}>
          <div className={styles.shiftsModalContent}>
            <h2>Map Shifts</h2>

            <div className={styles.selectLabels}>
              <label htmlFor="availableShifts">Available Shifts</label>
              <select
                name="availableShifts"
                id="availableShifts"
                defaultValue=""
              >
                {availableShifts.map((shift, index) => (
                  <option key={index} value={shift.id}>
                    {shift.startTime + " To " + shift.endTime}
                  </option>
                ))}
              </select>
              <button
                className={styles.removeButton}
                onClick={handleRemoveShift}
                disabled={availableShifts.length === 0}
              >
                Remove
              </button>
            </div>

            <div className={styles.selectLabels}>
              <label htmlFor="allShifts">All Shifts</label>
              <select name="allShifts" id="allShifts">
                {shifts.map((shift, index) => (
                  <option key={index} value={shift.id}>
                    {shift.startTime + " To " + shift.endTime}
                  </option>
                ))}
              </select>
              <button
                className={styles.addButton}
                onClick={handleAddShift}
                disabled={shifts.length === 0}
              >
                Add
              </button>
            </div>

            <div className={styles.modalBtns}>
              <button
                className={styles.mapButton}
                onClick={handleOkButtonClick}
              >
                Map Shifts
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleCancelClick}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination section */}
      <div className={styles.pagination}>
        {filteredData.length > itemsPerPage && (
          <>
            {currentPage > 1 && (
              <button
                className={styles.paginationButton}
                onClick={() => paginate(currentPage - 1)}
              >
                &lt;
              </button>
            )}
            {[currentPage - 1, currentPage, currentPage + 1].map((page) => {
              if (page > 0 && page <= totalPages) {
                return (
                  <button
                    key={page}
                    className={`${styles.paginationButton} ${
                      currentPage === page ? styles.activePage : ""
                    }`}
                    onClick={() => paginate(page)}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}
            {currentPage < totalPages && (
              <button
                className={styles.paginationButton}
                onClick={() => paginate(currentPage + 1)}
              >
                &gt;
              </button>
            )}
          </>
        )}
      </div>

      {/* Conditional Rendering for Toaster Comp */}
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
