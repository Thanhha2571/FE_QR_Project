import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';

const GenerateQR = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [qrData, setQRData] = useState(`QR code for department - ${Date.now()}`);
    const [departmentList, setDepartmentList] = useState()
    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;
    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkManager, setCheckManager] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)
    const [departmentInhaberOrManager, setDepartmentInhaberOrManager] = useState()

    useEffect(() => {
        const updateQRCode = () => {
            const timestamp = new Date().toISOString();
            setQRData(`QR code for department ${selectedDepartment} - ${timestamp}`);
        };

        updateQRCode();

        const intervalId = setInterval(updateQRCode, 20000);

        return () => {
            clearInterval(intervalId);
        };
    }, [selectedDepartment]);

    useEffect(() => {
        if (userObject?.role === 'Admin') {
            setCheckAdmin(true)
            setCheckInhaber(false)
            setCheckManager(false)
        }

        if (userObject?.role === 'Inhaber') {
            setCheckAdmin(false)
            setCheckInhaber(true)
            setCheckManager(false)
        }

        if (userObject?.role === 'Manager') {
            setCheckAdmin(false)
            setCheckInhaber(false)
            setCheckManager(true)
        }
        if (userObject?.role == "Inhaber") {
            const arrayFilter = userObject?.department?.map((item => item.name))
            setDepartmentInhaberOrManager(arrayFilter)
            console.log("arrayFilter", departmentInhaberOrManager);
        }
    }, [userObject?.role])

    useEffect(() => {

        const getAllDepartments = async () => {
            if (userObject?.role === "Admin") {
                try {
                    const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-department/get-all', { withCredentials: true });
                    setDepartmentList(response.data);
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }
        };

        getAllDepartments();
    }, [userObject?.role, userObject?.name]);
    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    return (
        <div>
            {checkManager ? (<div className="ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">YOU CANNOT ACCESS THIS ROUTE</div>) :
                (<div>
                    {checkAdmin && (<div className="ml-[260px] p-5">
                        <label htmlFor="department">Choose a department:</label>
                        <select id="department" value={selectedDepartment} onChange={handleDepartmentChange}>
                            <option value="" disabled className='italic text-sm'>Select Department*</option>
                            {departmentList?.map((item, index) => (
                                <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        {qrData && <QRCode value={qrData} className="qr-code" />}
                    </div>)}
                    {checkInhaber && (<div className="ml-[260px] p-5">
                        <label htmlFor="department">Choose a department:</label>
                        <select id="department" value={selectedDepartment} onChange={handleDepartmentChange}>
                            <option value="" disabled className='italic text-sm'>Select Department*</option>
                            {departmentInhaberOrManager?.map((item, index) => (
                                <option className='text-sm text-textColor w-full' key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        {qrData && <QRCode value={qrData} className="qr-code" />}
                    </div>)}
                </div>)}
        </div>
    );
};

export default GenerateQR;
