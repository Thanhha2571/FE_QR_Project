import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { baseUrl } from "components/api/httpService";

const GenerateQR = () => {
    document.title = 'Generate QR Code';
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [qrData, setQRData] = useState(`QR code for department - ${Date.now()}`);
    const [departmentList, setDepartmentList] = useState()
    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;
    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkManager, setCheckManager] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)
    const [departmentInhaberOrManager, setDepartmentInhaberOrManager] = useState()
    const [hashDepartment, setHashDepartment] = useState()

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

    const encryptParameter = (param) => {
        const key = 'YourSecretKey';
        const additionalData = 'YourAdditionalDatasdfsdfdfsfdsdfdfdsfffddsfsdfsdfsdfdsfdsfsdfddsfdsfdsfdsfqweww';
        const paddedParam = param + additionalData; 
        const encrypted = btoa(paddedParam + key);
        return encrypted;
    };

    useEffect(() => {
        if (userObject?.role === 'Admin') {
            setCheckAdmin(true)
            setCheckInhaber(false)
            setCheckManager(false)
        }

        // if (userObject?.role === 'Inhaber') {
        //     setCheckAdmin(false)
        //     setCheckInhaber(true)
        //     setCheckManager(false)
        // }

        if (userObject?.role === 'Manager' || userObject?.role === 'Inhaber') {
            setCheckAdmin(false)
            setCheckInhaber(false)
            setCheckManager(true)
        }
        // if (userObject?.role == "Inhaber") {
        //     const arrayFilter = userObject?.department?.map((item => item.name))
        //     setDepartmentInhaberOrManager(arrayFilter)
        //     console.log("arrayFilter", departmentInhaberOrManager);
        // }
    }, [userObject?.role])

    useEffect(() => {

        const getAllDepartments = async () => {
            if (userObject?.role === "Admin") {
                try {
                    const response = await axios.get(`${baseUrl}/api/admin/manage-department/get-all`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
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
                        <select className='ml-5 mb-5 text-base px-4 py-3 border-[#d9d9d9] text-[#6c757d] rounded-[6px] hover:border-[#4096ff] focus:border-[#4096ff] placeholder:text-placeholderTextColor' id="department" value={selectedDepartment} onChange={handleDepartmentChange}>
                            <option value="" disabled className='italic text-sm'>Filiale*</option>
                            {departmentList?.map((item, index) => (
                                <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        {qrData && <QRCode value={qrData} className="qr-code" />}
                        <Link target="_blank" to={`/Qr_link/${encryptParameter(selectedDepartment)}`} className="w-[250px] mt-3 bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                            <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            Create Link
                        </Link>
                    </div>)}
                </div>)}
        </div>
    );
};

export default GenerateQR;
