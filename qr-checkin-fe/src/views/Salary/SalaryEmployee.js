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

    const [loading, setLoading] = useState(false);
    const [salaryInfoState, setSalaryInfoState] = useState(false);
    const [salaryListByMonth, setSalaryListByMonth] = useState()
    const [filterEmployeeById, setFilterEmployeeById] = useState()
    const [userSalarybyMonthInfoState, setUserSalaryByMonthInfoState] = useState(false)
    const [userSalarybyMonth, setUserSalaryByMonth] = useState()

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const handleSeacrh = async () => {
        if (userObject.role === 'Admin' && inputMonth !== "" && inputYear !== "") {
            try {
                const { data } = await axios.get(
                    `https://qr-code-checkin.vercel.app/api/admin/manage-salary/get-all?year=${inputYear}&month=${inputMonth}`,
                    { withCredentials: true }
                );
                setSalaryListByMonth(data?.salaries)
                // console.log(data?.);
            } catch (error) {
                // Handle error
                console.error("Error submitting form:", error);
            }
        }
        setSalaryInfoState(true)
    }


    useEffect(() => {
        if (salaryListByMonth) {
            const arrayFilter = salaryListByMonth.filter(
                (item) => item.employee_id === employeeId
            );
            setFilterEmployeeById(arrayFilter);
        }
    }, [salaryListByMonth, employeeId]);

    useEffect(() => {
        if (filterEmployeeById) {
            console.log("EmployeeId", filterEmployeeById);
        }
    }, [filterEmployeeById]);

    return (
        <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
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
            </div>
            <div className="border border-solid border-t-[#6c757d]"></div>

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

            {filterEmployeeById?.map(({employee_name, employee_id, email, department_name, role, position}) =>
                <div className="bg-[#f0f2f5] w-full flex flex-row p-5 font-Changa text-textColor gap-4">
                    {salaryInfoState && (<div className="bg-white h-auto w-1/3 flex flex-col p-4 rounded-md">
                        <div className="flex flex-col justify-center items-center gap-1 mt-4">
                            <img src={ProfileIcon} className="w-32 h-32" />
                            <span className="mt-3 font-bold text-xl">{employee_name}</span>
                            <span className="text-base">Employee's ID: {employee_id}</span>
                            <div className="w-full flex flex-col justify-center items-center gap-1 mt-3 text-base">
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Name</span>
                                    <span className="w-2/3 px-2">{employee_name}</span>
                                </div>
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Email</span>
                                    <span className="w-2/3 px-2">{email}</span>
                                </div>
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Department</span>
                                    <span className="w-2/3 px-2">{department_name}</span>
                                </div>
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Role</span>
                                    <span className="w-2/3 px-2">{role}</span>
                                </div>
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Position</span>
                                    <span className="w-2/3 px-2">{position}</span>
                                </div>
                            </div>
                        </div>
                    </div>)}
                </div >
            )}
        </div>
    )
}

export default SalaryEmployee