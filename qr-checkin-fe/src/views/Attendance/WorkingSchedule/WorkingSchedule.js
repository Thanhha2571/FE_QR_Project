import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ShiftItem from "./ShiftItem";
import "./WorkingSchedule.css"

const WorkingSchedule = () => {
    const [shiftList, setShiftList] = useState()
    const [shiftManageState, setShiftManageState] = useState(true)
    const [createShiftFormState, setCreateShiftFormState] = useState(false)
    const [loading, setLoading] = useState(false);

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const getAllShifts = async () => {
            if (userObject?.role === "Admin") {
                try {
                    const response = await axios.get('https://qr-code-checkin.vercel.app/api/admin/manage-shift/get-all', { withCredentials: true });
                    // console.log(response.data.message);
                    setShiftList(response.data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }

            if (userObject?.role === "Inhaber") {
                try {
                    const response = await axios.get('https://qr-code-checkin.vercel.app/api/inhaber/manage-shift/get-all', { withCredentials: true });
                    // console.log(response.data.message);
                    setShiftList(response.data.message);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        getAllShifts();
    }, [userObject?.role]);
    if (shiftList) {
        console.log(shiftList);
    }

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        start_time: '',
        end_time: '',
        total_number: 1,
        time_check: 2,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        const shiftData = {
            code: formData.code,
            name: formData.name,
            time_slot: {
                start_time: formData.start_time,
                end_time: formData.end_time,
            },
        };
        setLoading(true);

        if (userObject?.role === "Admin") {
            try {
                const { data } = await axios.post('https://qr-code-checkin.vercel.app/api/admin/manage-shift/create', shiftData, { withCredentials: true })
                // setTimeout(() => {
                //     window.location.reload();
                // }, 3000);
            } catch (error) {
                // Handle error
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false);
            }
        }

        if (userObject?.role === "Inhaber") {
            try {
                const { data } = await axios.post('https://qr-code-checkin.vercel.app/api/inhaber/manage-shift/create', shiftData, { withCredentials: true })
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } catch (error) {
                // Handle error
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl">Working Schedule</h1>
                    <div className="flex flex-row">
                        <Link className="text-xl font-semibold leading-6 hover:underline" to="/">Dashboard</Link>
                        <span className="text-[#6c757d] font-xl">/ Working Schedule</span>
                    </div>
                </div>
                <div className="flex flex-row px-4 gap-4">
                    <button onClick={() => setCreateShiftFormState(!createShiftFormState)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                        <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                        Create Shift
                    </button>
                </div>
            </div>
            <div className="text-xl font-semibold leading-6">Working Schedule Management</div>
            <div className="flex flex-row gap-4 text-xl">
                <div
                    onClick={() => {
                        setShiftManageState(true)
                    }}
                    className={`hover:text-buttonColor1 cursor-pointer ${shiftManageState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Shift Management</div>
            </div>

            {/* //---------------------------------------------------------------- CREATE SHIFT ------------------------------------------------------------------------------------// */}

            {createShiftFormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setCreateShiftFormState(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[750px] top-0 right-0 bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="font-bold text-xl">Crete New Shift</div>
                                <div
                                    onClick={() => setCreateShiftFormState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full justify-center items-center">
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                        <div className="loader"></div>
                                    </div>)}
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Shift's Code</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Shift's Name</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Start Time</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="start_time"
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 20:00"
                                            required
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">End Time</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="end_time"
                                            name="end_time"
                                            value={formData.end_time}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 22:00"
                                            required
                                        />
                                    </div>
                                    <button className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full" type="submit" onClick={handleSubmit}>
                                        Create Shift
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}

            {/* //----------------------------------------------------------------SHIFT MANAGEMENT------------------------------------------------------------------------------------// */}

            {shiftManageState && (<div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                <table className="w-full table">
                    <thead className="">
                        <tr className="">
                            <th className="p-4 text-left">
                                <span className="font-bold">Name</span>
                            </th>
                            <th className="p-4 text-left">
                                <span className="table-title-id">Shift ID</span>
                            </th>
                            <th className="p-4 text-left">
                                <span className="table-title-role">Time</span>
                            </th>
                        </tr>
                    </thead>
                    {Array.isArray(shiftList) && shiftList?.length === 0 ? (
                        <div className="no-result-text">NO RESULT</div>
                    ) : (
                        <tbody className="tbody">
                            {shiftList?.map(({ id, name, code, time_slot }) => (
                                <ShiftItem
                                    key={id}
                                    name={name}
                                    code={code}
                                    time_slot={time_slot}
                                />
                            ))}
                        </tbody>
                    )}
                </table>
            </div>)}
        </div>
    )
}

export default WorkingSchedule