import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReportFormItem from "./ReportFormItem";

const ReportForm = () => {
    const [formList, setFormList] = useState()
    const [loading, setLoading] = useState(false);

    const [exportState, setExportState] = useState(false)
    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (userObject?.role === 'Admin' || userObject?.role === 'Inhaber') {
            setExportState(true)
        }
    }, [userObject?.role])

    const getAllForms = async () => {
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-form/get?year=2024&month=1', { withCredentials: true });
                // console.log(response.data.message);
                setFormList(response?.data?.message);
            } catch (err) {
                alert(err.response?.data?.message)
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-form/get?year=2024&month=1&inhaber_name=${userObject?.name}`, { withCredentials: true });
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
                                    {formList?.map(({ date, employee_id,employee_name, position, car_info, check_in_km, check_out_km, bar,kredit_karte, kassen_schniff,gesamt_ligerbude,results,gesamt_liegerando,gesamt, trinked_ec, trink_geld, auf_rechnung }) => (
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