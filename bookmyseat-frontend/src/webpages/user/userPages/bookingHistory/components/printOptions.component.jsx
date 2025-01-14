import React from 'react';
import styles from '../styles/printOptions.module.css';
import * as XLSX from 'xlsx';

const PrintOptions = ({data }) => {
    const handleExport = (format) => {
        if (format === 'PDF') {
            window.print();
        } else if (format === 'Excel') {
            generateExcel();
        }
    };

        const generateExcel = () => {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data.map(booking => ({
                "Booking Type": booking.bookingRange,
                "Shift": `${booking.bookingMappings.shiftDetails.startTime} to ${booking.bookingMappings.shiftDetails.endTime}`,
                "Status": booking.bookingStatus ? "ACTIVE" : "CANCELLED",
                "From": booking.startDate,
                "To": booking.endDate,
                "Seat Number": booking.seat.seatNumber
            })));
            XLSX.utils.book_append_sheet(wb, ws, "Booking History");
            XLSX.writeFile(wb, "booking_history.xlsx");
        };
   
    return (
        <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Export</button>
            <div className={styles.dropdowncontent}>
                <button onClick={() => handleExport('PDF')}>Export as PDF</button>
                <button onClick={() => handleExport('Excel')}>Export as Excel</button>
            </div>
        </div>
    );
};

export default PrintOptions;
