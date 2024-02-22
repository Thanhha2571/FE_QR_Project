import { useState, useEffect } from "react";
import axios from "axios";
import LogItem from "./LogItem";
import { Link } from "react-router-dom";

const ManageLog = () => {
    const [logList, setLogList] = useState([]);
    const [checkAdmin, setCheckAdmin] = useState(false);

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const getAllLogs = async () => {
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-logs/get?type_update=Update attendance', { withCredentials: true });
                setLogList(response.data.message);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    useEffect(() => {
        getAllLogs();
        if (userObject?.role === "Admin") {
            setCheckAdmin(true);
        }
    }, [userObject?.role]);

    return (
        <div>
            {checkAdmin ? (
                <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <h1 className="font-bold text-3xl">Manage Logs</h1>
                            <div className="flex flex-row">
                                <Link className="text-xl font-semibold leading-6 hover:underline" to="/dashboard">Dashboard</Link>
                                <span className="text-[#6c757d] font-xl">/ Manage Logs</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xl font-semibold leading-6">List All Logs</div>

                    <div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                    <table className="w-full table">
                    <thead className="">
                        <tr className="">
                            <th className="p-4 text-left">
                                <span className="font-bold">Date Edited</span>
                            </th>
                            <th className="p-4 text-left">
                                <span className="table-title-id">Editor Name</span>
                            </th>
                            <th className="p-4 text-left">
                                <span className="table-title-role">Editor Role</span>
                            </th>
                            <th className="p-4 text-left">
                                <span className="table-title-id">Edited Name</span>
                            </th>
                            <th className="p-4 text-left">
                                <span className="table-title-role">Edited Role</span>
                            </th>
                            <th className="p-4 text-left">
                                <span className="table-title-role">Shift Code</span>
                            </th>
                            <th className="p-4 text-left">
                                <span className="table-title-role">Shift Date</span>
                            </th>
                            <th className="p-4 text-left">
                                <span className="table-title-role">Before Update</span>
                            </th>
                            <th></th>
                            <th className="p-4 text-left">
                                <span className="table-title-role">After Update</span>
                            </th>
                        </tr>
                    </thead>
                    {Array.isArray(logList) && logList?.length === 0 ? (
                        <div className="no-result-text">NO RESULT</div>
                    ) : (
                        <tbody className="tbody">
                            {logList?.map(({ date, _id, editor_name, editor_role, edited_name, edited_role, before_update, after_update }) => (
                                <LogItem
                                    key={_id}
                                    date={date}
                                    editor_name={editor_name}
                                    editor_role={editor_role}
                                    edited_name={edited_name}
                                    edited_role={edited_role}
                                    before_update={before_update}
                                    after_update={after_update}
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
    );
}

export default ManageLog;