import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DayOffItem from "./DayOffItem";

const DayOffManagement = () => {
    const [requestList, setRequestList] = useState()
    const [requestModal, setRequestModal] = useState(false)
    const [requestId, setRequestId] = useState()
    const handleRequest = (answer_status, requestId) => {
        console.log(answer_status);
        if (answer_status === "pending") {
            setRequestModal(true);
            setRequestId(requestId);
        }
    };

    const handleApproveRequest = async () => {
        try {
            // Make a PUT request to update the answer_status to "approved"
            await axios.put(`https://qr-code-checkin.vercel.app/api/admin/manage-request/handle/${requestId}`, 
            {
                answer_status: "approved"
            }, 
            { withCredentials: true });
            // After successfully updating, close the modal and fetch the updated data
            setRequestModal(false);
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };


    useEffect(() => {
        const getAllRequestList = async () => {
            try {
                const response = await axios.get('https://qr-code-checkin.vercel.app/api/admin/manage-request/get-all', { withCredentials: true });
                setRequestList(response.data.message);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getAllRequestList();

    }, []);

    if (requestList) {
        console.log(requestList);
    }


    return (
        <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl mb-2">Day Off Management</h1>
                    <div className="flex flex-row">
                        <Link className="text-xl font-semibold leading-6 hover:underline" to="/">Dashboard</Link>
                        <div className="text-base font-semibold leading-6 text-[#6c757d]">/ Work Management</div>
                        <span className="text-[#6c757d] font-xl">/ Day Off</span>
                    </div>
                </div>

            </div>
            <div className="bg-[#f0f2f5] w-full flex flex-row p-5 font-Changa text-textColor gap-4">
                <div className="bg-white w-full h-auto p-10">
                    <div className="font-bold text-2xl text-textColor mb-8">Request Day Off List</div>
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
                                </tr>
                            </thead>
                            <tbody className="tbody">
                                {requestList?.map(({ _id, employee_id, employee_name, answer_status, request_content, request_dayOff_start, request_dayOff_end }) => (
                                    <tr className="tr-item">
                                        <td className="p-2 hover:text-buttonColor2">
                                            <h2 className="text-left">
                                                {/* <Link className="img-table-item-block" to={`viewprofile/${uuid}`}>
                                                <img className="img-table-item" src={imageUrl} alt="" />
                                            </Link> */}
                                                <Link className="cursor-pointer flex flex-col" >{employee_name}
                                                </Link>
                                            </h2>
                                        </td>
                                        <td className="p-2">{employee_id}</td>
                                        <td className="p-2">{request_dayOff_start.substring(0,10)}</td>
                                        <td className="p-2">{request_dayOff_end.substring(0,10)}</td>
                                        <td className="p-2">{request_content}</td>
                                        <td className="p-2 cursor-pointer hover:text-buttonColor2" onClick={() => handleRequest(answer_status, _id)}>{answer_status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                <div className="font-bold text-xl">Approve Request</div>
                                <div
                                    onClick={() => setRequestModal(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7 font-Changa justify-center items-center gap-4">
                                <span>Are you sure to approve this request?</span>
                                <div className="flex flex-row gap-3">
                                    <button onClick={() => setRequestModal(false)} type="button" className="w-[100px] bg-rose-800 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointe">No</button>
                                    <button onClick={handleApproveRequest} type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    )
}

export default DayOffManagement