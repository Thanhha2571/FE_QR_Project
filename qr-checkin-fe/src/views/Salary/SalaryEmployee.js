import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "./Salary.css"
import ProfileIcon from "../../assets/images/icon-profile.png"
const SalaryEmployee = () => {
    const { employeeId } = useParams()
    // console.log(employeeId);
    const [inputMonth, setInputMonth] = useState("")
    const [inputYear, setInputYear] = useState("")
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false);
    const [salaryInfoState, setSalaryInfoState] = useState(false);
    const [exportEmployee, setExportEmployee] = useState(false)
    const [salaryListByMonth, setSalaryListByMonth] = useState()
    const [filterEmployeeById, setFilterEmployeeById] = useState()
    const [userSalarybyMonthInfoState, setUserSalaryByMonthInfoState] = useState(false)
    const [userSalarybyMonth, setUserSalaryByMonth] = useState()
    const [checkAdmin, setCheckAdmin] = useState(false)
    const [checkManager, setCheckManager] = useState(false)

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (userObject?.role === 'Admin') {
            setCheckAdmin(true)
        }

        if (userObject?.role === 'Manager') {
            setCheckManager(true)
        }

    }, [userObject?.role]);

    const handleSeacrh = async () => {
        setLoading(true);
        if (userObject.role === 'Admin' && inputMonth !== "" && inputYear !== "") {
            try {
                const { data } = await axios.get(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-stats/get?year=${inputYear}&month=${inputMonth}&employeeID=${employeeId}`,
                    { withCredentials: true }
                );
                setSalaryListByMonth(data?.message)
                // console.log(data?.);
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false)
            }
        }

        if (userObject.role === 'Admin' && inputMonth !== "" && inputYear !== "") {
            try {
                const { data } = await axios.get(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-employee/get-byId?employeeID=${employeeId}`,
                    { withCredentials: true }
                );
                setUser(data?.message)
                // console.log(data?.);
            } catch (error) {
                // Handle error
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false)
            }
        }
        setSalaryInfoState(true)

        if (userObject.role === 'Inhaber' && inputMonth !== "" && inputYear !== "") {
            try {
                const { data } = await axios.get(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-stats/get?year=${inputYear}&month=${inputMonth}&inhaber_name=${userObject?.name}&employeeID=${employeeId}`,
                    { withCredentials: true }
                );
                setSalaryListByMonth(data?.message)
                // console.log(data?.);
            } catch (error) {
                // Handle error
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false)
            }
        }

        if (userObject.role === 'Inhaber' && inputMonth !== "" && inputYear !== "") {
            try {
                const { data } = await axios.get(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-employee/get-byId?inhaber_name=${userObject?.name}&employeeID=${employeeId}`,
                    { withCredentials: true }
                );
                setUser(data?.message)
                console.log("user", data?.message);
            } catch (error) {
                // Handle error
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false)
            }
        }
        setSalaryInfoState(true)
    }


    // useEffect(() => {
    //     if (salaryListByMonth) {
    //         const arrayFilter = salaryListByMonth.filter(
    //             (item) => item.employee_id === employeeId
    //         );
    //         setFilterEmployeeById(arrayFilter);
    //     }
    // }, [salaryListByMonth, employeeId]);

    // useEffect(() => {
    //     if (filterEmployeeById) {
    //         console.log("EmployeeId", filterEmployeeById);
    //     }
    // }, [filterEmployeeById]);

    const handleExportAttendanceStatEmloyeeFile = async () => {
        try {
            if (userObject?.role === "Admin") {
                const { data } = await axios.get(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-xlsx/attendance-data?year=${inputYear}&month=${inputMonth}`,
                    { responseType: "arraybuffer", withCredentials: true }
                );

                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const link = document.createElement("a");

                link.href = window.URL.createObjectURL(blob);
                link.download = `Employee_Attendance_Data_${inputYear}_${inputMonth}.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            if (userObject?.role === "Inhaber") {
                const { data } = await axios.get(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-xlsx/attendance-data?inahber_name=${userObject?.name}&year=${inputYear}&month=${inputMonth}`,
                    { responseType: "arraybuffer", withCredentials: true }
                );

                const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const link = document.createElement("a");

                link.href = window.URL.createObjectURL(blob);
                link.download = `Employee_Attendance_Data_${inputYear}_${inputMonth}.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error exporting Excel file:", error);
        } finally {
            setLoading(false);
            setExportEmployee(false)
        }

    
    }

    return (
        <div>
            {checkManager ? (<div className="ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">YOU CANNOT ACCESS THIS ROUTE</div>) : (<div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl">Salary Employee</h1>
                    <div className="flex flex-row">
                        <Link className="text-xl font-semibold leading-6 hover:underline" to="/">Dashboard</Link>
                        <span className="text-[#6c757d] font-xl">/ Salary</span>
                        <Link className="text-[#6c757d] font-xl leading-6 hover:underline" to="/salary/summarize">/ Salary Summarize</Link>
                        <span className="text-[#6c757d] font-xl leading-6">/ Salary Employee</span>
                    </div>
                </div>
                <div className="flex flex-row px-4 gap-4">
                    <button onClick={() => setExportEmployee(!exportEmployee)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                        <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                        Export File
                    </button>
                </div>
            </div>
            <div className="border border-solid border-t-[#6c757d]"></div>
            {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                <div className="loader"></div>
            </div>)}
            <div className="z-10 flex flex-row mt-10 justify-between h-[50px]">
                <div className="flex flex-row gap-20 w-3/5">
                    <input
                        className="w-1/3 text-base px-4 py-3 placeholder:text-placeholderTextColor focus:border-2 focus:border-solid focus:border-placeholderTextColor focus:ring-0"
                        type="text"
                        placeholder="Enter month"
                        value={inputMonth}
                        onChange={(e) => setInputMonth(e.target.value)}
                    />
                    <input
                        className="w-1/3 text-base px-4 py-3 placeholder:text-placeholderTextColor focus:border-2 focus:border-solid focus:border-placeholderTextColor focus:ring-0"
                        type="text"
                        placeholder="Enter year"
                        value={inputYear}
                        onChange={(e) => setInputYear(e.target.value)}
                    />
                </div>
                <div
                    onClick={handleSeacrh}
                    className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700 w-1/6">
                    <button className="search-btn">Seacrh</button>
                </div>
            </div>

            <div className="bg-white h-auto w-full flex flex-col rounded-md mt-5">
                <div className="flex flex-row gap-4 text-xl">
                    <div className={`hover:text-buttonColor1 cursor-pointer ${salaryInfoState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Salary Information</div>
                </div>
            </div>

            {salaryListByMonth?.map(({ employee_name, employee_id, default_schedule_times, realistic_schedule_times, attendance_total_times }) =>
                <div className="bg-[#f0f2f5] w-full flex flex-row p-5 font-Changa text-textColor gap-4">
                    {salaryInfoState && (<div className="bg-white h-auto w-1/3 flex flex-col p-4 rounded-md">
                        <div className="flex flex-col justify-center items-center gap-1 mt-4">
                            <img src={ProfileIcon} className="w-32 h-32" />
                            <span className="mt-3 font-bold text-xl">{employee_name}</span>
                            <span className="text-base">Employee's ID: {employee_id}</span>
                        </div>
                    </div>)}
                    {salaryInfoState && <div className="bg-white h-auto w-2/3 flex flex-col p-4 gap-6 rounded-md">
                        <div className="text-2xl font-semibold leading-6">ATTENDANCE STATS</div>
                        <div className="flex flex-wrap w-full">
                            {user && user[0]?.department?.map(({ _id, name, attendance_stats }) => (
                                <div key={_id} className="flex flex-col w-1/2 py-4 gap-2">
                                    <div className="text-xl font-semibold leading-6">Department: {name}</div>
                                    {attendance_stats?.filter((item) => item.year === 2024 && item.month === 1)?.map((stats) => (
                                        <div key={stats?._id} className="flex flex-col gap-2">
                                            <span>Date Late: {stats?.date_late}</span>
                                            <span>Date Missing: {stats?.date_missing}</span>
                                            <span>Date On Time: {stats?.date_on_time}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>}
                    {salaryInfoState && <div className="bg-white h-auto w-2/3 flex flex-col p-4 gap-6 rounded-md">
                        <div className="text-2xl font-semibold leading-6">SUMMARIZE</div>
                        <div className="flex flex-col gap-3">
                            <div>Default Working Time: {default_schedule_times}</div>
                            <div>Rest Working Time: {realistic_schedule_times}</div>
                            <div> Working Time: {attendance_total_times}</div>
                        </div>
                    </div>}
                </div>
            )}
            {exportEmployee && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setExportEmployee(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[600px] h-[200px] top-[300px] right-[500px] bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="font-bold text-xl">Export file</div>
                                <div
                                    onClick={() => setExportEmployee(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7 font-Changa justify-center items-center gap-4">
                                <span>Do you want to export Employee_Attendance_Data_{inputYear}_{inputMonth}.xlsx?</span>
                                <div className="flex flex-row gap-3">
                                    <button onClick={() => setExportEmployee(false)} type="button" className="w-[100px] bg-rose-800 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointe">No</button>
                                    <button onClick={handleExportAttendanceStatEmloyeeFile} type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Yes</button>
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