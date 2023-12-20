import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeTodayItem from "./EmployeeTodayItem";


function Dashboard() {
    document.title = "Dashboard";
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [departmentList, setDepartmentList] = useState()
    const [departmentMenu, setDepartmentMenu] = useState(false)

    const [currentDate, setCurrentDate] = useState("");
    const [year, setYear] = useState()
    const [month, setMonth] = useState()

    const [userListToday, setUserListToday] = useState()
    const handleDepartmentMenu = () => {
        setDepartmentMenu(!departmentMenu)
    }

    const handleChangeSelectedDepartment = (item) => {
        setSelectedDepartment(item)
    };

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = today.getDate().toString().padStart(2, '0');
        const formattedDate = `${month}/${day}/${year}`;
        setYear(year)
        setMonth(month)
        setCurrentDate(formattedDate);
    }, []); // empty dependency array to run only on mount

    useEffect(() => {
        const getAllDepartments = async () => {
            try {
                const response = await axios.get('https://qr-code-checkin.vercel.app/api/admin/manage-department/get-all', { withCredentials: true });
                setDepartmentList(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const getEmployeeByDateAndShift = async () => {
            if (currentDate) {
                try {
                    const response = await axios.get(`https://qr-code-checkin.vercel.app/api/admin/manage-employee/get-all-schedules?year=${year}&month=${month}&date=${currentDate}`, { withCredentials: true });
                    setUserListToday(response.data.message);
                } catch (error) {
                    console.error('Error fetching employees by date and shift:', error);
                }
            }
        };

        getEmployeeByDateAndShift();
        getAllDepartments();

    }, [currentDate]);
    // console.log(currentDate);
    // console.log(date);
    console.log('userList', userListToday);
    return (
        <>
            <div className="relative ml-[260px] h-auto flex flex-col font-Changa text-textColor gap-5">
                <div className="p-5 flex flex-row items-center justify-between">
                    <div>
                        <h1 className="font-bold text-3xl">Dashboard</h1>
                    </div>
                    <div className="flex flex-row px-4 gap-4 z-10">
                        <div
                            onClick={handleDepartmentMenu}
                            className="w-[250px] h-[50px] text-base cursor-pointer">
                            <div className="flex flex-col w-full py-3 px-2 border border-solid border-placeholderTextColor text-placeholderTextColor">
                                <div className="flex flex-row items-center justify-around w-full">
                                    <div className="ml-4">{selectedDepartment}</div>
                                    <div className={`w-4 h-4 flex justify-center items-center ${departmentMenu ? "rotate-180" : ""}`}>
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="svg-inline--fa fa-caret-down fa-rotate-180 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ color: "rgb(220, 220, 220)" }}><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {departmentMenu && (<div className="text-black bg-placeholderTextColor border border-solid border-placeholderTextColor border-t-black flex flex-col gap-3 px-2 py-3 items-center w-full overflow-y-scroll max-h-[200px]">
                                {departmentList.map(({ index, name }) => {
                                    return <div onClick={() => handleChangeSelectedDepartment(name)} className="py-1">{name}</div>
                                })}
                            </div>)}
                        </div>
                        <div
                            // onClick={handleSeacrh}
                            className="w-[200px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2  rounded-md cursor-pointer hover:bg-emerald-700">
                            <button className="search-btn">Seacrh</button>
                        </div>
                    </div>
                </div>
                <div className="border border-solid border-t-[#6c757d]"></div>
                <div className="bg-[#f0f2f5] w-full flex flex-row p-5 font-Changa text-textColor gap-4">
                    <div className="bg-white w-full h-auto p-10">
                        <div className="text-xl italic text-textColor mb-8">{currentDate}</div>
                        {Array.isArray(userListToday) && userListToday?.length === 0 ? (
                            <div className="font-bold text-2xl text-textColor mb-8">No Employee is working today</div>
                        ) : (
                            <div className="font-bold text-2xl text-textColor mb-8">Employee is working today</div>)}
                        <div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                            <table className="w-full table">
                                <thead className="">
                                    <tr className="">
                                        <th className="p-2 text-left">
                                            <span className="font-bold">Name</span>
                                        </th>
                                        <th className="p-2 text-left">
                                            <span className="table-title-role">Department</span>
                                        </th>
                                        <th className="p-2 text-left">
                                            <span className="table-title-role">Position</span>
                                        </th>
                                        <th className="p-2 text-left">
                                            <span className="table-title-role">Shift Code</span>
                                        </th>
                                        <th className="p-2 text-left">
                                            <span className="table-title-role">Time</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="tbody">
                                    {userListToday?.map(({ employee_id, employee_name, shift_code, position, time_slot, department_name }) => (
                                        <EmployeeTodayItem
                                            key={employee_id}
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
