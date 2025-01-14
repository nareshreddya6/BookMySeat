import React from 'react';
import styles from '../styles/printOptions.module.css';
import * as XLSX from 'xlsx';

const PrintOptions = ({users }) => {
    const handleExport = (format) => {
        if (format === 'PDF') {
            window.print();
        } else if (format === 'Excel') {
            generateExcel();
        }
    };
        const generateExcel = () => {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(users.map(detail => ({
                "Employee ID": detail.employeeId,
                "Name": detail.firstName,
                "Project": detail.project.projectName,
                "Role": detail.role.roleName,
                "Phone No": detail.phoneNumber,
                "Email": detail.email,
                "CreatedDate": new Date(detail.createdDate).toISOString().split('T')[0],
            })));
            XLSX.utils.book_append_sheet(wb, ws, "User Information");
            XLSX.writeFile(wb, "user_information.xlsx");
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
