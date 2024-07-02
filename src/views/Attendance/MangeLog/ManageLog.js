import { useState, useEffect } from "react";
import axios from "axios";
import LogItem from "./LogItem";
import { Link } from "react-router-dom";
import "./ManageLog.css"
import { baseUrl } from "components/api/httpService";

const ManageLog = () => {
    document.title = "Log Management";
    const [logList, setLogList] = useState([]);
    const [checkAdmin, setCheckAdmin] = useState(false);

    const [loading, setLoading] = useState(false);

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const PAGE_SIZE = 20
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * PAGE_SIZE;
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    const currentLogs = logList?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(logList?.length / PAGE_SIZE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getAllLogs = async () => {
        if (userObject?.role === "Admin") {
            setLoading(true)
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-logs/get?type_update=Update attendanc`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setLogList(response.data.message);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
                alert(error?.response?.data?.message);
                setLoading(false)
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
                            {Array.isArray(currentLogs) && currentLogs?.length === 0 ? (
                                <div className="no-result-text">NO RESULT</div>
                            ) : (
                                <tbody className="tbody">
                                    {currentLogs?.map(({ date, _id, editor_name, editor_role, edited_name, edited_role, before_update, after_update }) => (
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
                    {loading && (<div className="flex w-full h-full items-center justify-center mt-10">
                        <div className="loader_search"></div>
                    </div>)}
                    <div className="flex justify-center">
                        {totalPages > 1 && (
                            <div className="flex flex-row gap-2">
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className="text-xl border border-solid py-2 px-4 hover:bg-[#f6f6f6]"
                                    // className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">YOU CANNOT ACCESS THIS ROUTE</div>
            )}
        </div>
    );
}

export default ManageLog;