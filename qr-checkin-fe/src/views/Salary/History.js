import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./Salary.css"
import * as XLSX from "xlsx";

const History = () => {
    const [inputId, setInputId] = useState("")
    const [inputName, setInputName] = useState("")
    const [salaryListByMonth, setSalaryListByMonth] = useState()
    const [userList, setUserList] = useState()
    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const [checkManager, setCheckManager] = useState(false)

    useEffect(() => {
        if (userObject?.role === 'Manager') {
            setCheckManager(true)
        }

    }, [userObject?.role]);

    const handleSeacrh = async () => {
        if (userObject.role === 'Admin', inputId !== "", inputName !== "") {
            try {
                const { data } = await axios.get(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-salary/get?employeeID=${inputId}&employeeName=${inputName}`,
                    { withCredentials: true }
                );
                setSalaryListByMonth(data?.message)
                // console.log("data", data?.message);
                // console.log(data?.);
            } catch (err) {
                alert("No salary recorded")
            }
        }
    }

    useEffect(() => {
        const getUserList = async () => {
            if (userObject.role === 'Admin', inputId !== "") {
                try {
                    const { data } = await axios.get(
                        `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-all/search-specific?details=${inputId}`,
                        { withCredentials: true }
                    );
                    setUserList(data?.message)
                    // console.log("data", data?.message);
                    // console.log(data?.);
                } catch (err) {
                    // alert("No salary recorded")
                }
            }
            if (userObject.role === 'Inhaber', inputId !== "") {
                try {
                    const { data } = await axios.get(
                        `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-employee/search-specific?inhaber_name=${userObject?.name}&details=${inputId}`,
                        { withCredentials: true }
                    );
                    setUserList(data?.message)
                    // console.log("data", data?.message);
                    // console.log(data?.);
                } catch (err) {
                    // alert("No salary recorded")
                }
            }
        }
        getUserList()
    }, [inputId]);
    return (
        <div>
            {checkManager ? (<div className="ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">YOU CANNOT ACCESS THIS ROUTE</div>) : (<div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <h1 className="font-bold text-3xl">Salary Summarize</h1>
                        <div className="flex flex-row">
                            <Link className="text-xl font-semibold leading-6 hover:underline" to="/dashboard">Dashboard</Link>
                            <span className="text-[#6c757d] font-xl">/ Salary</span>
                            <Link className="text-[#6c757d] font-xl leading-6 hover:underline" to="/salary/history_counting">/ History Counting</Link>
                        </div>
                    </div>
                </div>
                <div className="z-10 flex flex-row mt-10 justify-between h-[50px]">
                    <div className="flex flex-row gap-20 w-3/5">
                        <input
                            className="w-1/3 text-base px-4 py-3 placeholder:text-placeholderTextColor focus:border-2 focus:border-solid focus:border-placeholderTextColor focus:ring-0"
                            type="text"
                            placeholder="Enter Employee ID"
                            value={inputId}
                            onChange={(e) => setInputId(e.target.value)}
                        />
                        <div className="w-2/3 h-[50px] flex flex-col gap-2">
                            <select
                                id="name_search"
                                name="name_search"
                                className="w-2/3 cursor-pointer h-[50px]"
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                            // required
                            >
                                <option value="" disabled className='italic text-sm'>Select Employee Name*</option>
                                {userList?.map((item, index) => (
                                    <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div
                        onClick={handleSeacrh}
                        className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700 w-1/6">
                        <button className="search-btn">Seacrh</button>
                    </div>
                </div>

                <div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
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
                                    <span className="table-title-status">a_parameter</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">b_parameter</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">c_parameter</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">d_parameter</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">f_parameter</span>
                                </th>
                            </tr>
                        </thead>
                        {Array.isArray(salaryListByMonth) && salaryListByMonth?.length === 0 ? (
                            <div className="no-result-text text-center">NO RESULT</div>
                        ) : (
                            <tbody className="tbody">
                                {salaryListByMonth?.map(({ employee_id, employee_name, year, month,a_parameter, b_parameter, c_parameter, d_parameter, f_parameter }) => (
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
                </div>
            </div>)}
        </div>
    )
}

export default History

