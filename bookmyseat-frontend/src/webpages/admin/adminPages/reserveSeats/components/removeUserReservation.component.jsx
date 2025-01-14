import React, { useEffect, useState } from "react";
import styles from "../styles/userList.module.css";
import paginationStyles from "../styles/pagination.module.css";
import axios from "axios";
import ReserveSeatModal from "./reserveSeatModal.component";
import ResponseModal from "../../../../messageModal/responseModal";
import Toaster from "../../../../toaster/components/toaster.component";

export const RemoveUserReservation = () => {
  // state to store reserved data for users level reservation
  const [reservedData, setReservedData] = useState([]);
  // state to store selected/input User details
  const [selectedUser, setSelectedUser] = useState([]);
  // states to manage response message modal and meaasge for reservation from admins side
  const [reserveModalMessage, serReserveModalMessage] = useState("");
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveModalHeading, setReserveModalHeading] = useState("");
  // state to store current page index - for pagination purpose
  const [currentPage, setCurrentPage] = useState(1);
  // defining total number of list items per page
  const [itemsPerPage] = useState(10);
  // calculating total number of pages required
  const totalPages = Math.ceil(reservedData.length / itemsPerPage);
  // maintaining indexs
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // items to display in current page
  const currentItems = reservedData
    ? reservedData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  // paginating between pages
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // states to manage response message modal and meaasge
  // state to store toaster visibility
  const [showToaster, setShowToaster] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // function to close reserve modal
  const closeReserveModal = () => {
    setShowReserveModal(false);
  };

  // getting token from localstorage
  const token = sessionStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = token;
  // fetching users with restricted seat
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:9006/bookmyseat/admin/seatrestriction/remove")
        .then((response) => {
          const data = response.data;
          setReservedData(data.userReservedSeats);
        })
        .catch((error) => {
          setModalHeading("Error");
          setModalMessage(
            "Something went wrong while fetching User data. Please try again."
          );
          setShowToaster(true);
        });
    };
    fetchData();
  }, []);

  // removing Reservation for any seat -
  const removeReservedSeat = () => {
    const seatId = selectedUser.seatId;
    try {
      axios
        .post("http://localhost:9006/bookmyseat/admin/seatrestriction/remove", {
          seatId,
        })
        .then((res) => {
          setModalHeading("Success");
          setModalMessage(res.data);
          setShowToaster(true);
        })
        .catch((err) => {
          setModalHeading("Error");
          setModalMessage("Something went wrong Please try again.");
          setShowToaster(true);
        });
      setShowReserveModal(false);
    } catch (err) {
      setModalHeading("Error");
      setModalMessage("Something went wrong Please try again.");
      setShowToaster(true);
    }
  };

  // function handling click event on delete reservation button
  const handleUserDeletion = (val) => {
    setSelectedUser({
      seatId: val.id,
      employeeId: val.restrictedSeat.user.employeeId,
      seatNumber: val.seatNumber,
      floor: val.floor.floorName,
    });
    setReserveModalHeading("Remove Reservation.");
    serReserveModalMessage(
      "Are you sure you want to remove Reservation for this seat?"
    );
    setShowReserveModal(true);
  };

  return (
    <>
      <div>
        <h1 className={paginationStyles.heading}> Remove User Reservation</h1>
        {/* list containing details of all employees */}
        <div className={styles.userList}>
          <div className={styles.employeedetails}>
            <table className={styles.usertable}>
              {/* table heading */}
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Seat Number</th>
                  <th>Floor</th>
                  <th>Action</th>
                </tr>
              </thead>
              {/* table body */}
              <tbody>
                {currentItems.map((detail, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{detail.restrictedSeat.user.employeeId}</td>
                      <td>
                        {detail.restrictedSeat.user.firstName +
                          " " +
                          detail.restrictedSeat.user.lastName}
                      </td>
                      <td>{detail.seatNumber}</td>
                      <td>{detail.floor.floorName}</td>
                      <td>
                        <button
                          onClick={() => handleUserDeletion(detail)}
                          className={styles.removeReserveButton}
                        >
                          Remove Reservation
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* pagination buttons container */}
        <div className={paginationStyles.pagination}>
          {reservedData.length > itemsPerPage && (
            <>
              {currentPage > 1 && (
                <button
                  className={paginationStyles.paginationButton}
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
                      className={`${paginationStyles.paginationButton} ${
                        currentPage === page ? paginationStyles.activePage : ""
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
                  className={paginationStyles.paginationButton}
                  onClick={() => paginate(currentPage + 1)}
                >
                  &gt;
                </button>
              )}
            </>
          )}
        </div>
        {/* modal for showimg click event on remove reserve button by admin */}
        {showReserveModal && (
          <ReserveSeatModal
            heading={reserveModalHeading}
            message={reserveModalMessage}
            onCancel={closeReserveModal}
            onConfirm={removeReservedSeat}
            userDetail={selectedUser}
          />
        )}
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
