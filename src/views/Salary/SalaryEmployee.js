import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./Salary.css"
import ProfileIcon from "../../assets/images/icon-profile.png"
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Space } from 'antd';
import { baseUrl } from "components/api/httpService";
import History from "./History"
dayjs.extend(customParseFormat);
const monthFormat = 'MM/YYYY';
const SalaryEmployee = () => {
    const { employeeId, employeeName } = useParams()
    // console.log(employeeId);
    const [inputMonth, setInputMonth] = useState("")
    const [inputYear, setInputYear] = useState("")
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false);
    const [salaryInfoState, setSalaryInfoState] = useState(true);
    const [attendanceState, setAttendanceState] = useState(false);
    const [history, setHistory] = useState(false)
    const [exportAttendanceStatEmployee, setExportAttendanceStatEmployee] = useState(false)
    const [exportAttendanceHistory, setExportAttendanceHistory] = useState(false)
    const [salaryListByMonth, setSalaryListByMonth] = useState()
    const [attendanceListByMonth, setAttendanceListByMonth] = useState()
    const [historyListByMonth, setHistoryListByMonth] = useState()
    const [filterEmployeeById, setFilterEmployeeById] = useState()
    const [userSalarybyMonthInfoState, setUserSalaryByMonthInfoState] = useState(false)
    const [userSalarybyMonth, setUserSalaryByMonth] = useState()
    const [checkAdmin, setCheckAdmin] = useState(false)
    const [checkManager, setCheckManager] = useState(false)

    const [month, setMonth] = useState()
    const [year, setYear] = useState()

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const [monthPicker, setMonthPicker] = useState("")

    const handleMonthChange = (date, dateString) => {
        console.log('Selected Date:', dateString);
        setMonthPicker(dateString)
    };

    useEffect(() => {
        if (userObject?.role === 'Admin') {
            setCheckAdmin(true)
        }

        if (userObject?.role === 'Manager') {
            setCheckManager(true)
        }

    }, [userObject?.role]);

    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        setSalaryInfoState(true)

        const handleApi = async () => {
            setMonth(currentMonth)
            setYear(currentYear)

            if (userObject?.role === 'Admin') {
                try {
                    const { data } = await axios.get(
                        `${baseUrl}/api/admin/manage-stats/get?year=${currentYear}&month=${currentMonth}&employeeID=${employeeId}&employeeName=${employeeName}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );
                    setSalaryListByMonth(data?.message)
                    // console.log(data?.);
                } catch (err) {
                    alert(err.response?.data?.message)
                    setSalaryListByMonth([])
                } finally {
                    setLoading(false)
                }

                try {
                    const { data } = await axios.get(
                        `${baseUrl}/api/admin/manage-attendance/get-stats?employeeID=${employeeId}&employeeName=${employeeName}&year=${currentYear}&month=${currentMonth}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );
                    setUser(data?.message)
                    // console.log(data?.);
                } catch (error) {
                    // Handle error
                    console.error("Error submitting form:", error);
                } finally {
                    setLoading(false)
                }

                try {
                    const { data } = await axios.get(
                        `${baseUrl}/api/admin/manage-salary/history/get?employeeID=${employeeId}&employeeName=${employeeName}&year=${currentYear}&month=${currentMonth}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );
                    setHistoryListByMonth(data?.message)
                    // console.log("data", data?.message);
                    // console.log(data?.);
                } catch (err) {
                    // alert("No salary recorded")
                }

            }

            if (userObject?.role === 'Inhaber') {
                try {
                    setSalaryInfoState(true)
                    const { data } = await axios.get(
                        `${baseUrl}/api/inhaber/manage-stats/get?year=${currentYear}&month=${currentMonth}&inhaber_name=${userObject?.name}&employeeID=${employeeId}&employeeName=${employeeName}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );
                    setSalaryListByMonth(data?.message)
                    // console.log(data?.);
                } catch (error) {
                    // Handle error
                    console.error("Error submitting form:", error);
                } finally {
                    setLoading(false)
                }

                try {
                    setSalaryInfoState(true)
                    const { data } = await axios.get(
                        `${baseUrl}/api/inhaber/manage-attendance/get-stats?inhaber_name=${userObject?.name}&year=${currentYear}&month=${currentMonth}&employeeID=${employeeId}&employeeName=${employeeName}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );
                    setUser(data?.message)
                    console.log("user", data?.message);
                } catch (error) {
                    // Handle error
                    console.error("Error submitting form:", error);
                } finally {
                    setLoading(false)
                }

                try {
                    const { data } = await axios.get(
                        `${baseUrl}/api/inhaber/manage-salary/history/get?employeeID=${employeeId}&employeeName=${employeeName}&year=${currentYear}&month=${currentMonth}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );
                    setHistoryListByMonth(data?.message)
                    // console.log("data", data?.message);
                    // console.log(data?.);
                } catch (err) {
                    // alert("No salary recorded")
                }
            }
        }

        const getAttendanceHistoryByMonth = async () => {
            if (userObject?.role === 'Admin') {
                try {
                    const { data } = await axios.get(
                        `${baseUrl}/api/admin/manage-attendance/get-by-specific?employeeID=${employeeId}&employeeName=${employeeName}&year=${currentYear}&month=${currentMonth}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );
                    setAttendanceListByMonth(data?.message)
                    // console.log(data?.);
                } catch (err) {
                    alert(err.response?.data?.message)
                    setAttendanceListByMonth([])
                } finally {
                    setLoading(false)
                }
            }

            if (userObject?.role === 'Inhaber') {
                try {
                    const { data } = await axios.get(
                        `${baseUrl}/api/inhaber/manage-attendance/get-by-specific?inhaber_name=${userObject?.name}&employeeID=${employeeId}&employeeName=${employeeName}&year=${currentYear}&month=${currentMonth}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );
                    setAttendanceListByMonth(data?.message)
                    // console.log(data?.);
                } catch (err) {
                    alert(err.response?.data?.message)
                    setAttendanceListByMonth([])
                } finally {
                    setLoading(false)
                }
            }
        }
        handleApi()
        getAttendanceHistoryByMonth()

    }, [userObject?.role]);

    const handleSeacrh = async () => {
        setLoading(true);
        setMonth(monthPicker.substring(0, 2))
        setYear(monthPicker.substring(3, 7))
        if (userObject?.role === 'Admin' && monthPicker !== "") {
            setSalaryListByMonth([])
            try {
                const { data } = await axios.get(
                    `${baseUrl}/api/admin/manage-stats/get?year=${monthPicker.substring(3, 7)}&month=${monthPicker.substring(0, 2)}&employeeID=${employeeId}&employeeName=${employeeName}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setSalaryListByMonth(data?.message)
                setSalaryInfoState(false)
                // console.log(data?.);
            } catch (err) {
                alert(err.response?.data?.message)
                setSalaryListByMonth([])
            } finally {
                setLoading(false)
            }
        }

        if (userObject?.role === 'Admin' && monthPicker !== "") {
            setUser([])
            try {
                const { data } = await axios.get(
                    `${baseUrl}/api/admin/manage-attendance/get-stats?employeeID=${employeeId}&employeeName=${employeeName}&year=${monthPicker.substring(3, 7)}&month=${monthPicker.substring(0, 2)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setUser(data?.message)
                // console.log(data?.);
            } catch (error) {
                // Handle error
                alert(error.response?.data?.message)
                setSalaryInfoState(false)
            } finally {
                setLoading(false)
            }
        }

        if (userObject?.role === 'Admin' && monthPicker !== "") {
            setAttendanceListByMonth([])
            try {
                const { data } = await axios.get(
                    `${baseUrl}/api/admin/manage-attendance/get-by-specific?employeeID=${employeeId}&employeeName=${employeeName}&year=${monthPicker.substring(3, 7)}&month=${monthPicker.substring(0, 2)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setAttendanceListByMonth(data?.message)
                // console.log("attendance list",data?.message)
                // console.log(data?.);
            } catch (err) {
                alert(err.response?.data?.message)
                setAttendanceListByMonth([])
                setSalaryInfoState(false)
            } finally {
                setLoading(false)
            }
        }

        if (userObject?.role === 'Admin' && monthPicker !== "") {
            setHistoryListByMonth([])
            try {
                const { data } = await axios.get(
                    `${baseUrl}/api/admin/manage-salary/history/get?employeeID=${employeeId}&employeeName=${employeeName}&year=${monthPicker.substring(3, 7)}&month=${monthPicker.substring(0, 2)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setHistoryListByMonth(data?.message)
                // console.log(data?.);
            } catch (err) {
                alert(err.response?.data?.message)
                setHistoryListByMonth([])
                setSalaryInfoState(false)
            } finally {
                setLoading(false)
            }
        }

        if (userObject?.role === 'Inhaber' && monthPicker !== "") {
            setSalaryListByMonth([])
            try {
                const { data } = await axios.get(
                    `${baseUrl}/api/inhaber/manage-stats/get?year=${monthPicker.substring(3, 7)}&month=${monthPicker.substring(0, 2)}&inhaber_name=${userObject?.name}&employeeID=${employeeId}&employeeName=${employeeName}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setSalaryListByMonth(data?.message)
                // console.log(data?.);
            } catch (error) {
                // Handle error
                alert(error.response?.data?.message)
                setSalaryInfoState(false)
            } finally {
                setLoading(false)
            }
        }

        if (userObject?.role === 'Inhaber' && monthPicker !== "") {
            setUser([])
            try {
                const { data } = await axios.get(
                    `${baseUrl}/api/inhaber/manage-attendance/get-stats?inhaber_name=${userObject?.name}&year=${monthPicker.substring(3, 7)}&month=${monthPicker.substring(0, 2)}&employeeID=${employeeId}&employeeName=${employeeName}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setUser(data?.message)
                console.log("user", data?.message);
            } catch (error) {
                // Handle error
                alert(error.response?.data?.message)
                setSalaryInfoState(false)
            } finally {
                setLoading(false)
            }
        }
        if (userObject?.role === 'Inhaber' && monthPicker !== "") {
            setAttendanceListByMonth([])
            try {
                const { data } = await axios.get(
                    `${baseUrl}/api/inhaber/manage-attendance/get-by-specific?inhaber_name=${userObject?.name}&employeeID=${employeeId}&employeeName=${employeeName}&year=${monthPicker.substring(3, 7)}&month=${monthPicker.substring(0, 2)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setAttendanceListByMonth(data?.message)
                // console.log(data?.);
            } catch (err) {
                alert(err.response?.data?.message)
                setAttendanceListByMonth([])
            } finally {
                setLoading(false)
            }
        }

        if (userObject?.role === 'Inhaber' && monthPicker !== "") {
            setHistoryListByMonth([])
            try {
                const { data } = await axios.get(
                    `${baseUrl}/api/inhaber/manage-salary/history/get?employeeID=${employeeId}&employeeName=${employeeName}&year=${monthPicker.substring(3, 7)}&month=${monthPicker.substring(0, 2)}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setHistoryListByMonth(data?.message)
                // console.log(data?.);
            } catch (err) {
                alert(err.response?.data?.message)
                setHistoryListByMonth([])
                setSalaryInfoState(false)
            } finally {
                setLoading(false)
            }
        }
    }


    const handleExportAttendanceStatEmloyeeFile = async () => {
        try {
            if (userObject?.role === "Admin") {
                const { data } = await axios.post(
                    `${baseUrl}/api/admin/manage-xlsx/attendance-stats`,
                    {
                        employees:user
                    },
                    {
                        responseType: "arraybuffer", headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const link = document.createElement("a");

                link.href = window.URL.createObjectURL(blob);
                link.download = `Employee_Attendance_Stat_${monthPicker.substring(0, 2)}_${monthPicker.substring(3, 7)}.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            if (userObject?.role === "Inhaber") {
                const { data } = await axios.post(
                    `${baseUrl}/api/inhaber/manage-xlsx/attendance-stats`,
                    {
                        employees: user
                    },
                    {
                        responseType: "arraybuffer", headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const link = document.createElement("a");

                link.href = window.URL.createObjectURL(blob);
                link.download = `Employee_Attendance_Stat_${monthPicker.substring(0, 2)}_${monthPicker.substring(3, 7)}.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error exporting Excel file:", error);
        } finally {
            setLoading(false);
            setExportAttendanceStatEmployee(false)
        }


    }

    const handleExportAttendanceHistoryEmloyeeFile = async () => {
        try {
            if (userObject?.role === "Admin") {
                const { data } = await axios.post(
                    `${baseUrl}/api/admin/manage-xlsx/attendance-data`,
                    {
                        attendanceRecords:attendanceListByMonth
                    },
                    {
                        responseType: "arraybuffer", headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const link = document.createElement("a");

                link.href = window.URL.createObjectURL(blob);
                link.download = `Employee_Attendance_History_${employeeId}_${monthPicker.substring(0, 2)}_${monthPicker.substring(3, 7)}.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            if (userObject?.role === "Inhaber") {
                const { data } = await axios.post(
                    `${baseUrl}/api/inhaber/manage-xlsx/attendance-data`,
                    {
                        attendanceRecords:attendanceListByMonth
                    },
                    {
                        responseType: "arraybuffer", headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const link = document.createElement("a");

                link.href = window.URL.createObjectURL(blob);
                link.download = `Employee_Attendance_History_${employeeId}_${monthPicker.substring(0, 2)}_${monthPicker.substring(3, 7)}.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error exporting Excel file:", error);
        } finally {
            setLoading(false);
            setExportAttendanceHistory(false)
        }


    }
    return (
        <div>
            {checkManager ? (<div className="ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">YOU CANNOT ACCESS THIS ROUTE</div>) : (<div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <h1 className="font-bold text-3xl">Salary Employee</h1>
                        <div className="flex flex-row">
                            <Link className="text-xl font-semibold leading-6 hover:underline" to="/dashboard">Dashboard</Link>
                            <span className="text-[#6c757d] font-xl">/ Salary</span>
                            <Link className="text-[#6c757d] font-xl leading-6 hover:underline" to="/salary/summarize">/ Salary Summarize</Link>
                            <span className="text-[#6c757d] font-xl leading-6">/ Salary Employee</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-row px-4 gap-4">
                            <button onClick={() => setExportAttendanceStatEmployee(!exportAttendanceStatEmployee)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                                <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                                Export Attendance Stat
                            </button>
                        </div>
                        <div className="flex flex-row px-4 gap-4">
                            <button onClick={() => setExportAttendanceHistory(!exportAttendanceHistory)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                                <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                                Export Attendance History
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border border-solid border-t-[#6c757d]"></div>
                {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                    <div className="loader"></div>
                </div>)}
                <div className="z-10 flex flex-row mt-10 justify-between h-[50px]">
                    <div className="flex flex-row gap-20 w-3/5">
                        <Space className="w-1/3 text-[#6c757d]" direction="vertical" size={12}>
                            <DatePicker onChange={handleMonthChange} className="w-full h-[50px] text-base text-placeholderTextColor" format={monthFormat} picker="month" />
                        </Space>
                    </div>
                    <div
                        onClick={handleSeacrh}
                        className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700 w-1/6">
                        <button className="search-btn">Seacrh</button>
                    </div>
                </div>
                <h1 className="text-xl">Time: {month}/{year}</h1>
                <div className="bg-white h-auto w-full flex flex-col rounded-md mt-5">
                    <div className="flex flex-row gap-4 text-xl">
                        <div
                            onClick={() => {
                                setAttendanceState(false)
                                setSalaryInfoState(true)
                                setHistory(false)
                            }}
                            className={`hover:text-buttonColor1 cursor-pointer ${salaryInfoState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}
                        >
                            Attendance Overview</div>
                        <div
                            onClick={() => {
                                setAttendanceState(true)
                                setSalaryInfoState(false)
                                setHistory(false)
                            }}
                            className={`hover:text-buttonColor1 cursor-pointer ${attendanceState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}
                        >
                            Attendance History</div>
                        <div
                            onClick={() => {
                                setAttendanceState(false)
                                setSalaryInfoState(false)
                                setHistory(true)
                            }}
                            className={`hover:text-buttonColor1 cursor-pointer ${history ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}
                        >
                            Salary History</div>
                    </div>
                </div>

                {salaryInfoState ? (salaryListByMonth?.map(({ employee_name, employee_id, default_schedule_times, realistic_schedule_times, attendance_total_times, month, year }) => (
                    <div className="bg-[#f0f2f5] w-full flex flex-row p-5 font-Changa text-textColor gap-4">
                        <div className="bg-white h-auto w-1/3 flex flex-col p-4 rounded-md">
                            <div className="flex flex-col justify-center items-center gap-1 mt-4">
                                <img src={ProfileIcon} className="w-32 h-32" />
                                <span className="mt-3 font-bold text-xl">{employee_name}</span>
                                <span className="text-base">Employee's ID: {employee_id}</span>
                            </div>
                        </div>
                        {salaryInfoState && <div className="bg-white h-auto w-2/3 flex flex-col p-4 gap-2 rounded-md">
                            <div className="text-2xl font-semibold leading-6">ATTENDANCE STATS</div>
                            <div className="flex flex-wrap w-full">
                                {user && user[0]?.attendance_stats?.map(({ _id, shift_on_time, shift_late, shift_missing, department_name, month, year }) => (
                                    <div className="flex flex-col w-1/2 py-4 gap-2">
                                        <span>Time: {month}/{year}</span>
                                        <div className="text-xl font-semibold leading-6">Department: {department_name}</div>
                                        <div key={_id} className="flex flex-col gap-2">
                                            <span>Shift Late: {shift_late}</span>
                                            <span>Shift Missing: {shift_missing}</span>
                                            <span>Shift On Time: {shift_on_time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}
                        {salaryInfoState && <div className="bg-white h-auto w-2/3 flex flex-col p-4 gap-6 rounded-md">
                            <div className="text-2xl font-semibold leading-6">SUMMARIZE</div>
                            <span>Time: {month}/{year}</span>
                            <div className="flex flex-col gap-3">
                                <div>Default Working Time: {default_schedule_times}</div>
                                {/* <div>Rest Working Time: {realistic_schedule_times}</div> */}
                                <div> Working Time: {attendance_total_times}</div>
                            </div>
                        </div>}
                    </div>))) : <div className="text-center font-extrabold"></div>}

                {attendanceState && (<div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                    <table className="w-full table">
                        <thead className="">
                            <tr className="">
                                <th className="p-2 text-left">
                                    <span className="font-bold">Date</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-id">Department</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-id">Shift Code</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Positon</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Check in Information</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status"></span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Check out Information</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Car Number</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Check in Km</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Check out Km</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Total Km</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Result (serivce, lito)</span>
                                </th>
                            </tr>
                        </thead>
                        {Array.isArray(attendanceListByMonth) && attendanceListByMonth?.length === 0 ? (
                            <div className="no-result-text text-center"></div>
                        ) : (
                            <tbody className="tbody">
                                {attendanceListByMonth?.map(({ _id, date, department_name, position, shift_info, status, car_info, check_in_km, check_out_km, total_km, results }) => (
                                    <tr className="tr-item" key={_id}>
                                        <td className="p-2">{new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000).getUTCFullYear()}-{String(new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000).getUTCMonth() + 1).padStart(2, '0')}-{String(new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000).getUTCDate()).padStart(2, '0')}</td>
                                        <td className="p-2">{department_name}</td>
                                        <td className="p-2">{shift_info?.shift_code}</td>
                                        <td className="p-2">{position}</td>
                                        <td className="p-2 flex flex-col">
                                            {status === "missing" ? (<span className="p-2">{status}</span>) :
                                                (<div className="p-2 flex flex-col">
                                                    <span>{shift_info?.time_slot?.check_in_time}</span>
                                                    <span className="italic">{shift_info?.time_slot?.check_in_status}</span>
                                                </div>)}
                                        </td>
                                        <td className="p-2"></td>
                                        <td className="p-2 flex flex-col">
                                            <div className="p-2 flex flex-col">
                                                <span>{shift_info?.time_slot?.check_out_time}</span>
                                                <span className="italic">{shift_info?.time_slot?.check_out_status}</span>
                                            </div>
                                        </td>
                                        {position === "Autofahrer" ? (<td className="p-2">{car_info?.car_number}</td>) : (<td className="p-2"></td>)}
                                        {position === "Autofahrer" ? (<td className="p-2">{check_in_km}</td>) : (<td className="p-2"></td>)}
                                        {position === "Autofahrer" ? (<td className="p-2">{check_out_km}</td>) : (<td className="p-2"></td>)}
                                        {position === "Autofahrer" ? (<td className="p-2">{total_km}</td>) : (<td className="p-2"></td>)}
                                        <td>
                                            {(position === "Service" || position === "Lito") ? (
                                                <div className="p-2">{results}</div>
                                            ) : <div className="p-2"></div>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>)}

                {/* {history && (<div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                    <table className="w-full table">
                        <thead className="">
                            <tr className="">
                                <th className="p-2 text-left">
                                    <span className="font-bold">Name</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-id">Employee ID</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Month</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Year</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">netto</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">überweisung</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">optional</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">€/km (0,25)</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">über s x</span>
                                </th>
                            </tr>
                        </thead>
                        {Array.isArray(historyListByMonth) && historyListByMonth?.length === 0 ? (
                            <div className="no-result-text text-center">NO RESULT</div>
                        ) : (
                            <tbody className="tbody">
                                {historyListByMonth?.map(({ employee_id, employee_name, year, month, a_parameter, b_parameter, c_parameter, d_parameter, f_parameter }) => (
                                    <tr className="tr-item" key={employee_id}>
                                        <td className="p-2 hover:text-buttonColor2">
                                            <h2 className="text-left">
                                                <div className="cursor-pointer flex flex-col">{employee_name}
                                                </div>
                                            </h2>
                                        </td>
                                        <td className="p-2">{employee_id}</td>
                                        <td className="p-2">{month}</td>
                                        <td className="p-2">{year}</td>
                                        <td className="p-2">{a_parameter}</td>
                                        <td className="p-2">{b_parameter}</td>
                                        <td className="p-2">{c_parameter}</td>
                                        <td className="p-2">{d_parameter}</td>
                                        <td className="p-2">{f_parameter}</td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>)} */}
                {history && <History historyListByMonth={historyListByMonth}/>}

                {exportAttendanceStatEmployee && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                    <div
                        onClick={() => setExportAttendanceStatEmployee(false)}
                        className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                    <div className="absolute w-[600px] h-[250px] top-[300px] right-[500px] bottom-0 z-30 bg-white">
                        <div className="w-full h-full">
                            <div className="flex flex-col mt-8">
                                <div className="flex flex-row justify-between px-8 items-center">
                                    <div className="font-bold text-xl">Export file</div>
                                    <div
                                        onClick={() => setExportAttendanceStatEmployee(false)}
                                        className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                </div>
                                <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                <div className="flex flex-col px-8 w-full mt-7 font-Changa justify-center items-center gap-4">
                                    <span>Do you want to export Employee_Attendance_Stats_{employeeId}_{monthPicker.substring(0, 2)}_{monthPicker.substring(3, 7)}.xlsx?</span>
                                    <div className="flex flex-row gap-3">
                                        <button onClick={() => setExportAttendanceStatEmployee(false)} type="button" className="w-[100px] bg-rose-800 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointe">No</button>
                                        <button onClick={handleExportAttendanceStatEmloyeeFile} type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Yes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
                {exportAttendanceHistory && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                    <div
                        onClick={() => setExportAttendanceHistory(false)}
                        className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                    <div className="absolute w-[600px] h-[250px] top-[300px] right-[500px] bottom-0 z-30 bg-white">
                        <div className="w-full h-full">
                            <div className="flex flex-col mt-8">
                                <div className="flex flex-row justify-between px-8 items-center">
                                    <div className="font-bold text-xl">Export file</div>
                                    <div
                                        onClick={() => setExportAttendanceHistory(false)}
                                        className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                </div>
                                <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                <div className="flex flex-col px-8 w-full mt-7 font-Changa justify-center items-center gap-4">
                                    <span>Do you want to export Employee_Attendance_History_{employeeId}_{monthPicker.substring(0, 2)}_{monthPicker.substring(3, 7)}.xlsx?</span>
                                    <div className="flex flex-row gap-3">
                                        <button onClick={() => setExportAttendanceHistory(false)} type="button" className="w-[100px] bg-rose-800 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointe">No</button>
                                        <button onClick={handleExportAttendanceHistoryEmloyeeFile} type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Yes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>)}
        </div>

    )
}

export default SalaryEmployee