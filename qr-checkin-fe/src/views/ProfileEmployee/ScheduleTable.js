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
    const [changeAttendanceFormState, setChangeAttendanceFormState] = useState(false)
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
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-date-design/get-by-specific?employeeID=${id}&employeeName=${name}`, { withCredentials: true });
                console.log("scheduleEmployeeAll", response.data);
                setScheduleEmployee(response.data);
                // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
            } catch (err) {
                alert("No shift for this employee")
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-date-design/get-by-specific?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, { withCredentials: true });
                console.log("scheduleEmployeeAll", response.data);
                setScheduleEmployee(response.data);
                // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
            } catch (err) {
                alert("No shift for this employee")
            }
        }
        if (userObject?.role === "Manager") {
            try {
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/manager/manage-date-design/get-by-specific?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, { withCredentials: true });
                console.log("scheduleEmployeeAll", response.data);
                setScheduleEmployee(response.data);
                // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
            } catch (err) {
                alert("No shift for this employee")
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
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-stats/get?year=${year}&month=${month}&employeeID=${id}&employeeName=${name}`, { withCredentials: true });
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
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/manager/manage-stats/get?year=${year}&month=${month}&employeeID=${id}&manager_name=${userObject?.name}&employeeName=${name}`, { withCredentials: true });
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
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-stats/get?year=${year}&month=${month}&employeeID=${id}&inhaber_name=${userObject?.name}&employeeName=${name}`, { withCredentials: true });
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
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-attendance/get-by-specific?employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, { withCredentials: true });

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
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-attendance/get-by-specific?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, { withCredentials: true });

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
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-date-design/get-by-specific?employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, { withCredentials: true });
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
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-date-design/get-by-specific?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&year=${year}&month=${month}&date=${date}`, { withCredentials: true });

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
                    const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-shift/get-all', { withCredentials: true });
                    // console.log(response.data.message);
                    setShiftList(response.data.message);
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }

            if (userObject?.role === "Inhaber") {
                try {
                    const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-shift/get-all', { withCredentials: true });
                    // console.log(response.data.message);
                    setShiftList(response.data.message);
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }
            if (userObject?.role === "Manager") {
                try {
                    const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/manager/manage-shift/get-all', { withCredentials: true });
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
                    const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-employee/get-byId?employeeID=${id}&employeeName=${name}`, { withCredentials: true });
                    // console.log("userData", response.data);
                    setEmployeeData(response.data);
                    // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }
            if (userObject?.role === "Inhaber") {
                try {
                    const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-employee/get-byId?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, { withCredentials: true });
                    // console.log("userData", response.data);
                    setEmployeeData(response.data);
                    // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }
            if (userObject?.role === "Manager") {
                try {
                    const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/manager/manage-employee/get-byId?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, { withCredentials: true });
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

    // const [formData, setFormData] = useState({
    //     data: {
    //         dates: [],
    //     },
    // });

    // const handleChange = (e) => {
    //     const { name, value } = e.target;

    //     // If the field is 'dates', split the input into an array
    //     const updatedValue = name === "dates" ? value.split(",") : value;

    //     setFormData((prevData) => ({
    //         data: {
    //             ...prevData.data,
    //             [name]: updatedValue,
    //         },
    //     }));
    // };

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
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-date-design/create-days?department_name=${selectedDepartmentEmployee}&employeeID=${id}&employeeName=${name}`,
                    {
                        dates: formattedValues,
                        shift_code: selectedShiftAddShiftForm,
                        position: selectedPositionEmployee

                    },
                    { withCredentials: true }
                );
                fetchScheduleEmployyee()
                fetchEmployeeStatsByMonth()
                fetchScheduleDataByDate()
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
            }
        }
        if (userObject.role === 'Inhaber') {
            try {
                setLoading(true)
                const formattedValues = datePicker.map(formatDate);
                const { data } = await axios.post(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-date-design/create-days?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&department_name=${selectedDepartmentEmployee}`,
                    {
                        dates: formattedValues,
                        shift_code: selectedShiftAddShiftForm,
                        position: selectedPositionEmployee

                    },
                    { withCredentials: true }
                );
                fetchScheduleEmployyee()
                fetchEmployeeStatsByMonth()
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
            }
        }

        if (userObject.role === 'Manager') {
            try {
                setLoading(true)
                const formattedValues = datePicker.map(formatDate);
                const { data } = await axios.post(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/manager/manage-date-design/create-days?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}&department_name=${selectedDepartmentEmployee}`,
                    {
                        dates: formattedValues,
                        shift_code: selectedShiftAddShiftForm,
                        position: selectedPositionEmployee

                    },
                    { withCredentials: true }
                );
                fetchScheduleEmployyee()
                fetchEmployeeStatsByMonth()
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
    const handleSubmitChangeAttendancInfo = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (userObject?.role === 'Admin') {
            if (attendanceData.data.check_in_time !== "" && attendanceData.data.check_out_time !== "") {
                try {
                    const { data } = await axios.put(
                        `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": attendanceData.data.check_in_time,
                            "shift_info.time_slot.check_out_time": attendanceData.data.check_out_time,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        { withCredentials: true }
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
            if (attendanceData.data.check_in_time !== "" && attendanceData.data.check_out_time === "") {
                try {
                    const { data } = await axios.put(
                        `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": attendanceData.data.check_in_time,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        },
                        { withCredentials: true }
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
            if (attendanceData.data.check_in_time === "" && attendanceData.data.check_out_time !== "") {
                try {
                    const { data } = await axios.put(
                        `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_out_time": attendanceData.data.check_out_time,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        { withCredentials: true }
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
        }
        if (userObject?.role === 'Admin' && statusAttendance === "missing") {
            try {
                const { data } = await axios.put(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-attendance/update/${attendanceId}?editor_name=${userObject?.name}`,
                    {
                        "shift_info.time_slot.check_in_time": attendanceData.data.check_in_time,
                        "shift_info.time_slot.check_out_time": attendanceData.data.check_out_time,
                        "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        status: "checked"
                    },
                    { withCredentials: true }
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

        if (userObject?.role === 'Inhaber') {
            if (attendanceData.data.check_in_time !== "" && attendanceData.data.check_out_time !== "") {
                try {
                    const { data } = await axios.put(
                        `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": attendanceData.data.check_in_time,
                            "shift_info.time_slot.check_out_time": attendanceData.data.check_out_time,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        { withCredentials: true }
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
            if (attendanceData.data.check_in_time !== "" && attendanceData.data.check_out_time === "") {
                try {
                    const { data } = await axios.put(
                        `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_in_time": attendanceData.data.check_in_time,
                            "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        },
                        { withCredentials: true }
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
            if (attendanceData.data.check_in_time === "" && attendanceData.data.check_out_time !== "") {
                try {
                    const { data } = await axios.put(
                        `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                        {
                            "shift_info.time_slot.check_out_time": attendanceData.data.check_out_time,
                            "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        },
                        { withCredentials: true }
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
        }
        if (userObject?.role === 'Inhaber' && statusAttendance === "missing") {
            try {
                const { data } = await axios.put(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-attendance/update/${attendanceId}?inhaber_name=${userObject?.name}`,
                    {
                        "shift_info.time_slot.check_in_time": attendanceData.data.check_in_time,
                        "shift_info.time_slot.check_out_time": attendanceData.data.check_out_time,
                        "shift_info.time_slot.check_in_status": selectedCheckInStatus,
                        "shift_info.time_slot.check_out_status": selectedCheckOutStatus,
                        status: "checked"
                    },
                    { withCredentials: true }
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
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-attendance/create?employeeID=${id}&employeeName=${name}&date=${date}&shiftCode=${selectedShift}`,
                    {
                        "check_in_time": attendanceDataCreate.data.check_in_time,
                        "check_out_time": attendanceDataCreate.data.check_out_time,
                        "check_in_status": selectedCheckInStatusCreate,
                        "check_out_status": selectedCheckOutStatusCreate,
                    },
                    { withCredentials: true }
                );

                fetchAttendanceDataByDate();
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setChangeAttendanceFormState(false);
                setAttendanceDataCreate({
                    data: {
                        check_in_time: '',
                        check_out_time: '',
                    },
                });
                setSelectedCheckInStatusCreate("")
                setSelectedCheckOutStatusCreate("")
            }
        }

        if (userObject?.role === 'Inhaber') {
            try {
                const { data } = await axios.post(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-attendance/create?employeeID=${id}&employeeName=${name}&date=${date}&shiftCode=${selectedShift}`,
                    {
                        "check_in_time": attendanceDataCreate.data.check_in_time,
                        "check_out_time": attendanceDataCreate.data.check_out_time,
                        "check_in_status": selectedCheckInStatusCreate,
                        "check_out_status": selectedCheckOutStatusCreate,
                    },
                    { withCredentials: true }
                );

                fetchAttendanceDataByDate();
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setChangeAttendanceFormState(false);
                setAttendanceDataCreate({
                    data: {
                        check_in_time: '',
                        check_out_time: '',
                    },
                });
                setSelectedCheckInStatusCreate("")
                setSelectedCheckOutStatusCreate("")
            }
        }


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
                                        className={`cursor-pointer font-bold text-xl ${addShiftFormState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Add Shift</div>
                                    {exportState && (<div
                                        onClick={() => {
                                            setAddShiftFormState(false)
                                            setInforShiftFormState(true)
                                        }}
                                        className={`cursor-pointer font-bold text-xl ${inforShiftFormState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Shift Information</div>)}
                                </div>
                                <div
                                    onClick={() => setFormState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            {addShiftFormState && (<div className="flex flex-col px-8 w-full mt-7">
                                {employeeStats?.map((item, index) => (
                                    <div key={index}>Time left: {item?.realistic_schedule_times}</div>
                                ))}
                                <form
                                    className="flex flex-col gap-6 w-full justify-center items-center"
                                    onSubmit={handleSubmit}>
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                        <div className="loader"></div>
                                    </div>)}
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Shift Code</span>
                                        </div>
                                        <select
                                            id="shift_code"
                                            name="shift_code"
                                            className="w-full cursor-pointer rounded-[6px] border-[#d9d9d9]"
                                            value={selectedShiftAddShiftForm}
                                            onChange={(e) => setSelectedShiftAddShiftForm(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Select Shift Code*</option>
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
                                            <span className="">Department</span>
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
                                            <option value="" disabled className='italic text-sm'>Select Position*</option>
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
                                            <span className="">Department</span>
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
                                            <option value="" disabled className='italic text-sm'>Select Position*</option>
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
                                            <span className="">Department</span>
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
                                            <option value="" disabled className='italic text-sm'>Select Position*</option>
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
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Shift Type</span>
                                        </div>
                                        <select
                                            id="shift-type"
                                            name="shift-type"
                                            className="w-full cursor-pointer"
                                            value={selectedShiftType}
                                            onChange={(e) => setSelectedShiftType(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Select Shift Type*</option>
                                            {shiftType?.map((item, index) => (
                                                <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div
                                        className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                        <button type="submit" className="w-full">Add</button>
                                    </div>
                                </form>
                            </div>)}
                            {/* //----------------------------------------------------------------  SHIFT INFORMATION ----------------------------------------------------------------// */}
                            {exportState && (inforShiftFormState && (<div className="flex flex-col px-8 w-full mt-7 gap-2 font-Changa text-textColor">
                                <div className="font-bold text-2xl">Shift Information</div>
                                <div className="flex flex-row gap-3">
                                    {scheduleDataByDate?.length === 0 ? (
                                        <div className="font-bold text-red-600 text-xl">No shift for this day</div>
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
                                        {attendanceDataByDate?.length === 0 ? (
                                            <div className="flex flex-col gap-3">
                                                <div className="text-center font-bold text-gray-600 text-xl mt-4">No attendance data available</div>
                                                <div className="flex flex-col">
                                                    <button onClick={() => {
                                                        setCreateAttendanceFormState(!createAttendanceFormState)
                                                    }
                                                    } className="bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-red-800">
                                                        Create Attendance Information
                                                    </button>
                                                    {createAttendanceFormState && (<div className="w-full h-full">
                                                        <div className="flex flex-col mt-8">
                                                            <div className="flex flex-row justify-between px-8 items-center">
                                                                <div className="font-bold text-xl">Create Attendance Information</div>
                                                            </div>
                                                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                                            <div className="flex flex-col px-8 w-full mt-7">
                                                                <form
                                                                    className="flex flex-col gap-6 w-full justify-center items-center"
                                                                    onSubmit={handleSubmitCreateAttendanceInfo}>
                                                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                                                        <div className="loader"></div>
                                                                    </div>)}
                                                                    <div className="w-full h-auto flex flex-col gap-2">
                                                                        <div className="flex flex-row gap-2">
                                                                            <span className="text-rose-500">*</span>
                                                                            <span className="">Check_in_time</span>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            name="check_in_time"
                                                                            // required
                                                                            value={attendanceDataCreate.data.check_in_time}
                                                                            onChange={handleChangeAttendanceDataCreate}
                                                                            placeholder="eg:11:40:00 PM"
                                                                        />
                                                                    </div>
                                                                    <div className="w-full flex flex-col gap-2">
                                                                        <div className="flex flex-row gap-2">
                                                                            <span className="text-rose-500">*</span>
                                                                            <span className="">Check_in_status</span>
                                                                        </div>
                                                                        <select
                                                                            id="department"
                                                                            name="department"
                                                                            className="w-full cursor-pointer"
                                                                            value={selectedCheckInStatusCreate}
                                                                            onChange={(e) => setSelectedCheckInStatusCreate(e.target.value)}
                                                                        // required
                                                                        >
                                                                            <option value="" disabled className='italic text-sm'>Select Status*</option>
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
                                                                            <span className="">Check_out_time</span>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            name="check_out_time"
                                                                            // required
                                                                            value={attendanceDataCreate.data.check_out_time}
                                                                            onChange={handleChangeAttendanceDataCreate}
                                                                            placeholder="eg:11:20:00 PM"
                                                                        />
                                                                    </div>
                                                                    <div className="w-full flex flex-col gap-2">
                                                                        <div className="flex flex-row gap-2">
                                                                            <span className="text-rose-500">*</span>
                                                                            <span className="">Check_out_status</span>
                                                                        </div>
                                                                        <select
                                                                            id="department"
                                                                            name="department"
                                                                            className="w-full cursor-pointer"
                                                                            value={selectedCheckOutStatusCreate}
                                                                            onChange={(e) => setSelectedCheckOutStatusCreate(e.target.value)}
                                                                        // required
                                                                        >
                                                                            <option value="" disabled className='italic text-sm'>Select Status*</option>
                                                                            {attendanceStatus?.map((item, index) => (
                                                                                <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                                                    {item.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div
                                                                        className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                                                        <button type="submit" className="w-full">Create Attendance</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>)}
                                                </div>
                                            </div>

                                        ) : (
                                            attendanceDataByDate?.filter((item) => item?.shift_info?.shift_code === selectedShift)
                                                .map((filteredItem) => (
                                                    <div className="flex flex-col gap-4" key={filteredItem._id}>
                                                        {filteredItem?.status === "missing" ? (
                                                            <div className="text-center font-bold text-red-600 text-xl" key={filteredItem._id}>STATUS: MISSING</div>
                                                        ) : (
                                                            <div className="flex flex-col gap-4">
                                                                <div className="flex flex-row justify-between mt-5">
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor2 font-bold text-xl">
                                                                        <div>CHECKIN TIME</div>
                                                                        <div>{filteredItem?.shift_info?.time_slot?.check_in_time}</div>
                                                                        <div className="italic text-xs">Status: {filteredItem?.shift_info?.time_slot?.check_in_status}</div>
                                                                    </div>
                                                                    <div className="flex flex-col justify-center items-center text-buttonColor1 font-bold text-xl">
                                                                        <div>WORKING TIME</div>
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
                                                                        <div>TOTAL KM TIME</div>
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
                                                                setChangeAttendanceFormState(!changeAttendanceFormState)
                                                                setStatusAttendance(filteredItem?.status)
                                                            }
                                                            } className="bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-red-800">
                                                                Change Attendance Information
                                                            </button>
                                                            {changeAttendanceFormState && (<div className="w-full h-full">
                                                                <div className="flex flex-col mt-8">
                                                                    <div className="flex flex-row justify-between px-8 items-center">
                                                                        <div className="font-bold text-xl">Change Attendance Information</div>
                                                                    </div>
                                                                    <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                                                    <div className="flex flex-col px-8 w-full mt-7">
                                                                        <form
                                                                            className="flex flex-col gap-6 w-full justify-center items-center"
                                                                            onSubmit={handleSubmitChangeAttendancInfo}>
                                                                            {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                                                                <div className="loader"></div>
                                                                            </div>)}
                                                                            <div className="w-full h-auto flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Attendance ID</span>
                                                                                </div>
                                                                                <input
                                                                                    type="text"
                                                                                    name="id"
                                                                                    value={attendanceId}
                                                                                    // onChange={(e) => setAttendanceId(e.target.value)}
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
                                                                                    // onChange={(e) => setAttendanceId(e.target.value)}
                                                                                    readOnly={true}
                                                                                />
                                                                            </div>)}
                                                                            <div className="w-full h-auto flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Check_in_time</span>
                                                                                </div>
                                                                                <input
                                                                                    type="text"
                                                                                    name="check_in_time"
                                                                                    // required
                                                                                    value={attendanceData.data.check_in_time}
                                                                                    onChange={handleChangeAttendanceData}
                                                                                />
                                                                            </div>
                                                                            <div className="w-full flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Check_in_status</span>
                                                                                </div>
                                                                                <select
                                                                                    id="department"
                                                                                    name="department"
                                                                                    className="w-full cursor-pointer"
                                                                                    value={selectedCheckInStatus}
                                                                                    onChange={(e) => setSelectedCheckInStatus(e.target.value)}
                                                                                // required
                                                                                >
                                                                                    <option value="" disabled className='italic text-sm'>Select Status*</option>
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
                                                                                    <span className="">Check_out_time</span>
                                                                                </div>
                                                                                <input
                                                                                    type="text"
                                                                                    name="check_out_time"
                                                                                    // required
                                                                                    value={attendanceData.data.check_out_time}
                                                                                    onChange={handleChangeAttendanceData}
                                                                                />
                                                                            </div>
                                                                            <div className="w-full flex flex-col gap-2">
                                                                                <div className="flex flex-row gap-2">
                                                                                    <span className="text-rose-500">*</span>
                                                                                    <span className="">Check_out_status</span>
                                                                                </div>
                                                                                <select
                                                                                    id="department"
                                                                                    name="department"
                                                                                    className="w-full cursor-pointer"
                                                                                    value={selectedCheckOutStatus}
                                                                                    onChange={(e) => setSelectedCheckOutStatus(e.target.value)}
                                                                                // required
                                                                                >
                                                                                    <option value="" disabled className='italic text-sm'>Select Status*</option>
                                                                                    {attendanceStatus?.map((item, index) => (
                                                                                        <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                                                            {item.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </div>
                                                                            <div
                                                                                className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                                                                <button type="submit" className="w-full">Save Changes</button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>)}
                                                        </div>
                                                    </div>
                                                    //     </div>
                                                    // </div>
                                                )))}
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
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Department</span>
                                                        <span className="w-2/3">{filteredItem?.department_name}</span>
                                                    </div>
                                                    <div className="flex flex-wrap w-full items-center justify-center">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Role</span>
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
                                                    <div className="flex flex-wrap w-full items-center justify-center mb-5">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Shift's Code</span>
                                                        <span className="w-2/3">{selectedShift}</span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                                {selectedShift && (
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
                                )}
                            </div>))}
                        </div>
                    </div>
                </div>
            </div >)}
        </div >
    );
};

export default ScheduleTable;