import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.css";
import axios from "axios";
import "date-fns-tz";
import { format } from "date-fns-tz";
import { set } from "date-fns";

const ScheduleTable = (props) => {
    const { id, name, department, role, position } = props
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
    const [shiftDataByDate, setShiftDataByDate] = useState()
    const handleShiftClick = (shift) => {
        setSelectedShift(shift);
        console.log(shift);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://qr-code-checkin.vercel.app/api/admin/manage-all/search-specific?details=${id}`, { withCredentials: true });
                console.log(response.data);
                setEmployeeData(response.data);
                // setShiftDataByDate(employeeData?.message[0]?.department?.map((item) => item?.schedules));
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };
        fetchData();

        const fetchScheduleDataByDate = async () => {
            try {
                const year = selectedDate.substring(0, 4);
                const month = selectedDate.substring(5, 7);
                const day = selectedDate.substring(8, 10)
                const date = `${month}/${day}/${year}`
                const response = await axios.get(`https://qr-code-checkin.vercel.app/api/admin/manage-date-design/get-by-specific?employeeID=${id}&year=${year}&month=${month}&date=${date}`, { withCredentials: true });

                setScheduleDataByDate(response.data.message);
                console.log("attendance", response.data);
            } catch (error) {
                if (error.response && error.response.status) {
                    if (error.response.status === 404) {
                        setScheduleDataByDate([])
                    }
                } else {
                    console.error("Error fetching schedule data:", error.message);
                }
            }
        };

        fetchScheduleDataByDate();
    }, [id, selectedDate, dateFormDb, role]);

    if (shiftDataByDate) {
        console.log("sdfdfsfd", shiftDataByDate);
    }
    const renderTileContent = ({ date }) => {
        if (!employeeData || !employeeData.message) return null;

        const formattedDate = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });

        const shiftCodesForDate = employeeData?.message[0]?.department
            ?.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return scheduleDate.toDateString() === date.toDateString();
            })
            .map((schedule) =>
                schedule.shift_design.map((shift) => ({
                    position: shift.position,
                    shiftCode: shift.shift_code,
                }))
            )
            .flat();

        return (
            <div className={`font-Changa calendar-tile ${shiftCodesForDate?.length > 0 ? "scheduled" : ""}`}>
                {/* You can customize the content of the tile here */}
                {shiftCodesForDate?.length > 0 ? (
                    shiftCodesForDate.map(({ position, shiftCode }, index) => (
                        <div key={index} className="flex flex-row gap-2 border-solid border-2 border-textColor py-2 rounded-md mt-2 bg-slate-200 items-center">
                            <div className="border border-solid bg-red-800 ml-6 rounded-full w-3 h-3"></div>
                            <div className="">{position}: {shiftCode}</div>
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

    const [formData, setFormData] = useState({
        data: {
            shift_code: ''
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            data: {
                ...prevData.data,
                [name]: value,
            },
        }));
    };

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;
    // console.log(userObject);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (userObject.role === 'Admin') {
        try {
            const { data } = await axios.post(
                `https://qr-code-checkin.vercel.app/api/admin/manage-date-design/create?employeeID=${id}`,
                {
                    date: selectedDate,
                    shift_code: formData.data.shift_code,
                },
                { withCredentials: true }
            );

            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            // Handle error
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
        // }
    }

    const handleClickDay = (value, event) => {

        setFormState(true);

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDate = format(value, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
        const inputDate = new Date(localDate);
        const outputDateFormDb = inputDate.toISOString();
        setSelectedDate(localDate);
        setDateFormDb(outputDateFormDb);

        console.log("Selected date:", localDate);
        console.log("loclDate", localDate);
        console.log("dateformDB", dateFormDb);

        setSelectedShift(null)
    };

    // const shiftForDate = employeeData?.message?.department?.filter((item) => item?.schedule?.date === dateFormDb);
    // console.log("shiftForDate",shiftForDate);

    // if (attendanceDataByDate) {
    //     console.log(attendanceDataByDate);
    // }

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
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[750px] top-0 right-0 bottom-0 z-30 bg-white">
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
                                    <div
                                        onClick={() => {
                                            setAddShiftFormState(false)
                                            setInforShiftFormState(true)
                                        }}
                                        className={`cursor-pointer font-bold text-xl ${inforShiftFormState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Shift Information</div>
                                </div>
                                <div
                                    onClick={() => setFormState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            {addShiftFormState && (<div className="flex flex-col px-8 w-full mt-7">
                                <form
                                    className="flex flex-col gap-6 w-full justify-center items-center"
                                    onSubmit={handleSubmit}>
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                        <div className="loader"></div>
                                    </div>)}
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Shift's ID</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="shift_code"
                                            required
                                            value={formData.data.shift_code}
                                            onChange={handleChange}
                                            placeholder="Enter shift ID..."
                                        />
                                    </div>
                                    <div
                                        className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                        <button type="submit" className="w-full">Add</button>
                                    </div>
                                </form>
                            </div>)}
                            {/* //----------------------------------------------------------------  SHIFT INFORMATION ----------------------------------------------------------------// */}
                            {inforShiftFormState && (<div className="flex flex-col px-8 w-full mt-7 gap-2 font-Changa text-textColor">
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
                                        {scheduleDataByDate
                                            ?.filter((item) => item?.shift_code === selectedShift)
                                            .map((filteredItem) => (
                                                <div key={filteredItem._id}>
                                                    {/* {filteredItem?.status === "checked" ? ( */}
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex flex-row justify-between mt-5">
                                                            <div className="flex flex-col justify-center items-center text-buttonColor2 font-bold text-xl">
                                                                <div>CHECKIN TIME</div>
                                                                <div>{filteredItem?.shift_info?.time_slot?.check_in_time}</div>
                                                            </div>
                                                            <div className="flex flex-col justify-center items-center text-buttonColor1 font-bold text-xl">
                                                                <div>WORKING TIME</div>
                                                                <div>{`${filteredItem?.shift_info?.total_hour}h ${filteredItem?.shift_info?.total_minutes}m`}</div>
                                                            </div>
                                                            <div className="flex flex-col justify-center items-center font-bold text-red-600 text-xl">
                                                                <div>CHECKOUT TIME</div>
                                                                <div>{filteredItem?.shift_info?.time_slot?.check_out_time}</div>
                                                            </div>
                                                        </div>
                                                        {filteredItem?.total_km !== 0 ? (<div className="flex flex-row justify-between mt-5">
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
                                                    {/* ) : (
                                                        <div className="text-center font-bold text-red-600 text-xl" key={filteredItem._id}>STATUS: MISSING</div>
                                                    )} */}
                                                </div>
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
                                                    <div className="flex flex-wrap w-full items-center justify-center">
                                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Shift's Code</span>
                                                        <span className="w-2/3">{selectedShift}</span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                                {/* {selectedShift && (<div className="w-full flex flex-col justify-center items-center gap-3 mt-3 text-base">
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
                                        <span className="w-2/3">{department}</span>
                                    </div>
                                    <div className="flex flex-wrap w-full items-center justify-center">
                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Role</span>
                                        <span className="w-2/3">{role}</span>
                                    </div>
                                    {positionTextState && (<div className="flex flex-wrap w-full items-center justify-center">
                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Position</span>
                                        <span className="w-2/3">{position}</span>
                                    </div>)}
                                    <div className="flex flex-wrap w-full items-center justify-center">
                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Date</span>
                                        <span className="w-2/3">{selectedDate.substring(0, 10)}</span>
                                    </div>
                                    <div className="flex flex-wrap w-full items-center justify-center">
                                        <span className="text-[#6c757d] w-1/3 text-right px-3">Shift's Code</span>
                                        <span className="w-2/3">{selectedShift}</span>
                                    </div>
                                </div>)} */}
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    );
};

export default ScheduleTable;