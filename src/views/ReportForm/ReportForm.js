import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReportFormItem from "./ReportFormItem";
import "./ReportForm.css"
import { DatePicker, Space } from 'antd';
import { baseUrl } from "components/api/httpService";
import { Pagination } from 'antd';
const { RangePicker } = DatePicker;
const dateFormat = 'MM/DD/YYYY';

const ReportForm = () => {
    document.title = "Berichtsformular";
    const [formList, setFormList] = useState()
    const [loading, setLoading] = useState(false);

    const [exportState, setExportState] = useState(false)
    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const [datePicker, setDatePicker] = useState("")
    const [departmentMenu, setDepartmentMenu] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState("Abteilung auswählen");
    const [departmentList, setDepartmentList] = useState()

    // const PAGE_SIZE = 50
    // const [currentPage, setCurrentPage] = useState(1);
    // const indexOfLastItem = currentPage * PAGE_SIZE;
    // const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    // const currentForms = formList?.slice(indexOfFirstItem, indexOfLastItem);
    // const totalPages = Math.ceil(formList?.length / PAGE_SIZE);

    const [pageSize, setPageSize] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentForms = formList?.slice(indexOfFirstItem, indexOfFirstItem + pageSize);
    const totalPages = Math.ceil(formList?.length / pageSize);

    const [openExportReport, setOpenExportReport] = useState(false)
    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    useEffect(() => {
        if (userObject?.role === 'Admin' || userObject?.role === 'Inhaber') {
            setExportState(true)
        }
    }, [userObject?.role])

    const getAllForms = async () => {
        setLoading(true)
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-form/get`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setFormList(response?.data?.message);
                setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                setLoading(false)
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-form/get?inhaber_name=${userObject?.name}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setFormList(response?.data?.message);
                setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                setLoading(false)
            }
        }
    };

    const getAllDepartments = async () => {
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-department/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setDepartmentList(response.data);
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
        getAllDepartments()
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
        setLoading(true)
        if (userObject?.role === "Admin") {
            setFormList([])
            if (datePicker !== "" && selectedDepartment === "Abteilung auswählen") {
                try {
                    const response = await axios.get(`${baseUrl}/api/admin/manage-form/get?startDate=${datePicker[0]}&endDate=${datePicker[1]}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    setFormList(response?.data?.message);
                    setLoading(false)
                } catch (err) {
                    alert(err.response?.data?.message)
                    setLoading(false)
                } finally {
                    setSelectedDepartment("Abteilung auswählen")
                    setLoading(false)
                }
            }

            if (datePicker === "" && selectedDepartment !== "Abteilung auswählen") {
                try {
                    const response = await axios.get(`${baseUrl}/api/admin/manage-form/get?department_name=${selectedDepartment}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    setFormList(response?.data?.message);
                    setLoading(false)
                } catch (err) {
                    alert(err.response?.data?.message)
                    setLoading(false)
                } finally {
                    setSelectedDepartment("Abteilung auswählen")
                    setLoading(false)
                }
            }
            if (datePicker !== "" && selectedDepartment !== "Abteilung auswählen") {
                try {
                    const response = await axios.get(`${baseUrl}/api/admin/manage-form/get?startDate=${datePicker[0]}&endDate=${datePicker[1]}&department_name=${selectedDepartment}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    setFormList(response?.data?.message);
                    setLoading(false)
                } catch (err) {
                    alert(err.response?.data?.message)
                    setLoading(false)
                } finally {
                    setSelectedDepartment("Abteilung auswählen")
                    setLoading(false)
                }
            }
        }

        if (userObject?.role === "Inhaber") {
            setFormList([])
            if (datePicker !== "" && selectedDepartment === "Abteilung auswählen") {
                try {
                    const response = await axios.get(`${baseUrl}/api/inhaber/manage-form/get?inhaber_name=${userObject?.name}&startDate=${datePicker[0]}&endDate=${datePicker[1]}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    setFormList(response?.data?.message);
                    setLoading(false)
                } catch (err) {
                    alert(err.response?.data?.message)
                    setLoading(false)
                } finally {
                    setSelectedDepartment("Abteilung auswählen")
                    setLoading(false)
                }
            }

            if (datePicker === "" && selectedDepartment !== "Abteilung auswählen") {
                try {
                    const response = await axios.get(`${baseUrl}/api/inhaber/manage-form/get?inhaber_name=${userObject?.name}&department_name=${selectedDepartment}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    setFormList(response?.data?.message);
                    setLoading(false)
                } catch (err) {
                    alert(err.response?.data?.message)
                    setLoading(false)
                } finally {
                    setSelectedDepartment("Abteilung auswählen")
                    setLoading(false)
                }
            }
            if (datePicker !== "" && selectedDepartment !== "Abteilung auswählen") {
                try {
                    const response = await axios.get(`${baseUrl}/api/inhaber/manage-form/get?inhaber_name=${userObject?.name}&startDate=${datePicker[0]}&endDate=${datePicker[1]}&department_name=${selectedDepartment}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                    setFormList(response?.data?.message);
                    setLoading(false)
                } catch (err) {
                    alert(err.response?.data?.message)
                    setLoading(false)
                } finally {
                    setSelectedDepartment("Abteilung auswählen")
                    setLoading(false)
                }
            }
        }
    }
    const handleExportReportForm = async () => {
        setLoading(true);
        if (userObject?.role === "Admin") {
            try {
                setLoading(true);
                const { data } = await axios.post(
                    `${baseUrl}/api/admin/manage-xlsx/form-records`,
                    {
                        attendanceRecords: formList,
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
                link.download = `Berichte.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                // console.error("Error exporting Excel file:", error);
            } finally {
                setLoading(false);
                setOpenExportReport(false)
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                setLoading(true);
                const { data } = await axios.post(
                    `${baseUrl}/api/inhaber/manage-xlsx/form-records`,
                    {
                        attendanceRecords: formList,
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
                link.download = `Berichte.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                // console.error("Error exporting Excel file:", error);
            } finally {
                setLoading(false);
                setOpenExportReport(false)
            }
        }
    }
    return (
        <div>
            {exportState ? (
                <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <h1 className="font-bold text-3xl">Berichtsformular</h1>
                            <div className="flex flex-row">
                                <Link className="text-xl font-semibold leading-6 hover:underline" to="/dashboard">Dashboard</Link>
                                <span className="text-[#6c757d] font-xl">/ Berichtsformular</span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="flex flex-row px-4 gap-4">
                                <button onClick={() => setOpenExportReport(!openExportReport)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                                    <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                                    Export Report Form
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="text-xl font-semibold leading-6">Berichtsformular</div>
                    {/* //----------------------------------------------------------------FORM MANAGEMENT------------------------------------------------------------------------------------// */}

                    <div className="p-5 w-full flex flex-col gap-10">
                        <div className="z-10 flex flex-row mt-10 justify-between h-[50px] gap-8 w-full">
                            <Space className="w-2/5" direction="vertical" size={12}>
                                <RangePicker
                                    className="w-full h-[50px] text-base text-placeholderTextColor"
                                    onChange={handleDateChange}
                                    format={dateFormat}
                                />
                            </Space>
                            <div className="flex flex-row gap-10 w-1/2">
                                {checkAdmin && (<div
                                    onClick={handleDepartmentMenu}
                                    className="text-base w-2/5 h-[50px] cursor-pointer">
                                    <div className="flex flex-col w-full py-3 px-2 border border-solid border-[#d9d9d9] text-placeholderTextColor rounded-[6px] justify-center items-center">
                                        <div className="flex flex-row items-center justify-center w-full gap-3">
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
                                    <button className="search-btn">Suchen</button>
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
                                        <span className="font-bold">Zeit</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-id">Name</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">ID</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">Abteilung</span>
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
                                        <span className="table-title-role">Informationsformular</span>
                                    </th>
                                </tr>
                            </thead>
                            {Array.isArray(currentForms) && currentForms?.length === 0 ? (
                                <div className="no-result-text">NO RESULT</div>
                            ) : (
                                <tbody className="tbody">
                                    {currentForms?.map(({ date, created_at, employee_id, department_name, employee_name, position, car_info, check_in_km, check_out_km, bar, kredit_karte, kassen_schniff, gesamt_ligerbude, results, gesamt_liegerando, gesamt, trinked_ec, trink_geld, auf_rechnung }) => (
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
                                            department_name={department_name}
                                            time={created_at}
                                        />
                                    ))}
                                </tbody>
                            )}
                        </table>
                        {loading && (<div className="flex w-full h-full items-center justify-center mt-10">
                            <div className="loader_search"></div>
                        </div>)}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center items-center mt-4 mb-4">
                        {/* {totalPages > 1 && (
                            <div className="flex flex-wrap gap-2 justify-center items-center">
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`text-xl border border-solid py-2 px-4 hover:bg-[#4caf50] ${currentPage === index + 1 ? 'active' : ''}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )} */}
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={formList?.length}
                            onChange={handlePageChange}
                            className="text-base"
                        />
                    </div>
                    {openExportReport && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                        <div
                            onClick={() => setOpenExportReport(false)}
                            className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                        <div className="absolute w-[700px] h-[200px] top-[300px] right-[500px] bottom-0 z-30 bg-white">
                            <div className="w-full h-full">
                                <div className="flex flex-col mt-8">
                                    <div className="flex flex-row justify-between px-8 items-center">
                                        <div className="font-bold text-xl">Export file</div>
                                        <div
                                            onClick={() => setOpenExportReport(false)}
                                            className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                    </div>
                                    <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                    <div className="flex flex-col px-8 w-full mt-7 font-Changa justify-center items-center gap-4">
                                        <span>Do you want to export Berichte</span>
                                        <div className="flex flex-row gap-3">
                                            <button onClick={() => setOpenExportReport(false)} type="button" className="w-[100px] bg-rose-800 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointe">No</button>
                                            <button onClick={handleExportReportForm} type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Yes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}
                </div>
            ) : (
                <div className="ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">YOU CANNOT ACCESS THIS ROUTE</div>
            )}
        </div>
    )
}

export default ReportForm