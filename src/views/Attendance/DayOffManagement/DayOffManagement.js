import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { statusRequestList } from "assets/data/data";
// import { Link } from "react-router-dom";
import DayOffItem from "./DayOffItem";
import { baseUrl } from "components/api/httpService";
import { Pagination } from 'antd';

const DayOffManagement = () => {
    document.title = "Day Off Management"
    const [requestList, setRequestList] = useState()
    const [requestModal, setRequestModal] = useState(false)
    const [requestId, setRequestId] = useState()
    const [selectedStatus, setSelectedStatus] = useState("Select Status")
    const [statusMenu, setStatusMenu] = useState(false)

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const [checkManager, setCheckManager] = useState(false)

    // const PAGE_SIZE = 20
    // const [currentPage, setCurrentPage] = useState(1);
    // const indexOfLastItem = currentPage * PAGE_SIZE;
    // const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    // const currentDayOffLists = requestList?.slice(indexOfFirstItem, indexOfLastItem);
    // const totalPages = Math.ceil(requestList?.length / PAGE_SIZE);

    const [openExportRequest, setOpenExportRequest] = useState(false)
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setPageSize(size);
    };


    const handleChangeSelectedStatus = (item) => {
        setSelectedStatus(item)
    }

    const handleStatusMenu = () => {
        setStatusMenu(!statusMenu)
    }

    useEffect(() => {

        if (userObject?.role === 'Manager') {
            setCheckManager(true)
        }

    }, [userObject?.role]);
    const handleRequest = (answer_status, requestId) => {
        console.log(answer_status);
        if (answer_status === "pending") {
            setRequestModal(true);
            setRequestId(requestId);
        }
    };

    const handleSeacrh = async () => {
        if (userObject?.role === "Admin" && selectedStatus !== "Select Status") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-request/search?answer_status=${selectedStatus}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                setRequestList(response.data.message);
            } catch (error) {
                alert(error.response?.data?.messageror);
            }
        }
        if (userObject?.role === "Inhaber" && selectedStatus !== "Select Status") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-request/search?inhaber_name=${userObject?.name}&answer_status=${selectedStatus}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                setRequestList(response.data.message);
            } catch (error) {
                alert(error.response?.data?.messageror);
            }
        }
    };

    const handleApproveRequest = async () => {
        if (userObject?.role === "Admin") {
            try {
                // Make a PUT request to update the answer_status to "approved"
                await axios.put(`${baseUrl}/api/admin/manage-request/handle/${requestId}`,
                    {
                        answer_status: "approved"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                // After successfully updating, close the modal and fetch the updated data
                setRequestModal(false);
                getAllRequestList()
            } catch (error) {
                alert(error.response?.data?.messageror);
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                // Make a PUT request to update the answer_status to "approved"
                await axios.put(`${baseUrl}/api/inhaber/manage-request/handle/${requestId}?inhaber_name=${userObject?.name}`,
                    {
                        answer_status: "approved"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                // After successfully updating, close the modal and fetch the updated data
                setRequestModal(false);
                getAllRequestList()
            } catch (error) {
                alert(error.response?.data?.messageror);
            }
        }
    };

    const handleDenyRequest = async () => {
        if (userObject?.role === "Admin") {
            try {
                // Make a PUT request to update the answer_status to "approved"
                await axios.put(`${baseUrl}/api/admin/manage-request/handle/${requestId}`,
                    {
                        answer_status: "denied"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                // After successfully updating, close the modal and fetch the updated data
                setRequestModal(false);
                getAllRequestList()
            } catch (error) {
                alert(error.response?.data?.messageror);
            }
        }

        if (userObject?.role === "Inhaber") {
            try {
                // Make a PUT request to update the answer_status to "approved"
                await axios.put(`${baseUrl}/api/inhaber/manage-request/handle/${requestId}?inhaber_name=${userObject?.name}`,
                    {
                        answer_status: "denied"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                // After successfully updating, close the modal and fetch the updated data
                setRequestModal(false);
                getAllRequestList()
            } catch (error) {
                alert(error.response?.data?.messageror);
            }
        }
    };


    const getAllRequestList = async () => {
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-request/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setRequestList(response.data.message);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-request/get-all?inhaber_name=${userObject?.name}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setRequestList(response.data.message);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    useEffect(() => {
        getAllRequestList();
    }, []);

    if (requestList) {
        console.log(requestList);
    }

    const handleExportRequest = async () => {
        try {
            if (userObject?.role === "Admin") {
                const { data } = await axios.post(
                    `${baseUrl}/api/admin/manage-xlsx/request-records`,
                    {
                        requests:requestList
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
                link.download = `Request File.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            if (userObject?.role === "Inhaber") {
                const { data } = await axios.post(
                    `${baseUrl}/api/inhaber/manage-xlsx/request-records`,
                    {
                        requests:requestList
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
                link.download = `Request File.xlsx`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error("Error exporting Excel file:", error);
        } finally {
            // setLoading(false);
            setOpenExportRequest(false)
        }


    }

    return (
        <div>
            {checkManager ? (<div className="ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">YOU CANNOT ACCESS THIS ROUTE</div>)
                : (<div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <h1 className="font-bold text-3xl mb-2">Verwaltung freier Tage</h1>
                            <div className="flex flex-row">
                                <Link className="text-xl font-semibold leading-6 hover:underline" to="/dashboard">Dashboard</Link>
                                <div className="text-base font-semibold leading-6 text-[#6c757d]">/ Arbeitsmanagement</div>
                                <span className="text-[#6c757d] font-xl">/ Freie Tage</span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="flex flex-row px-4 gap-4">
                                <button onClick={() => setOpenExportRequest(!openExportRequest)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                                    <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                                    Export Request
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="z-10 flex flex-row mt-10 justify-between h-[50px]">
                        <div
                            onClick={handleStatusMenu}
                            className="w-1/5 h-[50px] text-base cursor-pointer">
                            <div className="flex flex-col w-full py-3 px-2 border border-solid text-placeholderTextColorw-2/3 text-base border-[#d9d9d9] text-[#6c757d] rounded-[6px] hover:border-[#4096ff] focus:border-[#4096ff] placeholder:text-placeholderTextColor">
                                <div className="flex flex-row items-center justify-around w-full">
                                    <div className="ml-4">{selectedStatus}</div>
                                    <div className={`w-4 h-4 flex justify-center items-center ${statusMenu ? "rotate-180" : ""}`}>
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="svg-inline--fa fa-caret-down fa-rotate-180 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ color: "rgb(220, 220, 220)" }}><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {statusMenu && (<div className="text-black bg-placeholderTextColor border border-solid border-placeholderTextColor border-t-black flex flex-col justify-center gap-3 px-2 py-3 items-center w-full overflow-y-scroll max-h-[200px]">
                                {statusRequestList.map(({ index, name }) => {
                                    return <div onClick={() => handleChangeSelectedStatus(name)} className="w-full text-center hover:underline">{name}</div>
                                })}
                            </div>)}
                        </div>
                        <div
                            onClick={handleSeacrh}
                            className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700 w-1/6">
                            <button className="search-btn">Suchen</button>
                        </div>
                    </div>
                    <div className="bg-[#f0f2f5] w-full flex flex-row p-5 font-Changa text-textColor gap-4">
                        <div className="bg-white w-full h-auto p-10">
                            <div className="font-bold text-2xl text-textColor mb-8">Fordern Sie die Liste der freien Tage an</div>
                            <div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                                <table className="w-full table">
                                    <thead className="">
                                        <tr className="">
                                            <th className="p-2 text-left">
                                                <Link to className="font-bold">Name</Link>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-id">Employee ID</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">From</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">To</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Reason</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Status</span>
                                            </th>
                                            <th className="p-2 text-left">
                                                <span className="table-title-role">Image</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="tbody">
                                        {currentDayOffLists?.map(({ _id, employee_id, employee_name, answer_status, request_content, request_dayOff_start, request_dayOff_end, image }) => (
                                            <tr className="tr-item">
                                                <td className="p-2 hover:text-buttonColor2">
                                                    <h2 className="text-left">
                                                        {/* <Link className="img-table-item-block" to={`viewprofile/${uuid}`}>
                                                <img className="img-table-item" src={imageUrl} alt="" />
                                            </Link> */}
                                                        <Link to={`/employee/view-profile/${employee_id}/${employee_name}`} className="cursor-pointer flex flex-col" >{employee_name}
                                                        </Link>
                                                    </h2>
                                                </td>
                                                <td className="p-2">{employee_id}</td>
                                                <td className="p-2">{`${String(new Date(request_dayOff_start).getDate()).padStart(2, '0')}-${String(new Date(request_dayOff_start).getMonth() + 1).padStart(2, '0')}-${new Date(request_dayOff_start).getFullYear()}`}</td>
                                                <td className="p-2">{`${String(new Date(request_dayOff_end).getDate()).padStart(2, '0')}-${String(new Date(request_dayOff_end).getMonth() + 1).padStart(2, '0')}-${new Date(request_dayOff_end).getFullYear()}`}</td>
                                                {request_content === "Sick day" ? (<td className="p-2">Krankheitstage mit AU-Bescheinigung</td>) : (<td className="p-2">Urlaub</td>)}
                                                {answer_status === "approved" && (<td className="p-2 cursor-pointer text-buttonColor2" onClick={() => handleRequest(answer_status, _id)}>{answer_status}</td>)}
                                                {answer_status === "pending" && (<td className="p-2 cursor-pointer text-amber-900" onClick={() => handleRequest(answer_status, _id)}>{answer_status}</td>)}
                                                {answer_status === "denied" && (<td className="p-2 cursor-pointer text-red-600" onClick={() => handleRequest(answer_status, _id)}>{answer_status}</td>)}
                                                <td className="p-2">
                                                    {image && (<Link target="blank" to={`${image}`} className="hover:text-buttonColor2">Link</Link>)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center items-center mt-4 mb-4">
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={requestList?.length}
                                    onChange={handlePageChange}
                                    className="text-base"
                                />
                            </div>
                        </div>
                    </div>
                    {requestModal && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                        <div
                            onClick={() => setRequestModal(false)}
                            className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                        <div className="absolute w-[400px] h-[200px] top-[300px] right-[500px] bottom-0 z-30 bg-white">
                            <div className="w-full h-full">
                                <div className="flex flex-col mt-8">
                                    <div className="flex flex-row justify-between px-8 items-center">
                                        <div className="font-bold text-xl">Handle Request</div>
                                        <div
                                            onClick={() => setRequestModal(false)}
                                            className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                    </div>
                                    <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                    <div className="flex flex-col px-8 w-full mt-7 font-Changa justify-center items-center gap-4">
                                        <span>Are you sure to approve this request?</span>
                                        <div className="flex flex-row gap-3">
                                            <button onClick={handleDenyRequest} type="button" className="w-[100px] bg-rose-800 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointe">Denied</button>
                                            <button onClick={handleApproveRequest} type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Approved</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}

                    {openExportRequest && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                    <div
                        onClick={() => setOpenExportRequest(false)}
                        className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                    <div className="absolute w-[600px] h-[250px] top-[300px] right-[500px] bottom-0 z-30 bg-white">
                        <div className="w-full h-full">
                            <div className="flex flex-col mt-8">
                                <div className="flex flex-row justify-between px-8 items-center">
                                    <div className="font-bold text-xl">Export file</div>
                                    <div
                                        onClick={() => setOpenExportRequest(false)}
                                        className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                </div>
                                <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                <div className="flex flex-col px-8 w-full mt-7 font-Changa justify-center items-center gap-4">
                                    <span>Do you want to export Request File.xlsx?</span>
                                    <div className="flex flex-row gap-3">
                                        <button onClick={() => setOpenExportRequest(false)} type="button" className="w-[100px] bg-rose-800 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointe">No</button>
                                        <button onClick={handleExportRequest} type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Yes</button>
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

export default DayOffManagement