import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReportFormItem from "./ReportFormItem";
import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;
const dateFormat = 'MM/DD/YYYY';

const ReportForm = () => {
    document.title = "Report Form";
    const [formList, setFormList] = useState()
    const [loading, setLoading] = useState(false);

    const [exportState, setExportState] = useState(false)
    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const [datePicker, setDatePicker] = useState("")
    const [departmentMenu, setDepartmentMenu] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState("Selected Department");
    const [departmentList, setDepartmentList] = useState()

    useEffect(() => {
        if (userObject?.role === 'Admin' || userObject?.role === 'Inhaber') {
            setExportState(true)
        }
    }, [userObject?.role])

    const getAllForms = async () => {
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-form/get', { withCredentials: true });
                // console.log(response.data.message);
                setFormList(response?.data?.message);
            } catch (err) {
                alert(err.response?.data?.message)
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-form/get?inhaber_name=${userObject?.name}`, { withCredentials: true });
                // console.log(response.data.message);
                setFormList(response?.data?.message);
            } catch (err) {
                alert(err.response?.data?.message)
            }
        }
    };

    useEffect(() => {
        if (userObject?.role === 'Admin') {
            setCheckAdmin(true)
            setCheckInhaber(false)
        }

        if (userObject?.role === 'Inhaber') {
            setCheckAdmin(false)
            setCheckInhaber(true)
        }

    }, [userObject?.role])

    useEffect(() => {
        getAllForms();
    }, []);

    const handleDateChange = (date, dateString) => {
        console.log('Selected Date:', dateString);
        setDatePicker(dateString)
    };

    const handleDepartmentMenu = () => {
        setDepartmentMenu(!departmentMenu)
    }

    const handleChangeSelectedDepartment = (item) => {
        setSelectedDepartment(item)
    };

    const handleSeacrh = async () => {
        if (userObject?.role === "Admin") {
            setFormList([])
            if (datePicker !== "") {
                try {
                    const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-form/get?startDate=${datePicker[0]}&endDate=${datePicker[1]}`, { withCredentials: true })
                    setFormList(response?.data?.message);
                } catch (e) {
                    alert("something went wrong")
                }
            }

            if (selectedDepartment === "Selected Department") {
                try {
                    const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-form/get?department_name=${selectedDepartment}`, { withCredentials: true })
                    setFormList(response?.data?.message);
                } catch (e) {
                    alert("something went wrong")
                }
            }
        }
    }
    return (
        <div>
            {exportState ? (
                <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <h1 className="font-bold text-3xl">Report Form Management</h1>
                            <div className="flex flex-row">
                                <Link className="text-xl font-semibold leading-6 hover:underline" to="/dashboard">Dashboard</Link>
                                <span className="text-[#6c757d] font-xl">/ Report Form Management</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xl font-semibold leading-6">Report Form Management</div>
                    <div className="flex flex-row gap-4 text-xl">
                        <div
                            className="cursor-pointer text-buttonColor1 underline decoration-buttonColor1">Form Management</div>
                    </div>




                    {/* //----------------------------------------------------------------FORM MANAGEMENT------------------------------------------------------------------------------------// */}

                    <div className="p-5 w-full flex flex-col gap-10">
                        <div className="z-10 flex flex-row mt-10 justify-between h-[50px] gap-8">
                            <Space className="w-2/5" direction="vertical" size={12}>
                                <RangePicker
                                    className="w-full h-[50px] text-base text-placeholderTextColor"
                                    onChange={handleDateChange}
                                    format={dateFormat}
                                />
                            </Space>
                            <div className="flex flex-row gap-20 w-full">
                                {checkAdmin && (<div
                                    onClick={handleDepartmentMenu}
                                    className="text-base w-3/10 h-[50px] cursor-pointer">
                                    <div className="flex flex-col w-full py-3 px-2 border border-solid border-[#d9d9d9] text-placeholderTextColor rounded-[6px]">
                                        <div className="flex flex-row items-center justify-around w-full gap-2">
                                            <div className="ml-4">{selectedDepartment}</div>
                                            <div className={`w-4 h-4 flex justify-center items-center ${departmentMenu ? "rotate-180" : ""}`}>
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="svg-inline--fa fa-caret-down fa-rotate-180 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ color: "rgb(220, 220, 220)" }}><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {departmentMenu && (<div className="text-black bg-placeholderTextColor border border-solid border-placeholderTextColor border-t-[#d9d9d9] flex flex-col gap-3 px-2 py-3 items-center w-full overflow-y-scroll max-h-[200px]">
                                        {departmentList?.map(({ index, name }) => {
                                            return <div onClick={() => handleChangeSelectedDepartment(name)} className="w-full text-center hover:underline">{name}</div>
                                        })}
                                    </div>)}
                                </div>)}
                                <div
                                    onClick={handleSeacrh}
                                    className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700 w-1/6">
                                    <button className="search-btn">Seacrh</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                        <table className="w-full table">
                            <thead className="">
                                <tr className="">
                                    <th className="p-4 text-left">
                                        <span className="font-bold">Date</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-id">Name</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">ID</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">Position</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">Car Info</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">Check In Km</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">Check Out Km</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">Information Form</span>
                                    </th>
                                </tr>
                            </thead>
                            {Array.isArray(formList) && formList?.length === 0 ? (
                                <div className="no-result-text">NO RESULT</div>
                            ) : (
                                <tbody className="tbody">
                                    {formList?.map(({ date, employee_id, employee_name, position, car_info, check_in_km, check_out_km, bar, kredit_karte, kassen_schniff, gesamt_ligerbude, results, gesamt_liegerando, gesamt, trinked_ec, trink_geld, auf_rechnung }) => (
                                        <ReportFormItem
                                            date={date}
                                            employee_id={employee_id}
                                            employee_name={employee_name}
                                            position={position}
                                            car_info={car_info}
                                            check_in_km={check_in_km}
                                            check_out_km={check_out_km}
                                            bar={bar}
                                            kredit_karte={kredit_karte}
                                            kassen_schniff={kassen_schniff}
                                            gesamt_ligerbude={gesamt_ligerbude}
                                            gesamt_liegerando={gesamt_liegerando}
                                            results={results}
                                            gesamt={gesamt}
                                            trinked_ec={trinked_ec}
                                            trink_geld={trink_geld}
                                            auf_rechnung={auf_rechnung}
                                        />
                                    ))}
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            ) : (
                <div className="ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">YOU CANNOT ACCESS THIS ROUTE</div>
            )}
        </div>
    )
}

export default ReportForm