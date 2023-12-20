import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./Salary.css"

const SalarySummarizie = () => {
    const [inputMonth, setInputMonth] = useState("")
    const [inputYear, setInputYear] = useState("")
    const [salaryListByMonth, setSalaryListByMonth] = useState()

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const [salaryCountingFormState, setSalaryCountingFormState] = useState(false)
    const [editSalaryCountingFormState, setEditSalaryCountingFormState] = useState(false)
    const [loading, setLoading] = useState(false);

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
    }

    const [formData, setFormData] = useState({
        user: {
            id: '',
            month: '',
            year: '',
            a: '',
            b: '',
            c: '',
            d: '',
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            user: {
                ...prevData.user,
                [name]: value,
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true)
        const salaryCounting = async () => {
            try {
                const { data } = await axios.post(
                    `https://qr-code-checkin.vercel.app/api/admin/manage-salary/calculate/${formData.user.id}?year=${formData.user.year}&month=${formData.user.month}`,
                    {
                        a_new: formData.user.a,
                        b_new: formData.user.b,
                        c_new: formData.user.c,
                        d_new: formData.user.d,
                    },
                    { withCredentials: true }
                );
            } catch (error) {
                // Handle error
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false);
                setFormData({
                    user: {
                        id: '',
                        month: '',
                        year: '',
                        a: '',
                        b: '',
                        c: '',
                        d: '',
                    },
                });
            }
        };
        salaryCounting()
    }
    return (
        <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl">Salary Summarize</h1>
                    <div className="flex flex-row">
                        <Link className="text-xl font-semibold leading-6 hover:underline" to="/">Dashboard</Link>
                        <span className="text-[#6c757d] font-xl">/ Salary</span>
                        <Link className="text-[#6c757d] font-xl leading-6 hover:underline" to="/salary/summarize">/ Salary Summarize</Link>
                    </div>
                </div>
                <div className="flex flex-row px-4 gap-4">
                    <button onClick={() => setSalaryCountingFormState(!salaryCountingFormState)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                        <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                        Salary Counting
                    </button>
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
                                <span className="table-title-role">Department</span>
                            </th>
                            <th className="p-2 text-left">
                                <span className="table-title-role">Position</span>
                            </th>
                            <th className="p-2 text-left">
                                <span className="table-title-status">Total Hour</span>
                            </th>
                            <th className="p-2 text-left">
                                <span className="table-title-status">Total Hour Overtine</span>
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
                                <span className="table-title-status">Total Km</span>
                            </th>
                            <th className="p-2 text-left">
                                <span className="table-title-status">Salary</span>
                            </th>
                        </tr>
                    </thead>
                    {Array.isArray(salaryListByMonth) && salaryListByMonth?.length === 0 ? (
                        <div className="no-result-text text-center">NO RESULT</div>
                    ) : (
                        <tbody className="tbody">
                            {salaryListByMonth?.map(({ employee_id, employee_name, department_name, role, position, salary }) => (
                                <tr className="tr-item" key={employee_id}>
                                    <td className="p-2 hover:text-buttonColor2">
                                        <h2 className="text-left">
                                            <Link className="cursor-pointer flex flex-col" to={`/salary/sumarize/${employee_id}`}>{employee_name}
                                                <span className="text-xs text-neutral-400">{role}</span>
                                            </Link>
                                        </h2>
                                    </td>
                                    <td className="p-2">{employee_id}</td>
                                    <td className="p-2">{department_name}</td>
                                    <td className="p-2">{position}</td>
                                    <td className="p-2">{salary?.hour_normal}</td>
                                    <td className="p-2">{salary?.hour_overtime}</td>
                                    <td className="p-2">{salary?.a_parameter}</td>
                                    <td className="p-2">{salary?.b_parameter}</td>
                                    <td className="p-2">{salary?.c_parameter}</td>
                                    <td className="p-2">{salary?.d_parameter}</td>
                                    <td className="p-2">{salary?.total_km}</td>
                                    <td className="p-2">{salary?.total_salary}</td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
            {salaryCountingFormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setSalaryCountingFormState(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="font-bold text-xl">Couting Salary For Employee</div>
                                <div
                                    onClick={() => setSalaryCountingFormState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7">
                                <form
                                    className="flex flex-col gap-6 w-full justify-center items-center"
                                    onSubmit={handleSubmit}>
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                        <div className="loader"></div>
                                    </div>)}
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Employee's ID</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="id"
                                            required
                                            value={formData.user.id}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Month</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="month"
                                            required
                                            value={formData.user.month}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Year</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="year"
                                            required
                                            value={formData.user.year}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">a_parameter</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="a"
                                            required
                                            value={formData.user.a}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">b_parameter</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="b"
                                            required
                                            value={formData.user.b}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">c_parameter</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="c"
                                            required
                                            value={formData.user.c}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">d_parameter</span>
                                        </div>
                                        <input
                                            type="text"
                                            name="d"
                                            required
                                            value={formData.user.d}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div
                                        className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                        <button type="submit" className="w-full">Couting Salary</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    )
}

export default SalarySummarizie;