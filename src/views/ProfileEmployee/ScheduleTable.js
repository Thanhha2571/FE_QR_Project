import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import axios from "axios";
import "date-fns-tz";
import { format } from "date-fns-tz";
import { shiftType } from "assets/data/data";
import { attendanceStatus } from "assets/data/data";
import { useRef } from "react";
import DatePicker from "react-multi-date-picker"
import { TimePicker } from 'antd';
import { baseUrl } from "components/api/httpService";
const formatTimePicker = 'HH:mm:ss';

const ScheduleTable = (props) => {
    const { id, name, departmentDefined, role } = props
    const previousArrayFilter = useRef(null);
    // console.log(departmentDefined);
    const [selectedYear, setSelectedYear] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [FormState, setFormState] = useState(false);
    const [addShiftFormState, setAddShiftFormState] = useState(true);
    const [inforShiftFormState, setInforShiftFormState] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [dateFormDb, setDateFormDb] = useState("")
    const [loading, setLoading] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);
    const [attendanceDataByDate, setAttendanceDataByDate] = useState()
    const [scheduleDataByDate, setScheduleDataByDate] = useState()
    const [scheduleEmployee, setScheduleEmployee] = useState()
    const [shiftDataByDate, setShiftDataByDate] = useState()
    const [employeeStats, setEmployeeStats] = useState()
    const [selectedDepartmentEmployee, setSelectedDepartmentEmployee] = useState('');
    const [selectedPositionEmployee, setSelectedPositionEmployee] = useState('');
    const [selectedShiftType, setSelectedShiftType] = useState()
    const [shiftList, setShiftList] = useState()
    const [selectedShiftAddShiftForm, setSelectedShiftAddShiftForm] = useState("")
    const [changeAttendanceFormState, setChangeAttendanceFormState] = useState([])
    const [selectedCheckInStatus, setSelectedCheckInStatus] = useState("")
    const [selectedCheckOutStatus, setSelectedCheckOutStatus] = useState("")
    const [attendanceId, setAttendanceId] = useState("")
    const [departmentInhaberOrManager, setDepartmentInhaberOrManager] = useState("")
    const [exportState, setExportState] = useState(false)
    const [userObject, setUserObject] = useState()
    const [createAttendanceFormState, setCreateAttendanceFormState] = useState(false)
    const [selectedCheckInStatusCreate, setSelectedCheckInStatusCreate] = useState("")
    const [selectedCheckOutStatusCreate, setSelectedCheckOutStatusCreate] = useState("")
    const [attendanceDateCreate, setAttendanceDateCreate] = useState("")
    const [statusMissing, setStatusMissing] = useState(false)
    const [statusAttendance, setStatusAttendance] = useState("")
    const [checkInTimeMissing, setCheckInTimeMissing] = useState("")
    const [checkOutTimeMissing, setCheckOutTimeMissing] = useState("")
    const [checkInTimeCreate, setCheckInTimeCreate] = useState("")
    const [checkOutTimeCreate, setCheckOutTimeCreate] = useState("")
    const [checkInKm, setCheckInKm] = useState(0)
    const [checkOutKm, setCheckOutKm] = useState(0)
    const [checkRole, setCheckRole] = useState("")
    const [shiftCodeDelete, setShiftCodeDelete] = useState("")
    const [departmentShiftCodeDelete, setDepartmentShiftCodeDelete] = useState("")
    const [dateShiftCodeDelete, setDateShiftCodeDelete] = useState("")
    const [deleteShiftModal, setDeleteShiftModal] = useState(false)
    const [arrayDateDelete, setArrayDateDelete] = useState([])
    //const [shiftCodeCreate, setShiftCodeCreate] = useState("")
    // const today = new Date()
    // const tomorrow = new Date()
    // tomorrow.setDate(tomorrow.getDate() + 1)
    const [datePicker, setDatePicker] = useState("Select Date")

    const [arrayDepartment, setArrayDepartment] = useState()
    // const userString = localStorage.getItem('user');
    // const userObject = userString ? JSON.parse(userString) : null;
    useEffect(() => {
        const userString = localStorage.getItem('user');
        const userObject = userString ? JSON.parse(userString) : null;
        setUserObject(userObject)
        console.log(userObject);
    }, [])

    useEffect(() => {
        if (userObject?.role === 'Admin' || userObject?.role === 'Inhaber') {
            setExportState(true)
        }
    }, [userObject?.role])
    // const [userObject, setUserObject] = useState()

    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkManager, setCheckManager] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)

    const [attendanceData, setAttendanceData] = useState({
        data: {
            check_in_time: '',
            check_out_time: '',
        },
    });

    const [attendanceDataCreate, setAttendanceDataCreate] = useState({
        data: {
            check_in_time: '',
            check_out_time: '',
        },
    });

    const handleChangeAttendanceData = (e) => {
        const { name, value } = e.target;
        setAttendanceData((prevData) => ({
            data: {
                ...prevData.data,
                [name]: value,
            },
        }));
    };

    const handleChangeAttendanceDataCreate = (e) => {
        const { name, value } = e.target;
        setAttendanceDataCreate((prevData) => ({
            data: {
                ...prevData.data,
                [name]: value,
            },
        }));
    };
    const handleShiftClick = (shift) => {
        setSelectedShift(shift);
        // console.log(shift);
    };

    const fetchScheduleEmployyee = async () => {
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-date-design/get-by-specific?employeeID=${id}&employeeName=${name}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                console.log("scheduleEmployeeAll", response.data);
                setScheduleEmployee(response.data);
                // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
            } catch (err) {
                // alert("No shift for this employee")
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-date-design/get-by-specific?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                console.log("scheduleEmployeeAll", response.data);
                setScheduleEmployee(response.data);
                // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
            } catch (err) {
                // alert("No shift for this employee")
            }
        }
        if (userObject?.role === "Manager") {
            try {
                const response = await axios.get(`${baseUrl}/api/manager/manage-date-design/get-by-specific?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                console.log("scheduleEmployeeAll", response.data);
                setScheduleEmployee(response.data);
                // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
            } catch (err) {
                // alert("No shift for this employee")
            }
        }
    };

    const fetchEmployeeStatsByMonth = async () => {
        const year = selectedDate.substring(0, 4);
        const month = selectedDate.substring(5, 7);
        const day = selectedDate.substring(8, 10)
        const date = `${month}/${day}/${year}`

        if (userObject?.role === "Admin" && year !== "" && month !== "" && day !== "" && date !== "") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-stats/get?year=${year}&month=${month}&employeeID=${id}&employeeName=${name}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setEmployeeStats(response.data.message);
                // console.log("attendance stats", response.data.message);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setEmployeeStats([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        }

        if (userObject?.role === "Manager" && year !== "" && month !== "" && day !== "" && date !== "") {
            try {
                const response = await axios.get(`${baseUrl}/api/manager/manage-stats/get?year=${year}&month=${month}&employeeID=${id}&manager_name=${userObject?.name}&employeeName=${name}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setEmployeeStats(response.data.message);
                // console.log("attendance stats", response.data.message);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setEmployeeStats([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        }

        if (userObject?.role === "Inhaber" && year !== "" && month !== "" && day !== "" && date !== "") {
            try {
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-stats/get?year=${year}&month=${month}&employeeID=${id}&inhaber_name=${userObject?.name}&employeeName=${name}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setEmployeeStats(response.data.message);
                // console.log("attendance stats", response.data.message);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setEmployeeStats([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        }

    }
    // useEffect(() => {


    // useEffect(() => {
    //     if (userObject?.role === "Inhaber" || userObject?.role === "Manager") {
    //         const arrayFilter = userObject?.department?.map((item) => item.name);
    //         setDepartmentInhaberOrManager(arrayFilter);

    //         const array = employeeData?.message[0]?.department?.filter(({ name }) =>
    //             departmentInhaberOrManager.includes(name)
    //         );
    //         setArrayDepartment(array)
    //         // console.log("arraydepartment", array);
    //     }
    // }, [userObject?.role]);
    // console.log("department", departmentInhaberOrManager);
    //     setUserObject(userObject)
    //     console.log(userObject);
    // }, [])

    const fetchAttendanceDataByDate = async () => {
        if (userObject?.role === "Admin") {
            try {
                const year = selectedDate.substring(0, 4);
                const month = selectedDate.substring(5, 7);
                const day = selectedDate.substring(8, 10)
                const date = `${month}/${day}/${year}`
                const response = await axios.get(`${baseUrl}/api/admin/manage-attendance/get-by-specific?employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setAttendanceDataByDate(response.data.message);
                console.log("attendance", response.data);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setAttendanceDataByDate([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const year = selectedDate.substring(0, 4);
                const month = selectedDate.substring(5, 7);
                const day = selectedDate.substring(8, 10)
                const date = `${month}/${day}/${year}`
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-attendance/get-by-specific?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setAttendanceDataByDate(response.data.message);
                console.log("attendance", response.data);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setAttendanceDataByDate([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        }
        if (userObject?.role === "Manager") {
            try {
                const year = selectedDate.substring(0, 4);
                const month = selectedDate.substring(5, 7);
                const day = selectedDate.substring(8, 10)
                const date = `${month}/${day}/${year}`
                const response = await axios.get(`${baseUrl}/api/manager/manage-attendance/get-by-specific?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setAttendanceDataByDate(response.data.message);
                console.log("attendance", response.data);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setAttendanceDataByDate([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        }
    };
    useEffect(() => {
        if (userObject?.role === 'Admin') {
            setCheckAdmin(true)
            setCheckInhaber(false)
            setCheckManager(false)
        }

        if (userObject?.role === 'Inhaber') {
            setCheckAdmin(false)
            // setSelectedDepartmentEmployee(userObject?.department_name)
            setCheckInhaber(true)
            setCheckManager(false)
        }

        if (userObject?.role === 'Manager') {
            setCheckAdmin(false)
            // setSelectedDepartmentEmployee(userObject?.department_name)
            setCheckInhaber(false)
            setCheckManager(true)
        }
        if (userObject?.role == "Inhaber" || userObject?.role == "Manager") {
            const arrayFilter = userObject?.department?.map((item => item.name))
            setDepartmentInhaberOrManager(arrayFilter)
            // console.log("arrayFilter", departmentInhaberOrManager);
        }

    }, [userObject?.role, userObject?.department_name]);

    const fetchScheduleDataByDate = async () => {
        const year = selectedDate.substring(0, 4);
        const month = selectedDate.substring(5, 7);
        const day = selectedDate.substring(8, 10)
        const date = `${month}/${day}/${year}`

        if (userObject?.role === "Admin" && year !== "" && month !== "" && day !== "" && date !== "") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-date-design/get-by-specific?employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setScheduleDataByDate(response.data.message);
                // console.log("schedule", response.data.message);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        // console.log("No shift designs found for the specified criteria.");
                        setScheduleDataByDate([]);
                    } else {
                        console.error("Error fetching schedule data. Status:", error.response.status, "Message:", error.response.data.message);
                    }
                } else {
                    console.error("Unexpected error:", error.message);
                }
            }
        }

        if (userObject?.role === "Inhaber" && year !== "" && month !== "" && day !== "" && date !== "") {
            try {
                const year = selectedDate.substring(0, 4);
                const month = selectedDate.substring(5, 7);
                const day = selectedDate.substring(8, 10)
                const date = `${month}/${day}/${year}`
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-date-design/get-by-specific?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setScheduleDataByDate(response.data.message);
                // console.log("schedule", response.data.message);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setScheduleDataByDate([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        }

        if (userObject?.role === "Manager" && year !== "" && month !== "" && day !== "" && date !== "") {
            try {
                const year = selectedDate.substring(0, 4);
                const month = selectedDate.substring(5, 7);
                const day = selectedDate.substring(8, 10)
                const date = `${month}/${day}/${year}`
                const response = await axios.get(`${baseUrl}/api/manager/manage-date-design/get-by-specific?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                setScheduleDataByDate(response.data.message);
                // console.log("schedule", response.data.message);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setScheduleDataByDate([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        }
    };

    useEffect(() => {
        const getAllShifts = async () => {
            if (userObject?.role === "Admin") {
                try {
                    const response = await axios.get(`${baseUrl}/api/admin/manage-shift/get-all`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    // console.log(response.data.message);
                    setShiftList(response.data.message);
                } catch (err) {
                    alert(err.response?.data?.message)
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
                } catch (err) {
                    alert(err.response?.data?.message)
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
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }
        };
        getAllShifts()


        const fetchData = async () => {
            if (userObject?.role === "Admin") {
                try {
                    const response = await axios.get(`${baseUrl}/api/admin/manage-employee/get-byId?employeeID=${id}&employeeName=${name}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    // console.log("userData", response.data);
                    setEmployeeData(response.data);
                    // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }
            if (userObject?.role === "Inhaber") {
                try {
                    const response = await axios.get(`${baseUrl}/api/inhaber/manage-employee/get-byId?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    // console.log("userData", response.data);
                    setEmployeeData(response.data);
                    // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }
            if (userObject?.role === "Manager") {
                try {
                    const response = await axios.get(`${baseUrl}/api/manager/manage-employee/get-byId?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    // console.log("userData", response.data);
                    setEmployeeData(response.data);
                    // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }
        };
        fetchData();

        fetchScheduleEmployyee();
        fetchAttendanceDataByDate();

        fetchScheduleDataByDate();
        fetchEmployeeStatsByMonth()
    }, [id, selectedDate, dateFormDb, role, userObject?.role]);

    const renderTileContent = ({ date }) => {
        if (!scheduleEmployee || !scheduleEmployee.message) return null;
        const dataForDate = scheduleEmployee?.message
            ?.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return scheduleDate.toDateString() === date.toDateString();
            })
            .map((schedule) => ({
                departmentName: schedule.department_name,
                shiftCode: schedule.shift_code,
            }));

        return (
            <div className={`font-Changa calendar-tile ${dataForDate?.length > 0 ? "scheduled" : ""}`}>
                {/* You can customize the content of the tile here */}
                {dataForDate?.length > 0 ? (
                    dataForDate.map(({ departmentName, shiftCode }, index) => (
                        <div key={index} className="flex flex-row gap-2 border-solid border-2 border-textColor py-2 rounded-md mt-2 bg-slate-200 items-center">
                            <div className="border border-solid bg-red-800 ml-6 rounded-full w-3 h-3"></div>
                            <div className="text-textColor">{departmentName}: {shiftCode}</div>
                        </div>
                    ))
                ) : (
                    <div></div>
                )}
            </div>
        );
    };

    const handleMonthChange = (date) => {
        setSelectedMonth(date);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userObject.role === 'Admin') {
            try {
                setLoading(true)
                const formattedValues = datePicker.map(formatDate);
                const { data } = await axios.post(
                    `${baseUrl}/api/admin/manage-date-design/create-days?department_name=${selectedDepartmentEmployee}&employeeID=${id}&employeeName=${name}`,
                    {
                        dates: formattedValues,
                        shift_code: selectedShiftAddShiftForm,
                        position: selectedPositionEmployee

                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                // setTimeout(() => {
                //     window.location.reload();
                // }, 3000);
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setFormState(false)
                setDatePicker("")
                // setFormData({
                //     dates: []
                // })
                setSelectedShiftAddShiftForm("")
                setSelectedDepartmentEmployee("")
                setSelectedPositionEmployee("")
                fetchScheduleEmployyee()
                fetchEmployeeStatsByMonth()
                fetchScheduleDataByDate()
            }
        }
        if (userObject.role === 'Inhaber') {
            try {
                setLoading(true)
                const formattedValues = datePicker.map(formatDate);
                const { data } = await axios.post(
                    `${baseUrl}/api/inhaber/manage-date-design/create-days?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&department_name=${selectedDepartmentEmployee}`,
                    {
                        dates: formattedValues,
                        shift_code: selectedShiftAddShiftForm,
                        position: selectedPositionEmployee

                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                // setTimeout(() => {
                //     window.location.reload();
                // }, 3000);
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setFormState(false)
                setDatePicker("")
                // setFormData({
                //     dates: []
                // })
                setSelectedShiftAddShiftForm("")
                setSelectedDepartmentEmployee("")
                setSelectedPositionEmployee("")
                fetchScheduleEmployyee()
                fetchEmployeeStatsByMonth()
                fetchScheduleDataByDate()
            }
        }

        if (userObject.role === 'Manager') {
            try {
                setLoading(true)
                const formattedValues = datePicker.map(formatDate);
                const { data } = await axios.post(
                    `${baseUrl}/api/manager/manage-date-design/create-days?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&department_name=${selectedDepartmentEmployee}`,
                    {
                        dates: formattedValues,
                        shift_code: selectedShiftAddShiftForm,
                        position: selectedPositionEmployee

                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                // setTimeout(() => {
                //     window.location.reload();
                // }, 3000);
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setFormState(false)
                setDatePicker("")
                // setFormData({
                //     dates: []
                // })
                setSelectedShiftAddShiftForm("")
                setSelectedDepartmentEmployee("")
                setSelectedPositionEmployee("")
                fetchScheduleEmployyee()
                fetchEmployeeStatsByMonth()
                fetchScheduleDataByDate()
            }
        }
    }

    const handleClickDay = (value, event) => {

        setFormState(true);

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDate = format(value, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
        const inputDate = new Date(localDate);
        const outputDateFormDb = inputDate.toISOString();
        setSelectedDate(localDate);
        setDateFormDb(outputDateFormDb);

        // console.log("Selected date:", localDate);
        // console.log("loclDate", localDate);
        // console.log("dateformDB", dateFormDb);

        setSelectedShift(null)
    };

    // const shiftForDate = employeeData?.message?.department?.filter((item) => item?.schedule?.date === dateFormDb);
    // console.log("shiftForDate",shiftForDate);

    // if (attendanceDataByDate) {
    //     console.log(attendanceDataByDate);
    // }
    const handleTimeCheckInStatusMissing = (time) => {
        setCheckInTimeMissing(time.format('HH:mm:ss'))
    }

    const handleTimeCheckOutStatusMissing = (time) => {
        setCheckOutTimeMissing(time.format('HH:mm:ss'))
    }

    const handleTimeCheckInCreate = (time) => {
        setCheckInTimeCreate(time.format('HH:mm:ss'))
    }

    const handleTimeCheckOutCreate = (time) => {
        setCheckOutTimeCreate(time.format('HH:mm:ss'))
    }

    const handleSubmitChangeAttendancInfo = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (userObject?.role === 'Admin' && statusAttendance !== "missing") {
            if (checkInTimeMissing !== "" && checkOutTimeMissing === "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing === "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing !== "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
        }
        if (userObject?.role === 'Admin' && statusAttendance !== "missing" && checkRole === "Autofahrer") {
            if (checkInTimeMissing !== "" && checkOutTimeMissing === "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing === "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing !== "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing === "" && checkOutTimeMissing === "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
        }
        if (userObject?.role === 'Admin' && statusAttendance === "missing") {
            try {
                const { data } = await axios.put(
                    `${baseUrl}/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                    {
                        "shift_info.time_slot.check_in_time": checkInTimeMissing,
                        "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                        "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        status: "checked"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                fetchAttendanceDataByDate();
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setChangeAttendanceFormState(false);
                setCheckInTimeMissing("")
                setCheckOutTimeMissing("")
                setSelectedCheckInStatus("")
                setSelectedCheckOutStatus("")
            }
        }

        if (userObject?.role === 'Inhaber' && statusAttendance !== "missing") {
            if (checkInTimeMissing !== "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing !== "" && checkOutTimeMissing === "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing === "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
        }
        if (userObject?.role === 'Inhaber' && statusAttendance !== "missing" && checkRole === "Autofahrer") {
            if (checkInTimeMissing !== "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing !== "" && checkOutTimeMissing === "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing === "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing === "" && checkOutTimeMissing === "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
        }
        if (userObject?.role === 'Inhaber' && statusAttendance === "missing") {
            try {
                const { data } = await axios.put(
                    `${baseUrl}/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                    {
                        "shift_info.time_slot.check_in_time": checkInTimeMissing,
                        "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                        "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        status: "checked"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                fetchAttendanceDataByDate();
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setChangeAttendanceFormState(false);
                setAttendanceData({
                    data: {
                        check_in_time: '',
                        check_out_time: '',
                    },
                });
                setSelectedCheckInStatus("")
                setSelectedCheckOutStatus("")
            }
        }

        if (userObject?.role === 'Manager' && statusAttendance !== "missing") {
            if (checkInTimeMissing !== "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/manager/manage-attendance/update/${attendanceId}?manager_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing !== "" && checkOutTimeMissing === "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/manager/manage-attendance/update/${attendanceId}?manager_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing === "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/manager/manage-attendance/update/${attendanceId}?manager_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
        }
        if (userObject?.role === 'Manager' && statusAttendance !== "missing" && checkRole === "Autofahrer") {
            if (checkInTimeMissing !== "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/manager/manage-attendance/update/${attendanceId}?manager_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing !== "" && checkOutTimeMissing === "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/manager/manage-attendance/update/${attendanceId}?manager_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": checkInTimeMissing,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing === "" && checkOutTimeMissing !== "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/manager/manage-attendance/update/${attendanceId}?manager_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
            if (checkInTimeMissing === "" && checkOutTimeMissing === "") {
                try {
                    const { data } = await axios.put(
                        `${baseUrl}/api/manager/manage-attendance/update/${attendanceId}?manager_name=${userObject?.name}`,
                        {
                            check_in_km: checkInKm,
                            check_out_km: checkOutKm,
                            total_km: Number(checkOutKm) - Number(checkInKm),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }
                    );

                    fetchAttendanceDataByDate();
                } catch (err) {
                    alert(err.response?.data?.message)
                } finally {
                    setLoading(false);
                    setChangeAttendanceFormState(false);
                    setCheckInTimeMissing("")
                    setCheckOutTimeMissing("")
                    setSelectedCheckInStatus("")
                    setSelectedCheckOutStatus("")
                }
            }
        }
        if (userObject?.role === 'Manager' && statusAttendance === "missing") {
            try {
                const { data } = await axios.put(
                    `${baseUrl}/api/manager/manage-attendance/update/${attendanceId}?manager_name=${userObject?.name}`,
                    {
                        "shift_info.time_slot.check_in_time": checkInTimeMissing,
                        "shift_info.time_slot.check_out_time": checkOutTimeMissing,
                        "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        status: "checked"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                fetchAttendanceDataByDate();
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setChangeAttendanceFormState(false);
                setAttendanceData({
                    data: {
                        check_in_time: '',
                        check_out_time: '',
                    },
                });
                setSelectedCheckInStatus("")
                setSelectedCheckOutStatus("")
            }
        }

    };

    const handleSubmitCreateAttendanceInfo = async (e) => {
        const year = selectedDate.substring(0, 4);
        const month = selectedDate.substring(5, 7);
        const day = selectedDate.substring(8, 10)
        const date = `${month}/${day}/${year}`
        e.preventDefault();

        setLoading(true);

        if (userObject?.role === 'Admin') {
            try {
                const { data } = await axios.post(
                    `${baseUrl}/api/admin/manage-attendance/create?employeeID=${id}&employeeName=${name}&date=${date}&shiftCode=${selectedShift}`,
                    {
                        "check_in_time": checkInTimeCreate,
                        "check_out_time": checkOutTimeCreate,
                        "check_in_status": selectedCheckInStatusCreate,
                        "check_out_status": selectedCheckOutStatusCreate,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                fetchAttendanceDataByDate();
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setChangeAttendanceFormState(false);
                setCheckInTimeCreate("")
                setCheckOutTimeCreate("")
                setSelectedCheckInStatusCreate("")
                setSelectedCheckOutStatusCreate("")
            }
        }

        if (userObject?.role === 'Inhaber') {
            try {
                const { data } = await axios.post(
                    `${baseUrl}/api/inhaber/manage-attendance/create?employeeID=${id}&employeeName=${name}&date=${date}&shiftCode=${selectedShift}`,
                    {
                        "check_in_time": checkInTimeCreate,
                        "check_out_time": checkOutTimeCreate,
                        "check_in_status": selectedCheckInStatusCreate,
                        "check_out_status": selectedCheckOutStatusCreate,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                fetchAttendanceDataByDate();
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setChangeAttendanceFormState(false);
                setCheckInTimeCreate("")
                setCheckOutTimeCreate("")
                setSelectedCheckInStatusCreate("")
                setSelectedCheckOutStatusCreate("")
            }
        }


        // if (userObject?.role === 'Manager') {
        //     try {
        //         const { data } = await axios.post(
        //             `${baseUrl}/api/manager/manage-attendance/create?employeeID=${id}&employeeName=${name}&date=${date}&shiftCode=${selectedShift}`,
        //             {
        //                 "check_in_time": checkInTimeCreate,
        //                 "check_out_time": checkOutTimeCreate,
        //                 "check_in_status": selectedCheckInStatusCreate,
        //                 "check_out_status": selectedCheckOutStatusCreate,
        //             },
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${localStorage.getItem("token")}`
        //                 }
        //             }
        //         );

        //         fetchAttendanceDataByDate();
        //     } catch (err) {
        //         alert(err.response?.data?.message)
        //     } finally {
        //         setLoading(false);
        //         setChangeAttendanceFormState(false);
        //         setCheckInTimeCreate("")
        //         setCheckOutTimeCreate("")
        //         setSelectedCheckInStatusCreate("")
        //         setSelectedCheckOutStatusCreate("")
        //     }
        // }
    };

    const handleDeleteShift = async () => {
        if (userObject?.role === 'Admin') {
            arrayDateDelete.push(dateShiftCodeDelete)
            console.log(arrayDateDelete);
            console.log(shiftCodeDelete);
            try {
                const { data } = await axios.put(
                    `${baseUrl}/api/admin/manage-date-design/delete?employeeID=${id}&employeeName=${name}&department_name=${departmentShiftCodeDelete}`,
                    {
                        shift_code: shiftCodeDelete,
                        dates: arrayDateDelete
                    },
                );
                fetchScheduleEmployyee();
            } catch (err) {
                alert(err.response?.data?.message)
                setArrayDateDelete([])
            } finally {
                setDeleteShiftModal(false)
                setFormState(false)
                setArrayDateDelete([])
                fetchScheduleEmployyee();
                fetchScheduleDataByDate()
            }

        }

        if (userObject?.role === 'Manager') {
            arrayDateDelete.push(dateShiftCodeDelete)
            console.log(arrayDateDelete);
            console.log(shiftCodeDelete);
            try {
                const { data } = await axios.put(
                    `${baseUrl}/api/manager/manage-date-design/delete?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&department_name=${departmentShiftCodeDelete}`,
                    {
                        shift_code: shiftCodeDelete,
                        dates: arrayDateDelete
                    },
                );
            } catch (err) {
                alert(err.response?.data?.message)
                setArrayDateDelete([])
            } finally {
                setDeleteShiftModal(false)
                setFormState(false)
                setArrayDateDelete([])
                fetchScheduleDataByDate()
                fetchScheduleEmployyee();
            }

        }

        if (userObject?.role === 'Inhaber') {
            arrayDateDelete.push(dateShiftCodeDelete)
            console.log(arrayDateDelete);
            console.log(shiftCodeDelete);
            try {
                const { data } = await axios.put(
                    `${baseUrl}/api/inhaber/manage-date-design/delete?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&department_name=${departmentShiftCodeDelete}`,
                    {
                        shift_code: shiftCodeDelete,
                        dates: arrayDateDelete
                    },
                );
            } catch (err) {
                alert(err.response?.data?.message)
                setArrayDateDelete([])
            } finally {
                setDeleteShiftModal(false)
                setFormState(false)
                setArrayDateDelete([])
                fetchScheduleDataByDate()
                fetchScheduleEmployyee();
            }

        }
    }

    const handleFormChangeAttend = (index) => {
        setChangeAttendanceFormState(prevState => {
            // Ensure prevState is always an array.
            const newState = Array.isArray(prevState) ? [...prevState] : [];

            // Initialize the state for the given index if it doesn't exist.
            if (newState[index] === undefined) {
                newState[index] = false;
            }

            // Toggle the boolean value at the specified index.
            newState[index] = !newState[index];

            return newState;
        });
    };

    return (
        <div className="flex flex-col justify-center items-center w-full gap-4 font-Changa text-textColor">
            <h2 className="text-2xl font-bold">Schedule Calendar</h2>
            {selectedYear && (
                <Calendar
                    onChange={handleMonthChange}
                    onClickDay={handleClickDay}
                    value={selectedMonth}
                    view="month"
                    showNeighboringMonth={false}
                    tileContent={renderTileContent}
                />
            )}

            {/* //---------------------------------------------------------------- ADD SHIFT FOR EMPLOYEE ----------------------------------------------------------------// */}
            {FormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setFormState(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer "></div>
                <div className="absolute w-[750px] top-0 right-0 bottom-0 z-30 bg-white overflow-y-auto">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="flex flex-row items-center gap-4">
                                    <div
                                        onClick={() => {
                                            setAddShiftFormState(true)
                                            setInforShiftFormState(false)
                                        }}
                                        className={`cursor-pointer font-bold text-xl ${addShiftFormState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Schicht hinzufügen</div>
                                    <div
                                        onClick={() => {
                                            setAddShiftFormState(false)
                                            setInforShiftFormState(true)
                                        }}
                                        className={`cursor-pointer font-bold text-xl ${inforShiftFormState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Schichtinformationen</div>
                                </div>
                                <div
                                    onClick={() => setFormState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            {addShiftFormState && (<div className="flex flex-col px-8 w-full mt-7">
                                {employeeStats?.map((item, index) => (
                                    <div key={index}>übrige Zeit: {item?.realistic_schedule_times}</div>
                                ))}
                                <form
                                    className="flex flex-col gap-6 w-full justify-center items-center"
                                    onSubmit={handleSubmit}>
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center z-10">
                                        <div className="loader_search"></div>
                                    </div>)}
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Schichtcode</span>
                                        </div>
                                        <select
                                            id="shift_code"
                                            name="shift_code"
                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9]"
                                            value={selectedShiftAddShiftForm}
                                            onChange={(e) => setSelectedShiftAddShiftForm(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Schichtcode auswählen*</option>
                                            {shiftList?.map((item, index) => (
                                                <option className='text-sm text-textColor w-full' key={index} value={item.code}>
                                                    {item.code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {checkAdmin && (<div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Filiale</span>
                                        </div>
                                        <select
                                            id="department"
                                            name="department"
                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9]"
                                            value={selectedDepartmentEmployee}
                                            onChange={(e) => setSelectedDepartmentEmployee(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Abteilung auswählen*</option>
                                            {departmentDefined?.map((item, index) => (
                                                <option className='text-sm text-textColor w-full' key={index} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>)}
                                    {checkAdmin && (<div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Position</span>
                                        </div>
                                        <select
                                            id="position"
                                            name="position"
                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9]"
                                            value={selectedPositionEmployee}
                                            onChange={(e) => setSelectedPositionEmployee(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Position auswählen*</option>
                                            {employeeData?.message[0]?.department
                                                ?.filter((dept) => dept.name === selectedDepartmentEmployee)
                                                ?.map((dept) =>
                                                    dept?.position?.map((item, index) => (
                                                        <option className='text-sm text-textColor w-full' key={index} value={item}>
                                                            {item}
                                                        </option>
                                                    ))
                                                )}
                                        </select>
                                    </div>)}
                                    {checkInhaber && (<div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Filiale</span>
                                        </div>
                                        <select
                                            id="department"
                                            name="department"
                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9]"
                                            value={selectedDepartmentEmployee}
                                            onChange={(e) => setSelectedDepartmentEmployee(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Abteilung auswählen*</option>
                                            {/* {departmentInhaberOrManager?.map((item, index) => (
                                                <option className='text-sm text-textColor w-full' key={index} value={item}>
                                                    {item}
                                                </option>
                                            ))} */}
                                            {employeeData?.message[0]?.department
                                                ?.filter((item) => departmentInhaberOrManager.includes(item.name))
                                                .map((item, index) => (
                                                    <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>)}
                                    {checkInhaber && (<div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Position</span>
                                        </div>
                                        <select
                                            id="position"
                                            name="position"
                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9]"
                                            value={selectedPositionEmployee}
                                            onChange={(e) => setSelectedPositionEmployee(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Position auswählen*</option>
                                            {employeeData?.message[0]?.department
                                                ?.filter((dept) => dept.name === selectedDepartmentEmployee)
                                                ?.map((dept) =>
                                                    dept?.position?.map((item, index) => (
                                                        <option className='text-sm text-textColor w-full' key={index} value={item}>
                                                            {item}
                                                        </option>
                                                    ))
                                                )}
                                        </select>
                                    </div>)}
                                    {checkManager && (<div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Filiale</span>
                                        </div>
                                        <select
                                            id="department"
                                            name="department"
                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9]"
                                            value={selectedDepartmentEmployee}
                                            onChange={(e) => setSelectedDepartmentEmployee(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Select Department*</option>
                                            {/* {departmentInhaberOrManager?.map((item, index) => (
                                                <option className='text-sm text-textColor w-full' key={index} value={item}>
                                                    {item}
                                                </option>
                                            ))} */}
                                            {employeeData?.message[0]?.department
                                                ?.filter((item) => departmentInhaberOrManager.includes(item.name))
                                                .map((item, index) => (
                                                    <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>)}
                                    {checkManager && (<div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Position</span>
                                        </div>
                                        <select
                                            id="position"
                                            name="position"
                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9]"
                                            value={selectedPositionEmployee}
                                            onChange={(e) => setSelectedPositionEmployee(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Position auswählen*</option>
                                            {employeeData?.message[0]?.department
                                                ?.filter((dept) => dept.name === selectedDepartmentEmployee)
                                                ?.map((dept) =>
                                                    dept?.position?.map((item, index) => (
                                                        <option className='text-sm text-textColor w-full' key={index} value={item}>
                                                            {item}
                                                        </option>
                                                    ))
                                                )}
                                        </select>
                                    </div>)}
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Dates</span>
                                        </div>
                                        {/* <input
                                            type="text"
                                            name="dates"
                                            required
                                            value={formData.data?.dates?.join(",")}
                                            onChange={handleChange}
                                            placeholder="Enter date (format: MM/DD/YYYY) and separate by commas ..."
                                        /> */}
                                        <DatePicker
                                            style={{
                                                height: '42px',
                                                width: '100%',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: '6px',
                                            }}
                                            format="MM/DD/YYYY"
                                            multiple
                                            value={datePicker}
                                            onChange={setDatePicker}
                                        />
                                    </div>
                                    <div
                                        className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                        <button type="submit" className="w-full">Schicht hinzufügen</button>
                                    </div>
                                </form>
                            </div>)}
                            {/* //----------------------------------------------------------------  SHIFT INFORMATION ----------------------------------------------------------------// */}
                            {inforShiftFormState && (<div className="flex flex-col px-8 w-full mt-7 gap-2 font-Changa text-textColor">
                                <div className="font-bold text-2xl">Schichtinformationen</div>
                                <div className="flex flex-row gap-3">
                                    {scheduleDataByDate?.length === 0 ? (
                                        <div className="font-bold text-red-600 text-xl">Für diesen Tag gibt es keine Schicht</div>
                                    ) : (
                                        scheduleDataByDate?.map((item) => (
                                            <div key={item._id} className="flex flex-row gap-4">
                                                <span className={`cursor-pointer ${selectedShift === item.shift_code ? 'text-buttonColor1 underline decoration-buttonColor1' : ''}`} onClick={() => handleShiftClick(item?.shift_code)}>
                                                    {item?.shift_code}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {selectedShift && (
                                    <div>
                                            <div className="flex flex-col gap-3">
                                                <div className="text-center font-bold text-gray-600 text-xl mt-4">Keine Anwesenheitsdaten verfügbar</div>
                                                <div className="flex flex-col">
                                                    <button onClick={() => {
                                                        setCreateAttendanceFormState(!createAttendanceFormState)
                                                    }
                                                    } className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-emerald-700">
                                                        Anwesenheitsinformationen erstellen
                                                    </button>
                                                    {createAttendanceFormState && (<div className="w-full h-full">
                                                        <div className="flex flex-col mt-8">
                                                            <div className="flex flex-row justify-between px-8 items-center">
                                                                <div className="font-bold text-xl">Anwesenheitsinformationen erstellen</div>
                                                            </div>
                                                            {/* <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div> */}
                                                            <div className="flex flex-col px-8 w-full mt-7">
                                                                <form
                                                                    className="flex flex-col gap-6 w-full justify-center items-center"
                                                                    onSubmit={handleSubmitCreateAttendanceInfo}>
                                                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center z-10">
                                                                        <div className="loader_search"></div>
                                                                    </div>)}
                                                                    <div className="w-full h-auto flex flex-col gap-2">
                                                                        <div className="flex flex-row gap-2">
                                                                            <span className="text-rose-500">*</span>
                                                                            <span className="">Check-in-Zeit</span>
                                                                        </div>
                                                                        <TimePicker onChange={handleTimeCheckInCreate} className="w-full h-[42px]" format={formatTimePicker} />
                                                                    </div>
                                                                    <div className="w-full flex flex-col gap-2">
                                                                        <div className="flex flex-row gap-2">
                                                                            <span className="text-rose-500">*</span>
                                                                            <span className="">Check_in_status</span>
                                                                        </div>
                                                                        <select
                                                                            id="check_in_time"
                                                                            name="check_in_time"
                                                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                                                            value={selectedCheckInStatusCreate}
                                                                            onChange={(e) => setSelectedCheckInStatusCreate(e.target.value)}
                                                                        // required
                                                                        >
                                                                            <option value="" disabled className='italic text-sm'>Wählen Sie Status aus*</option>
                                                                            {attendanceStatus?.map((item, index) => (
                                                                                <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="w-full h-auto flex flex-col gap-2">
                                                                        <div className="flex flex-row gap-2">
                                                                            <span className="text-rose-500">*</span>
                                                                            <span className="">Abreisezeit</span>
                                                                        </div>
                                                                        <TimePicker onChange={handleTimeCheckOutCreate} className="w-full h-[42px]" format={formatTimePicker} />
                                                                    </div>
                                                                    <div className="w-full flex flex-col gap-2">
                                                                        <div className="flex flex-row gap-2">
                                                                            <span className="text-rose-500">*</span>
                                                                            <span className="">Überprüfen Sie den Status</span>
                                                                        </div>
                                                                        <select
                                                                            id="check_out_time"
                                                                            name="check_out_time"
                                                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                                                            value={selectedCheckOutStatusCreate}
                                                                            onChange={(e) => setSelectedCheckOutStatusCreate(e.target.value)}
                                                                        // required
                                                                        >
                                                                            <option value="" disabled className='italic text-sm'>Wählen Sie Status aus*</option>
                                                                            {attendanceStatus?.map((item, index) => (
                                                                                <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div
                                                                        className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                                                        <button type="submit" className="w-full">Anwesenheitsinformationen erstellen</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>)}
                                                </div>
                                            </div>

                                            {attendanceDataByDate?.filter((item) => item?.shift_info?.shift_code === selectedShift)
                                                .map((filteredItem, index) => (
                                                    <div className="flex flex-col gap-4" key={filteredItem._id}>
                                                        {filteredItem?.status === "missing" ? (
                                                            <div className="text-center font-bold text-red-600 text-xl" key={filteredItem._id}>STATUS: Fehlen</div>
                                                        ) : (
                                                            <div className="flex flex-col gap-4">
                                                                <div className="flex flex-row justify-between mt-5">
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor2 font-bold text-xl">
                                                                        <div>CHECKIN TIME</div>
                                                                        <div>{filteredItem?.shift_info?.time_slot?.check_in_time}</div>
                                                                        <div className="italic text-xs">Status: {filteredItem?.shift_info?.time_slot?.check_in_status}</div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor1 font-bold text-xl">
                                                                        <div>ARBEITSZEIT</div>
                                                                        <div>{`${filteredItem?.shift_info?.total_hour}h ${filteredItem?.shift_info?.total_minutes}m`}</div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-center items-center font-bold text-red-600 text-xl">
                                                                        <div>CHECKOUT TIME</div>
                                                                        <div>{filteredItem?.shift_info?.time_slot?.check_out_time}</div>
                                                                        <div className="italic text-xs">Status: {filteredItem?.shift_info?.time_slot?.check_out_status}</div>
                                                                    </div>
                                                                </div>
                                                                {filteredItem?.position === "Autofahrer" ? (<div className="flex flex-row justify-between mt-5">
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor2 font-bold text-xl">
                                                                        <div>CHECKIN KM</div>
                                                                        <div>{filteredItem?.check_in_km}</div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor1 font-bold text-xl">
                                                                        <div>GESAMT KM TIME</div>
                                                                        <div>{filteredItem?.total_km}</div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-center items-center font-bold text-red-600 text-xl">
                                                                        <div>CHECKOUT KM</div>
                                                                        <div>{filteredItem?.check_out_km}</div>
                                                                    </div>
                                                                </div>) : (<div></div>)}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <button onClick={() => {
                                                                setAttendanceId(filteredItem?._id)
                                                                // setChangeAttendanceFormState(!changeAttendanceFormState)
                                                                handleFormChangeAttend(index)
                                                                setStatusAttendance(filteredItem?.status)
                                                                setCheckInKm(filteredItem?.check_in_km)
                                                                setCheckOutKm(filteredItem?.check_out_km)
                                                                setCheckRole(filteredItem?.position)
                                                            }
                                                            } className="bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-red-800">
                                                                Anwesenheitsinformationen ändern
                                                            </button>
                                                            {changeAttendanceFormState[index] && (<div className="w-full h-full">
                                                                <div className="flex flex-col mt-8">
                                                                    <div className="flex flex-row justify-between px-8 items-center">
                                                                        <div className="font-bold text-xl">Anwesenheitsinformationen ändern</div>
                                                                    </div>
                                                                    <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                                                    <div className="flex flex-col px-8 w-full mt-7">
                                                                        <form
                                                                            className="flex flex-col gap-6 w-full justify-center items-center"
                                                                            onSubmit={handleSubmitChangeAttendancInfo}>
                                                                            {loading && (<div className="absolute flex w-full h-full items-center justify-center z-10">
                                                                                <div className="loader_search"></div>
                                                                            </div>)}
                                                                            <div className="w-full h-auto flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Teilnahme ID</span>
                                                                                </div>
                                                                                <input
                                                                                    type="text"
                                                                                    name="id"
                                                                                    value={attendanceId}
                                                                                    // onChange={(e) => setAttendanceId(e.target.value)}
                                                                                    className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                                                                    readOnly={true}
                                                                                />
                                                                            </div>
                                                                            {filteredItem?.status === "missing" && (<div className="w-full h-auto flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Status</span>
                                                                                </div>
                                                                                <input
                                                                                    type="text"
                                                                                    name="status"
                                                                                    value={"checked"}
                                                                                    className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                                                                    // onChange={(e) => setAttendanceId(e.target.value)}
                                                                                    readOnly={true}
                                                                                />
                                                                            </div>)}
                                                                            <div className="w-full h-auto flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Check_in_time</span>
                                                                                </div>
                                                                                {/* <input
                                                                                    type="text"
                                                                                    name="check_in_time"
                                                                                    // required
                                                                                    value={attendanceData.data.check_in_time}
                                                                                    onChange={handleChangeAttendanceData}
                                                                                /> */}
                                                                                <TimePicker onChange={handleTimeCheckInStatusMissing} className="w-full h-[42px]" format={formatTimePicker} />
                                                                            </div>
                                                                            <div className="w-full flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Check_in_status</span>
                                                                                </div>
                                                                                <select
                                                                                    id="department"
                                                                                    name="department"
                                                                                    className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                                                                    value={selectedCheckInStatus}
                                                                                    onChange={(e) => setSelectedCheckInStatus(e.target.value)}
                                                                                // required
                                                                                >
                                                                                    <option value="" disabled className='italic text-sm'>Wählen Sie Status aus*</option>
                                                                                    {attendanceStatus?.map((item, index) => (
                                                                                        <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                                                            {item.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <div className="w-full h-auto flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Abreisezeit</span>
                                                                                </div>
                                                                                {/* <input
                                                                                    type="text"
                                                                                    name="check_out_time"
                                                                                    // required
                                                                                    value={attendanceData.data.check_out_time}
                                                                                    onChange={handleChangeAttendanceData}
                                                                                /> */}
                                                                                <TimePicker onChange={handleTimeCheckOutStatusMissing} className="w-full h-[42px]" format={formatTimePicker} />
                                                                            </div>
                                                                            <div className="w-full flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Überprüfen Sie den Status</span>
                                                                                </div>
                                                                                <select
                                                                                    id="department"
                                                                                    name="department"
                                                                                    className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                                                                    value={selectedCheckOutStatus}
                                                                                    onChange={(e) => setSelectedCheckOutStatus(e.target.value)}
                                                                                // required
                                                                                >
                                                                                    <option value="" disabled className='italic text-sm'>Wählen Sie Status aus*</option>
                                                                                    {attendanceStatus?.map((item, index) => (
                                                                                        <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                                                            {item.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            {filteredItem?.position === "Autofahrer" && (<div className="w-full h-auto flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Check In Km</span>
                                                                                </div>
                                                                                <input
                                                                                    type="text"
                                                                                    name="id"
                                                                                    value={checkInKm}
                                                                                    onChange={(e) => setCheckInKm(e.target.value)}
                                                                                    className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                                                                />
                                                                            </div>)}
                                                                            {filteredItem?.position === "Autofahrer" && (<div className="w-full h-auto flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Check Out Km</span>
                                                                                </div>
                                                                                <input
                                                                                    type="text"
                                                                                    name="id"
                                                                                    value={checkOutKm}
                                                                                    onChange={(e) => setCheckOutKm(e.target.value)}
                                                                                    className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                                                                />
                                                                            </div>)}
                                                                            <div
                                                                                className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                                                                <button type="submit" className="w-full">Änderungen speichern</button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>)}
                                                        </div>
                                                    </div>
                                                    //     </div>
                                                    // </div>
                                                ))}
                                    </div>
                                )}
                                <div className="w-full border border-solid border-t-[rgba(0,0,0,.10)] mt-4"></div>
                                {selectedShift && (
                                    <div>
                                        {scheduleDataByDate
                                            ?.filter((item) => item?.shift_code === selectedShift)
                                            .map((filteredItem) => (
                                                <div className="w-full flex flex-col justify-center items-center gap-3 mt-3 text-base">
                                                    <div className="flex flex-wrap w-full items-center justify-center">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Employee's Name</span>
                                                        <span className="w-2/3">{name}</span>
                                                    </div>
                                                    <div className="flex flex-wrap w-full items-center justify-center">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Employee's ID</span>
                                                        <span className="w-2/3">{id}</span>
                                                    </div>
                                                    <div className="flex flex-wrap w-full items-center justify-center">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Filiale</span>
                                                        <span className="w-2/3">{filteredItem?.department_name}</span>
                                                    </div>
                                                    <div className="flex flex-wrap w-full items-center justify-center">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Rolle</span>
                                                        <span className="w-2/3">{role}</span>
                                                    </div>
                                                    <div className="flex flex-wrap w-full items-center justify-center">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Position</span>
                                                        <span className="w-2/3">{filteredItem?.position}</span>
                                                    </div>
                                                    <div className="flex flex-wrap w-full items-center justify-center">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Date</span>
                                                        <span className="w-2/3">{selectedDate.substring(0, 10)}</span>
                                                    </div>
                                                    <div className="flex flex-wrap w-full items-center justify-center">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Schichtcode</span>
                                                        <span className="w-2/3">{selectedShift}</span>
                                                    </div>
                                                    <div className="flex flex-wrap w-full items-center justify-center mb-5">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Time</span>
                                                        <span className="w-2/3">{filteredItem?.time_slot?.start_time} ~ {filteredItem?.time_slot?.end_time}</span>
                                                    </div>
                                                    <button onClick={() => {
                                                        setShiftCodeDelete(selectedShift)
                                                        setDepartmentShiftCodeDelete(filteredItem?.department_name)
                                                        setDateShiftCodeDelete(`${selectedDate.substring(5, 7)}/${selectedDate.substring(8, 10)}/${selectedDate.substring(0, 4)}`)
                                                        setDeleteShiftModal(true)
                                                    }}
                                                        className="bg-red-600 w-full text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-red-800">
                                                        Delete Shift
                                                    </button>
                                                    {deleteShiftModal && (<div className="flex justify-center items-center w-full font-Changa mt-5">
                                                        <div className="w-[400px] h-[200px] bg-white border border-stone-[rgba(0,0,0,.45)]">
                                                            <div className="w-full h-[200px]">
                                                                <div className="flex flex-col mt-8">
                                                                    <div className="flex flex-row justify-between px-8 items-center">
                                                                        <div className="font-bold text-xl">Schicht löschen</div>
                                                                        <div
                                                                            onClick={() => setDeleteShiftModal(false)}
                                                                            className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                                                    </div>

                                                                    <div className="flex flex-col px-8 w-full mt-7 font-Changa justify-center items-center gap-4">
                                                                        <span>Möchten Sie diese Schicht wirklich löschen?</span>
                                                                        <div className="flex flex-row gap-3">
                                                                            <button onClick={() => setDeleteShiftModal(false)} type="button" className="w-[100px] bg-rose-800 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointe">No</button>
                                                                            <button onClick={handleDeleteShift} type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Yes</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>)}
                                                </div>
                                            ))}
                                    </div>
                                )}
                                {exportState && (selectedShift && (
                                    <div>
                                        {attendanceDataByDate
                                            ?.filter((item) => item?.shift_info?.shift_code === selectedShift)
                                            .map((filteredItem) => (
                                                <div className="w-full flex flex-col gap-3 mt-3 text-base">
                                                    {filteredItem?.position === "Autofahrer" && (<div className="flex flex-col gap-3">
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Car Number</span>
                                                            <span className="w-2/3">{filteredItem?.car_info?.car_number}</span>
                                                        </div>
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Car Type</span>
                                                            <span className="w-2/3">{filteredItem?.car_info?.car_type}</span>
                                                        </div>
                                                        <div className="flex flex-wrap w-full items-center justify-center">
                                                            <span className="text-[#6c757d] w-1/3 text-right px-3">Register Date</span>
                                                            <span className="w-2/3">{filteredItem?.car_info?.register_date?.substring(0, 10)}</span>
                                                        </div>
                                                    </div>)}
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>)}
                        </div>
                    </div>
                </div>
            </div >)}
        </div >
    );
};

export default ScheduleTable;