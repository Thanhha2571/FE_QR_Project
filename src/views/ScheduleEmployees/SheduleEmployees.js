import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "components/api/httpService";
import PushIcon from "../../assets/images/push-icon.png";
import GuideIcon from "../../assets/images/guide-icon.png";
import DatePicker from "react-multi-date-picker"
import { Card, Space } from 'antd';
import "./ScheduleEmployees.css"
const ScheduleEmployees = () => {
    const [departmentList, setDepartmentList] = useState([]);
    const [departmentMenu, setDepartmentMenu] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [employee, setEmployee] = useState({});
    const [selectedPositions, setSelectedPositions] = useState({});
    const [positionMenu, setPositionMenu] = useState(false);
    const [userList, setUserList] = useState([]);
    const [userObject, setUserObject] = useState(null);
    const [employees, setEmployees] = useState([]);

    const [shiftList, setShiftList] = useState()
    const [selectedShiftCode, setSelectedShiftCode] = useState("")
    const [shiftCodeMenu, setShiftCodeMenu] = useState(false)

    const [datePicker, setDatePicker] = useState("Select Date")
    const PAGE_SIZE = 50;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * PAGE_SIZE;
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    const currentUsers = userList?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(userList?.length / PAGE_SIZE);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US");
    };

    const [loading, setLoading] = useState(false)

    const [guideState, setGuideState] = useState(false)
    const [guideState1, setGuideState1] = useState(false)
    const [guideState2, setGuideState2] = useState(false)
    const [guideState3, setGuideState3] = useState(false)

    useEffect(() => {
        const userString = localStorage.getItem("user");
        const userObject = userString ? JSON.parse(userString) : null;
        setUserObject(userObject);
    }, []);

    useEffect(() => {
        getAllDepartments();
        getAllShifts()

        if (userObject?.role === "Inhaber" || userObject?.role === "Manager") {
            const arrayFilter = userObject?.department?.map(item => ({ name: item.name })) || [];
            setDepartmentList(arrayFilter);
            console.log("arrayFilter", arrayFilter);
        }
    }, [userObject?.role]);

    const handlePositionChange = (userId, newPosition, userName, department) => {
        setSelectedPositions((prevState) => ({
            ...prevState,
            [userId]: newPosition,
        }));

        const newEmployee = {
            employeeID: userId,
            employeeName: userName,
            departmentName: department,
            position: newPosition,
        };

        setEmployee(newEmployee);
        setEmployees((prevState) => [...prevState, newEmployee]);

        console.log(newEmployee);
    };

    const getAllDepartments = async () => {
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-department/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setDepartmentList(response.data);
            } catch (err) {
                alert(err.response?.data?.message);
            }
        }
    };

    const getAllShifts = async () => {
        // setLoading(true)
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-shift/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setShiftList(response.data.message);
                // setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                // setLoading(false)
            }
        }

        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-shift/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setShiftList(response.data.message);
                // setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                // setLoading(false)
            }
        }
        if (userObject?.role === "Manager") {
            try {
                const response = await axios.get(`${baseUrl}/api/manager/manage-shift/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setShiftList(response.data.message);
                // setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                // setLoading(false)
            }
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-all/search-specific?department=${selectedDepartment}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUserList(response.data.message);
            } catch (err) {
                alert(err.response?.data?.message);
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-employee/search-specific?inhaber_name=${userObject?.name}&department=${selectedDepartment}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUserList(response.data.message);
            } catch (err) {
                alert(err.response?.data?.message);
            }
        }
        if (userObject?.role === "Manager") {
            try {
                const response = await axios.get(`${baseUrl}/api/manager/manage-employee/search-specific?manager_name=${userObject?.name}&department=${selectedDepartment}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUserList(response.data.message);
            } catch (err) {
                alert(err.response?.data?.message);
            }
        }
    };

    const handleAddScheduleEmployees = async () => {
        setEmployees((prevState) => [...prevState, employee]);
        if (userObject?.role === "Admin") {
            try {
                setLoading(true)
                const formattedValues = datePicker.map(formatDate);
                const response = await axios.post(
                    `${baseUrl}/api/admin/manage-date-design/create-days/for-employees`,
                    {
                        shift_code: selectedShiftCode,
                        employees: employees,
                        dates: formattedValues,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setLoading(false)
                alert(`
                Number of employees created: ${Number(response?.data?.message.successEntries) + Number(response?.data?.message.errorEntries?.length)}
                Number of employees created successfully: ${Number(response?.data?.message.successEntries)}
                ${response?.data?.message.errorEntries?.length > 0 ? `Employees created with errors(have same shift of the day): ${response?.data?.message.errorEntries?.map((item, index) => `\n${index + 1}. ${item?.employeeName}`).join('')}` : ''}
            `);
                setSelectedShiftCode("")
                setDatePicker("")
                setSelectedPositions("")
                setEmployees([])
                setSelectedDepartment("")
                setUserList([])
                setGuideState1(false);
                setGuideState2(false);
                setGuideState3(false);
            } catch (e) {
                alert(e.response?.data?.message);
                setLoading(false)
                setSelectedShiftCode("")
                setDatePicker("")
                setSelectedPositions("")
                setEmployees([])
                setSelectedDepartment("")
                setUserList([])
                setGuideState1(false);
                setGuideState2(false);
                setGuideState3(false);
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                setLoading(true)
                const formattedValues = datePicker.map(formatDate);
                const response = await axios.post(
                    `${baseUrl}/api/inhaber/manage-date-design/create-days/for-employees`,
                    {
                        shift_code: selectedShiftCode,
                        employees: employees,
                        dates: formattedValues,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setLoading(false)
                alert(`
                Number of employees created: ${Number(response?.data?.message.successEntries) + Number(response?.data?.message.errorEntries?.length)}
                Number of employees created successfully: ${Number(response?.data?.message.successEntries)}
                ${response?.data?.message.errorEntries?.length > 0 ? `Employees created with errors(have same shift of the day): ${response?.data?.message.errorEntries?.map((item, index) => `\n${index + 1}. ${item?.employeeName}`).join('')}` : ''}
            `);
                setSelectedShiftCode("")
                setDatePicker("")
                setSelectedPositions("")
                setEmployees([])
                setSelectedDepartment("")
                setUserList([])
                setGuideState1(false);
                setGuideState2(false);
                setGuideState3(false);
            } catch (e) {
                alert(e.response?.data?.message);
                setLoading(false)
                setSelectedShiftCode("")
                setDatePicker("")
                setSelectedPositions("")
                setEmployees([])
                setSelectedDepartment("")
                setUserList([])
                setGuideState1(false);
                setGuideState2(false);
                setGuideState3(false);
            }
        }
        if (userObject?.role === "Manager") {
            try {
                setLoading(true)
                const formattedValues = datePicker.map(formatDate);
                const response = await axios.post(
                    `${baseUrl}/api/manager/manage-date-design/create-days/for-employees`,
                    {
                        shift_code: selectedShiftCode,
                        employees: employees,
                        dates: formattedValues,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setLoading(false)
                alert(`
                Number of employees created: ${Number(response?.data?.message.successEntries) + Number(response?.data?.message.errorEntries?.length)}
                Number of employees created successfully: ${Number(response?.data?.message.successEntries)}
                ${response?.data?.message.errorEntries?.length > 0 ? `Employees created with errors(have same shift of the day): ${response?.data?.message.errorEntries?.map((item, index) => `\n${index + 1}. ${item?.employeeName}`).join('')}` : ''}
            `);
                setSelectedShiftCode("")
                setDatePicker("")
                setSelectedPositions("")
                setEmployees([])
                setSelectedDepartment("")
                setUserList([])
                setGuideState1(false);
                setGuideState2(false);
                setGuideState3(false);
            } catch (e) {
                alert(e.response?.data?.message);
                setLoading(false)
                setSelectedShiftCode("")
                setDatePicker("")
                setSelectedPositions("")
                setEmployees([])
                setSelectedDepartment("")
                setUserList([])
                setGuideState1(false);
                setGuideState2(false);
                setGuideState3(false);
            }
        }
    }

    return (
        <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5 justify-center">
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl">Schedule Employees</h1>
                    <div className="flex flex-row">
                        <Link className="text-xl font-semibold leading-6 hover:underline" to="/dashboard">Dashboard</Link>
                        <span className="text-[#6c757d] font-xl">/ Schedule Employees</span>
                    </div>
                </div>
                <div className="flex flex-col px-4 gap-4">
                    <div className="flex flex-row gap-4">
                        <button onClick={() => setGuideState(!guideState)} className="bg-buttonColor2 text-white text-base flex flex-row gap-2 justify-center items-center border border-solid p-2 rounded-md hover:bg-emerald-800">
                            <img src={GuideIcon} className="w-6 h-auto" />
                            Guideline
                        </button>
                    </div>
                    {guideState && (
                        <Space direction="vertical" size={16} className="absolute mt-14 z-20">
                            <Card title="Following step by step" style={{ width: 300 }}>
                                <div className="flex flex-row gap-3 mt-5 items-center">
                                    Step 1:
                                    <button
                                        type="button"
                                        onClick={() => setGuideState1(!guideState1)}
                                        className={`cursor-pointer text-white text-base flex flex-row gap-2 justify-center items-center border border-solid px-2 py-1 rounded-md ${guideState1 ? "bg-red-600 hover:bg-red-800" : "bg-buttonColor2 hover:bg-emerald-800"}`}
                                    >
                                        {guideState1 ? "Close" : "Show"}
                                    </button>
                                </div>
                                <div className="flex flex-row gap-3 mt-5 items-center">
                                    Step 2:
                                    <button
                                        type="button"
                                        onClick={() => setGuideState2(!guideState2)}
                                        className={`cursor-pointer text-white text-base flex flex-row gap-2 justify-center items-center border border-solid px-2 py-1 rounded-md ${guideState2 ? "bg-red-600 hover:bg-red-800" : "bg-buttonColor2 hover:bg-emerald-800"}`}
                                    >
                                        {guideState2 ? "Close" : "Show"}
                                    </button>
                                </div>
                                <div className="flex flex-row gap-3 mt-5 items-center">
                                    Step 3:
                                    <button
                                        type="button"
                                        onClick={() => setGuideState3(!guideState3)}
                                        className={`cursor-pointer text-white text-base flex flex-row gap-2 justify-center items-center border border-solid px-2 py-1 rounded-md ${guideState3 ? "bg-red-600 hover:bg-red-800" : "bg-buttonColor2 hover:bg-emerald-800"}`}
                                    >
                                        {guideState3 ? "Close" : "Show"}
                                    </button>
                                </div>
                                <div className="flex flex-row items-center justify-end mt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setGuideState(false);
                                            // setGuideState1(false);
                                            // setGuideState2(false);
                                            // setGuideState3(false);
                                        }}
                                        className="bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md hover:bg-red-800"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Card>
                        </Space>
                    )}
                </div>
                <div></div>
                {/* <div></div> */}
            </div>
            {
                loading && (<div className="absolute flex w-full h-full items-center justify-center z-10">
                    <div className="loader_search"></div>
                </div>)
            }
            {guideState1 && (<div className="text-xl font-bold text-red-600">1. Tìm kiếm nhân viên: Chọn "Abteilung auswählen", rồi sau đó nhấn vào nút "Suchen"</div>)}
            <div className="z-10 flex flex-row mt-4 gap-10 h-[50px]">
                <div className={`w-1/5 mb-3 ${guideState1 ? "h-[80px] p-3 border-solid border-red-600 border-2 rounded-sm" : ""}`}>
                    <div className="w-full flex flex-col gap-2">
                        <select
                            id="code"
                            name="code"
                            className="w-full cursor-pointer border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[50px] text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            required
                        >
                            <option value="" disabled className='italic text-sm'>Abteilung auswählen</option>
                            {departmentList?.map(({ name }, index) => (
                                <option className='text-sm text-textColor w-full' key={index} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={`w-1/6 mb-3 ${guideState1 ? "h-[80px] p-3 border-solid border-red-600 border-2 rounded-sm" : ""}`}>
                    <div
                        onClick={handleSearch}
                        className="w-full bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700 h-[50px]">
                        <button className="search-btn">Suchen</button>
                    </div>
                </div>
            </div>
            {guideState3 && (<div className="mt-6 text-xl font-bold text-red-600">3. Chọn ngày làm việc "Select dates*" và ca làm việc "Select Shift Code" thích hợp, sau đó thêm lịch làm việc "Add Schecdules"</div>)}
            <div className="z-5 flex flex-row gap-10 h-[50px] mt-4">
                <div className={`w-1/3 ${guideState3 ? "h-[80px] p-3 border-solid border-red-600 border-2 rounded-sm" : ""}`}>
                    <div className="w-full h-auto flex flex-col gap-2">
                        {/* <div className="flex flex-row gap-2">
                        <span className="text-rose-500">*</span>
                        <span className="">Dates</span>
                    </div> */}
                        <DatePicker
                            style={{
                                height: '50px',
                                width: '100%',
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                            }}
                            format="MM/DD/YYYY"
                            multiple
                            value={datePicker}
                            onChange={setDatePicker}
                            placeholder="Select dates"
                        />
                    </div>
                </div>

                <div className={`w-1/5 ${guideState3 ? "h-[80px] p-3 border-solid border-red-600 border-2 rounded-sm" : ""}`}>
                    <div className="w-full flex flex-col gap-2">
                        <select
                            id="code"
                            name="code"
                            className="w-full cursor-pointer border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[50px] text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                            value={selectedShiftCode}
                            onChange={(e) => setSelectedShiftCode(e.target.value)}
                            required
                        >
                            <option value="" disabled className='italic text-sm'>Select Shift Code</option>
                            {shiftList?.map(({ code }, index) => (
                                <option className='text-sm text-textColor w-full' key={index} value={code}>
                                    {code}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={`w-1/6 mb-3 ${guideState3 ? "h-[80px] p-3 border-solid border-red-600 border-2 rounded-sm" : ""}`}>
                    <div
                        onClick={handleAddScheduleEmployees}
                        className="w-full h-[50px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700 ">
                        <button className="search-btn">Add Schedule</button>
                    </div>
                </div>
            </div>

            {guideState2 && (<div className="mt-6 text-xl font-bold text-red-600">2. Chọn vị trí "Select Position*" thích hợp cho từng nhân viên muốn thêm lịch làm vào ngày và ca đã chọn</div>)}
            <div className="block w-full text-base font-Changa mt-4 overflow-y-scroll overflow-x-scroll">
                <table className="w-full table">
                    <thead>
                        <tr>
                            <th className="p-2 text-left">
                                <span className="font-bold">Name</span>
                            </th>
                            <th className="p-2 text-left">
                                <span className="table-title-id">Employee ID</span>
                            </th>
                            <th className="p-2 text-left">
                                <span className="table-title-id">Position</span>
                            </th>
                            {/* <th className="p-2 text-left">
                                <span className="table-title-id">Action</span>
                            </th> */}
                        </tr>
                    </thead>
                    {Array.isArray(currentUsers) && currentUsers?.length === 0 ? (
                        <div className="no-result-text text-center">NO RESULT</div>
                    ) : (
                        <tbody className="tbody">
                            {currentUsers?.map(({ id, name, role, department }) => (
                                <tr key={id} className="tr-item">
                                    <td className="p-2 hover:text-buttonColor2">
                                        <h2 className="text-left">
                                            <Link className="cursor-pointer flex flex-col" to={`view-profile/${id}/${name}`}>{name}
                                                <span className="text-xs text-neutral-400">{role}</span>
                                            </Link>
                                        </h2>
                                    </td>
                                    <td className="p-2">{id}</td>
                                    <td className={`w-1/2 flex flex-col gap-2 p-1 ${guideState3 ? "h-[70x] p-1 border-solid border-red-600 border-2 rounded-sm" : ""}`}>
                                        <select
                                            id={`position-${id}`}
                                            name="position"
                                            className="w-full cursor-pointer border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                                            value={selectedPositions[id] || ""}
                                            onChange={(e) => handlePositionChange(id, e.target.value, name, selectedDepartment)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Select Position*</option>
                                            {department
                                                ?.filter((item) => item.name === selectedDepartment)
                                                ?.flatMap((item) =>
                                                    item?.position?.map((pos, index) => (
                                                        <option className='text-sm text-textColor w-full' key={index} value={pos}>
                                                            {pos}
                                                        </option>
                                                    ))
                                                )
                                            }
                                        </select>
                                    </td>
                                    {/* <td className="p-2">
                                        <button
                                            onClick={handlePush}
                                            type="button"
                                            className="bg-buttonColor2 text-white text-base flex flex-row gap-4 justify-center items-center border border-solid p-2 rounded-md hover:bg-emerald-800"
                                        >
                                            Push <img src={PushIcon} className="w-4 h-auto" />
                                        </button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>)}
                </table>
            </div>
        </div >
    );
};

export default ScheduleEmployees;
