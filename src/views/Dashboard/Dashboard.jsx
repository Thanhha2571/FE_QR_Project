import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import EmployeeTodayItem from "./EmployeeTodayItem";
import EmployeeAttendItem from "./EmployeeAttendItem";
import "./Dashboard.css"
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Space } from 'antd';
import ProfileIconDashboard from "../../assets/images/ProfileIconDashboard.png"
import LogOutIcon from "../../assets/images/icon-logout.png"
import ChangePassword from "../../assets/images/changePassword.png"
import { baseUrl } from "components/api/httpService";
import { Pagination } from 'antd';
dayjs.extend(customParseFormat);
const dateFormat = 'MM/DD/YYYY';

function Dashboard() {
    document.title = "Dashboard";

    const nav = useNavigate()

    const [checkAdmin, setCheckAdmin] = useState(false)

    const [selectedDepartment, setSelectedDepartment] = useState("Abteilung auswählen");
    const [departmentList, setDepartmentList] = useState()
    const [departmentMenu, setDepartmentMenu] = useState(false)

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const [currentDate, setCurrentDate] = useState("");
    const [datePicker, setDatePicker] = useState("")

    const [loading, setLoading] = useState(false);

    const [userListToday, setUserListToday] = useState()
    const [userAttendListToday, setUserAttendListToday] = useState()

    const [logOutMenu, setLogOutMenu] = useState(false)

    const handleDateChange = (date, dateString) => {
        setDatePicker(dateString)
    };

    const handleDepartmentMenu = () => {
        setDepartmentMenu(!departmentMenu)
    }

    const handleChangeSelectedDepartment = (item) => {
        setSelectedDepartment(item)
    };

    useEffect(() => {
        if (userObject?.role === "Admin") {
            setCheckAdmin(true)
        }
    }, [userObject?.role])

    const handleLogOut = async () => {
        try {
            const response = await axios.post(`${baseUrl}/api/auth/manage-admin/logout-admin`, { withCredentials: true });
            nav("/login")
        }
        catch (err) {
            alert("Couldn't log out");
        }
    }
    const handleSeacrh = () => {
        const getEmployeeByManyDateAndShift = async () => {
            setLoading(true)
            if (userObject?.role === "Admin") {
                if (selectedDepartment === "Abteilung auswählen") {
                    setUserListToday([])
                    try {
                        const response = await axios.get(`${baseUrl}/api/admin/manage-employee/get-all-schedules?year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])
                    } finally {
                        setLoading(false);
                    }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
                if (selectedDepartment !== "Abteilung auswählen") {
                    setUserListToday([])
                    try {
                        const response = await axios.get(`${baseUrl}/api/admin/manage-employee/get-all-schedules?year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}&department_name=${selectedDepartment}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])
                    } finally {
                        setLoading(false)
                    }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
            }
            if (userObject?.role === "Inhaber") {
                if (selectedDepartment === "Abteilung auswählen") {
                    setUserListToday([])
                    // if (currentDate) {
                    try {
                        const response = await axios.get(`${baseUrl}/api/inhaber/manage-employee/get-all-schedules?inhaber_name=${userObject?.name}&year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])
                    } finally {
                        setLoading(false);
                    }
                    // }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
                if (selectedDepartment !== "Abteilung auswählen") {
                    setUserListToday([])
                    // if (currentDate) {
                    try {
                        const response = await axios.get(`${baseUrl}/api/inhaber/manage-employee/get-all-schedules?inhaber_name=${userObject?.name}&year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}&department_name=${selectedDepartment}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])
                    } finally {
                        setLoading(false);
                    }
                    // }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
            }
            if (userObject?.role === "Manager") {
                if (selectedDepartment === "Abteilung auswählen") {
                    setUserListToday([])
                    // if (currentDate) {
                    try {
                        const response = await axios.get(`${baseUrl}/api/manager/manage-employee/get-all-schedules?manager_name=${userObject?.name}&year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])
                    } finally {
                        setLoading(false);
                    }
                    // }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
                if (selectedDepartment !== "Abteilung auswählen") {
                    setUserListToday([])
                    // if (currentDate) {
                    try {
                        const response = await axios.get(`${baseUrl}/api/manager/manage-employee/get-all-schedules?manager_name=${userObject?.name}&year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}&department_name=${selectedDepartment}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])
                    } finally {
                        setLoading(false);
                    }
                    // }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
            }
        };
        const getAttendanceEmployeeByManyDateAndShift = async () => {
            setLoading(true)
            if (userObject?.role === "Admin") {
                if (selectedDepartment === "Abteilung auswählen") {
                    try {
                        const response = await axios.get(`${baseUrl}/api/admin/manage-attendance/get-by-specific?year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserAttendListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])

                    } finally {
                        setLoading(false);
                    }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
                if (selectedDepartment !== "Abteilung auswählen") {
                    try {
                        const response = await axios.get(`${baseUrl}/api/admin/manage-attendance/get-by-specific?year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}&department_name=${selectedDepartment}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserAttendListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])
                    } finally {
                        setLoading(false)
                    }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
            }
            if (userObject?.role === "Inhaber") {
                if (selectedDepartment === "Abteilung auswählen") {
                    setUserAttendListToday([])
                    try {
                        const response = await axios.get(`${baseUrl}/api/inhaber/manage-attendance/get-by-specific?inhaber_name=${userObject?.name}&year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserAttendListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])

                    } finally {
                        setLoading(false);
                    }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
                if (selectedDepartment !== "Abteilung auswählen") {
                    setUserAttendListToday([])
                    try {
                        const response = await axios.get(`${baseUrl}/api/inhaber/manage-attendance/get-by-specific?inhaber_name=${userObject?.name}&year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}&department_name=${selectedDepartment}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserAttendListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])
                    } finally {
                        setLoading(false)
                    }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
            }
            if (userObject?.role === "Manager") {
                if (selectedDepartment === "Abteilung auswählen") {
                    setUserAttendListToday([])
                    try {
                        const response = await axios.get(`${baseUrl}/api/manager/manage-attendance/get-by-specific?manager_name=${userObject?.name}&year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserAttendListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])

                    } finally {
                        setLoading(false);
                    }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
                if (selectedDepartment !== "Abteilung auswählen") {
                    setUserAttendListToday([])
                    try {
                        const response = await axios.get(`${baseUrl}/api/manager/manage-attendance/get-by-specific?manager_name=${userObject?.name}&year=${datePicker.substring(6, 10)}&month=${datePicker.substring(0, 2)}&date=${datePicker}&department_name=${selectedDepartment}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        });
                        setUserAttendListToday(response.data.message);
                    } catch (error) {
                        setUserListToday([])
                    } finally {
                        setLoading(false)
                    }
                    setSelectedDepartment("Abteilung auswählen");
                    setCurrentDate(`${datePicker}`)
                }
            }
        };
        getEmployeeByManyDateAndShift()
        getAttendanceEmployeeByManyDateAndShift()
    }

    useEffect(() => {
        const getAllDepartments = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-department/get-all`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });

                setDepartmentList(response.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (userObject?.role === "Admin") {
            getAllDepartments();
        }

        if (userObject?.role == "Inhaber" || userObject?.role == "Manager") {
            const arrayFilter = userObject?.department?.map((item => ({ name: item.name })))
            setDepartmentList(arrayFilter)
        }
    }, [userObject?.role]);

    // const PAGE_SIZE_WORKING = 30
    // const [currentPageWorking, setCurrentPageWorking] = useState(1);
    // const indexOfLastItemWorking = currentPageWorking * PAGE_SIZE_WORKING;
    // const indexOfFirstItemWorking = indexOfLastItemWorking - PAGE_SIZE_WORKING;
    // const currentWorkings = userListToday?.slice(indexOfFirstItemWorking, indexOfLastItemWorking);

    // const totalPageWorking = Math.ceil(userListToday?.length / PAGE_SIZE_WORKING);

    // const handlePageWorkingChange = (page) => {
    //     setCurrentPageWorking(page);
    // };

    const [pageSizeWorking, setPageSizeWorking] = useState(20);
    const [currentPageWorking, setCurrentPageWorking] = useState(1);
    const indexOfLastItemWorking = currentPageWorking * pageSizeWorking;
    const indexOfFirstItemWorking = indexOfLastItemWorking - pageSizeWorking;
    const currentWorkings = userListToday?.slice(indexOfFirstItemWorking, indexOfFirstItemWorking + pageSizeWorking);
    // const totalPages = Math.ceil(userListToday?.length / pageSizeWorking);

    const handlePageWorkingChange = (page, size) => {
        setCurrentPageWorking(page);
        setPageSizeWorking(size);
    };

    // const PAGE_SIZE_ATTEND = 30
    // const [currentPageAttend, setCurrentPageAttend] = useState(1);
    // const indexOfLastItemAttend = currentPageAttend * PAGE_SIZE_ATTEND;
    // const indexOfFirstItemAttend = indexOfLastItemAttend - PAGE_SIZE_ATTEND;
    // const currentAttends = userAttendListToday?.slice(indexOfFirstItemAttend, indexOfLastItemAttend);

    // const totalPageAttend = Math.ceil(userAttendListToday?.length / PAGE_SIZE_ATTEND);

    // const handlePageAttendChange = (page) => {
    //     setCurrentPageAttend(page);
    // };
    const [pageSizeAttend, setPageSizeAttend] = useState(20);
    const [currentPageAttend, setCurrentPageAttend] = useState(1);
    const indexOfLastItemAttend = currentPageAttend * pageSizeAttend;
    const indexOfFirstItemAttend = indexOfLastItemAttend - pageSizeAttend;
    const currentAttends = userAttendListToday?.slice(indexOfFirstItemAttend, indexOfFirstItemAttend + pageSizeAttend);
    // const totalPages = Math.ceil(userListToday?.length / pageSizeWorking);

    const handlePageAttendChange = (page, size) => {
        setCurrentPageAttend(page);
        setPageSizeAttend(size);
    };

    return (
        <>
            <div className="relative ml-[260px] h-auto flex flex-col font-Changa text-textColor gap-5">
                <div className="w-full bg-[#34444c] h-[60px] flex flex-row justify-between text-[#d9d9d9] items-center px-4">
                    <h3 className='font-DancingScript font-bold text-xl'>CÔCÔ MANAGEMENT</h3>
                    <div className="relative flex flex-row gap-5 justify-center items-center">
                        <img src={ProfileIconDashboard} className="w-10 h-10" />
                        <div className="flex flex-row gap-5 mr-[150px] justify-center items-center">
                            <div className="flex flex-col">
                                <div>{userObject?.name}</div>
                                <div>{userObject?.role}</div>
                            </div>
                            <div onClick={() => setLogOutMenu(!logOutMenu)} className={`cursor-pointer w-4 h-4 flex justify-center items-center ${logOutMenu ? "rotate-180" : ""}`}>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" className="svg-inline--fa fa-caret-down fa-rotate-180 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ color: "rgb(220, 220, 220)" }}><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
                            </div>
                        </div>
                        {logOutMenu && (<div className=" hover:font-bold cursor-pointer text-black bg-white border border-solid border-placeholderTextColor absolute p-2 h-[80px] w-[180px] mt-[140px] flex flex-col gap-4 justify-center">
                            <div className="flex flex-row gap-2 cursor-pointer hover:font-bold" onClick={handleLogOut}>
                                <img src={LogOutIcon} className="w-6 h-6" />
                                <div>Log Out</div>
                            </div>
                            <Link to="/change-password" className="flex flex-row gap-2 cursor-pointer hover:font-bold">
                                <img src={ChangePassword} className="w-6 h-6" />
                                <div>Change Password</div>
                            </Link>
                        </div>)}
                    </div>
                </div>
                <div className="p-5 flex flex-row items-center justify-between">
                    <div>
                        <h1 className="font-bold text-3xl">Dashboard</h1>
                    </div>
                </div>
                {/* <div className="p-5 w-full flex flex-col gap-10">
                    <Space direction="vertical" size={12}>
                        <DatePicker onChange={handleDateChange} className="w-1/6 h-10 " format={dateFormat} />
                    </Space>
                </div> */}
                <div className="p-5 w-full flex flex-col gap-10">
                    <div className="z-10 flex flex-row justify-between h-[50px] gap-8">
                        <Space className="w-1/5" direction="vertical" size={12}>
                            <DatePicker onChange={handleDateChange} className="w-full h-[50px] text-base text-placeholderTextColor" format={dateFormat} />
                        </Space>
                        <div className="flex flex-row gap-20 w-full">
                            {checkAdmin && (<div
                                onClick={handleDepartmentMenu}
                                className="w-1/4 h-[50px] text-base cursor-pointer">
                                <div className="flex flex-col w-full py-3 px-2 border border-solid border-[#d9d9d9] text-placeholderTextColor rounded-[6px]">
                                    <div className="flex flex-row items-center justify-around w-full gap-3">
                                        <div className="ml-4">{selectedDepartment}</div>
                                        <div className={`w-4 h-4 flex justify-center items-center ${departmentMenu ? "rotate-180" : ""}`}>
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" className="svg-inline--fa fa-caret-down fa-rotate-180 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ color: "rgb(220, 220, 220)" }}><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {departmentMenu && (<div className="text-black bg-placeholderTextColor border border-solid border-placeholderTextColor border-t-[#d9d9d9] flex flex-col gap-3 px-2 py-3 items-center w-full overflow-y-scroll max-h-[200px]">
                                    {departmentList.map(({ index, name }) => {
                                        return <div onClick={() => handleChangeSelectedDepartment(name)} className="w-full text-center hover:underline">{name}</div>
                                    })}
                                </div>)}
                            </div>)}
                            <div
                                onClick={handleSeacrh}
                                className="w-1/4 bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700">
                                <button className="search-btn">Suchen</button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#f0f2f5] w-full flex flex-row p-5 font-Changa text-textColor gap-4">
                        <div className="bg-white w-full h-auto p-10">
                            <div className="text-xl italic text-textColor mb-8">{currentDate}</div>
                            {Array.isArray(currentWorkings) && currentWorkings?.length === 0 ? (
                                <div className="font-bold text-2xl text-textColor mb-8">Kein Mitarbeiter</div>
                            ) : (
                                <div className="font-bold text-2xl text-textColor mb-8 flex flex-col">Arbeitsliste
                                    <span className="text-xl italic font-normal">Gesamtzahl der Mitarbeiter: {userListToday?.length} </span>
                                </div>)}
                            <div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                                <table className="w-full table">
                                    <thead className="">
                                        <tr className="">
                                            <th className="p-2 text-left">
                                                <span className="font-bold">Name</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Filiale</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Position</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Schichtcode</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Zeit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="tbody">
                                        {currentWorkings?.map(({ _id, employee_id, employee_name, shift_code, position, time_slot, department_name }) => (
                                            <EmployeeTodayItem
                                                key={_id}
                                                employee_name={employee_name}
                                                employee_id={employee_id}
                                                position={position}
                                                shift_code={shift_code}
                                                department_name={department_name}
                                                time_slot={time_slot}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center items-center mt-4 mb-4">
                                <Pagination
                                    current={currentPageWorking}
                                    pageSize={pageSizeWorking}
                                    total={userListToday?.length}
                                    onChange={handlePageWorkingChange}
                                    className="text-base"
                                />
                            </div>
                        </div>
                    </div>
                    {loading && (<div className="flex w-full h-full items-center justify-center">
                        <div className="loader_search"></div>
                    </div>)}
                    <div className="bg-[#f0f2f5] w-full flex flex-row p-5 font-Changa text-textColor gap-4">
                        <div className="bg-white w-full h-auto p-10">
                            <div className="text-xl italic text-textColor mb-8">{currentDate}</div>
                            {Array.isArray(currentAttends) && currentAttends?.length === 0 ? (
                                <div className="font-bold text-2xl text-textColor mb-8">Keine Anwesenheit</div>
                            ) : (
                                <div className="font-bold text-2xl text-textColor mb-8 flex flex-col">Anwesenheitsliste
                                    <span className="text-xl italic font-normal">Gesamtanwesenheit: {userAttendListToday?.length} </span></div>)}
                            <div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                                <table className="w-full table">
                                    <thead className="">
                                        <tr className="">
                                            <th className="p-2 text-left">
                                                <span className="font-bold">Name</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Filiale</span>
                                            </th>
                                            {/* <th className="p-2 text-left">
                                                <span className="table-title-role">Position</span>
                                            </th> */}
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Schichtcode</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Check-in-Informationen</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role"></span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Check-out-Informationen</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="tbody">
                                        {currentAttends?.map(({ _id, employee_name, employee_id, position, department_name, shift_info, status }) => (
                                            <EmployeeAttendItem
                                                key={_id}
                                                employee_id={employee_id}
                                                employee_name={employee_name}
                                                position={position}
                                                department_name={department_name}
                                                shift_info={shift_info}
                                                status={status}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center items-center mt-4 mb-4">
                                <Pagination
                                    current={currentPageAttend}
                                    pageSize={pageSizeAttend}
                                    total={userAttendListToday?.length}
                                    onChange={handlePageAttendChange}
                                    className="text-base"
                                />
                            </div>
                        </div>
                    </div>
                    {loading && (<div className="flex w-full h-full items-center justify-center">
                        <div className="loader_search"></div>
                    </div>)}
                </div>
            </div>
        </>
    );
}

export default Dashboard;
