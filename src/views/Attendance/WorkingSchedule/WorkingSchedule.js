import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ShiftItem from "./ShiftItem";
import "./WorkingSchedule.css"
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker } from 'antd';
import { baseUrl } from "components/api/httpService";
const format = 'HH:mm';

const WorkingSchedule = () => {
    document.title = 'Working Schedule';
    const [shiftList, setShiftList] = useState()
    const [shiftListConst, setShiftListConst] = useState()
    const [shiftManageState, setShiftManageState] = useState(true)

    const [createShiftFormState, setCreateShiftFormState] = useState(false)
    const [deleteShiftFormState, setDeleteShiftFormState] = useState(false)
    const [editShiftFormState, setEditShiftFormState] = useState(false)
    const [selectedShiftDelete, setSelectedShiftDelete] = useState("")
    const [selectedShiftEdit, setSelectedShiftEdit] = useState("")
    const [timeStartCreate, setTimeStartCreate] = useState("")
    const [timeEndCreate, setTimeEndCreate] = useState("")
    const [timeStartEdit, setTimeStartEdit] = useState("")
    const [timeEndEdit, setTimeEndEdit] = useState("")
    const [loading, setLoading] = useState(true);
    const [exportState, setExportState] = useState(false)

    const [selectedShiftId, setSelectedShiftId] = useState("Select Shift Code")
    const [shiftIdMenu, setShiftIdMenu] = useState(false)

    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    const handleChangeSelectedShiftIdMenu = (item) => {
        setSelectedShiftId(item)
    }

    const handleShiftIdList = () => {
        setShiftIdMenu(!shiftIdMenu)
    }

    useEffect(() => {
        if (userObject?.role === 'Admin' || userObject?.role === 'Inhaber') {
            setExportState(true)
        }
    }, [userObject?.role])

    const getAllShifts = async () => {
        setLoading(true)
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-shift/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setShiftList(response.data.message);
                setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                setLoading(false)
            }
        }

        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-shift/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setShiftList(response.data.message);
                setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                setLoading(false)
            }
        }
        if (userObject?.role === "Manager") {
            try {
                const response = await axios.get(`${baseUrl}/api/manager/manage-shift/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setShiftList(response.data.message);
                setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                setLoading(false)
            }
        }
    };

    const getAllShiftsConst = async () => {
        setLoading(true)
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-shift/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setShiftListConst(response.data.message);
                setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                setLoading(false)
            }
        }

        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-shift/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setShiftListConst(response.data.message);
                setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                setLoading(false)
            }
        }
        if (userObject?.role === "Manager") {
            try {
                const response = await axios.get(`${baseUrl}/api/manager/manage-shift/get-all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // console.log(response.data.message);
                setShiftListConst(response.data.message);
                setLoading(false)
            } catch (err) {
                alert(err.response?.data?.message)
                setLoading(false)
            }
        }
    };

    useEffect(() => {
        getAllShifts();
        getAllShiftsConst();
    }, []);

    const handleTimeStartCreateShift = (time) => {
        setTimeStartCreate(time.format('HH:mm'))
    }
    const handleTimeEndCreateShift = (time) => {
        setTimeEndCreate(time.format('HH:mm'))
    }
    const handleTimeStartEditShift = (time) => {
        setTimeStartEdit(time.format('HH:mm'))
    }
    const handleTimeEndEditShift = (time) => {
        setTimeEndEdit(time.format('HH:mm'))
    }
    // if (shiftList) {
    //     console.log(shiftList);
    // }

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        // start_time: '',
        // end_time: '',
    });

    const [formEdit, setFormEdit] = useState({
        name_edit: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setFormEdit({
            ...formEdit,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const shiftData = {
            code: formData.code,
            name: formData.name,
            time_slot: {
                start_time: timeStartCreate,
                end_time: timeEndCreate,
            },
        };
        setLoading(true);

        try {
            let response;

            if (userObject?.role === "Admin") {
                response = await axios.post(`${baseUrl}/api/admin/manage-shift/create`, shiftData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            }

            if (userObject?.role === "Inhaber") {
                response = await axios.post(`${baseUrl}/api/inhaber/manage-shift/create`, shiftData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            }

            // Fetch the updated list of shifts after creating a new shift
            getAllShifts();

            // Optionally, you can clear the form data or close the form
            setFormData({
                code: '',
                name: '',
            });
            setTimeEndCreate("")
            setTimeStartCreate("")
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
        } catch (err) {
            alert(err.response?.data?.message)
        } finally {
            setLoading(false);
            setCreateShiftFormState(false);
        }
    };


    const handleDeleteShiftSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;

            if (userObject?.role === "Admin") {
                response = await axios.delete(`${baseUrl}/api/admin/manage-shift/delete?code=${selectedShiftDelete}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            }

            if (userObject?.role === "Inhaber") {
                response = await axios.delete(`${baseUrl}/api/inhaber/manage-shift/delete?code=${selectedShiftDelete}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            }

            // Fetch the updated list of shifts after creating a new shift
            getAllShifts();

            // Optionally, you can clear the form data or close the for
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
        } catch (err) {
            alert(err.response?.data?.message)
        } finally {
            setLoading(false);
            setDeleteShiftFormState(false);
            setSelectedShiftDelete("")

        }
    };

    const handleEditShiftSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;

            if (userObject?.role === "Admin" && formEdit.name_edit !== "" && formEdit.start_time_edit === "" && formEdit.end_time_edit === "") {
                response = await axios.put(`${baseUrl}/api/admin/manage-shift/update?code=${selectedShiftEdit}`, {
                    name: formEdit.name_edit
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

            }

            if (userObject?.role === "Admin" && formEdit.name_edit === "" && formEdit.start_time_edit !== "" && formEdit.end_time_edit !== "") {
                response = await axios.put(`${baseUrl}/api/admin/manage-shift/update?code=${selectedShiftEdit}`, {
                    time_slot: {
                        start_time: timeStartEdit,
                        end_time: timeEndEdit
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

            }

            if (userObject?.role === "Admin" && formEdit.name_edit !== "" && formEdit.start_time_edit !== "" && formEdit.end_time_edit !== "") {
                response = await axios.put(`${baseUrl}/api/admin/manage-shift/update?code=${selectedShiftEdit}`, {
                    name: formEdit.name_edit,
                    time_slot: {
                        start_time: timeStartEdit,
                        end_time: timeEndEdit
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

            }

            if (userObject?.role === "Inhaber" && formEdit.name_edit !== "" && formEdit.start_time_edit === "" && formEdit.end_time_edit === "") {
                response = await axios.put(`${baseUrl}/api/inhaber/manage-shift/update?code=${selectedShiftEdit}`, {
                    name: formEdit.name_edit
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

            }

            if (userObject?.role === "Inhaber" && formEdit.name_edit === "" && formEdit.start_time_edit !== "" && formEdit.end_time_edit !== "") {
                response = await axios.put(`${baseUrl}/api/inhaber/manage-shift/update?code=${selectedShiftEdit}`, {
                    time_slot: {
                        start_time: timeStartEdit,
                        end_time: timeEndEdit
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

            }

            if (userObject?.role === "Inhaber" && formEdit.name_edit !== "" && formEdit.start_time_edit !== "" && formEdit.end_time_edit !== "") {
                response = await axios.put(`${baseUrl}/api/inhaber/manage-shift/update?code=${selectedShiftEdit}`, {
                    name: formEdit.name_edit,
                    time_slot: {
                        start_time: timeStartEdit,
                        end_time: timeEndEdit
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

            }

            // Fetch the updated list of shifts after creating a new shift
            getAllShifts();

            // Optionally, you can clear the form data or close the form
            setFormEdit({
                name_edit: '',
            });
            setTimeStartEdit("")
            setTimeEndEdit("")
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
        } catch (err) {
            alert(err.response?.data?.message)
        } finally {
            setLoading(false);
            setEditShiftFormState(false);
            setSelectedShiftEdit('')

        }
    };

    const handleSeacrh = async () => {
        if (userObject?.role === "Admin" && selectedShiftId !== "Select Shift Code") {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/manage-shift/get-by-code?code=${selectedShiftId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                setShiftList(response?.data?.message);
            } catch (error) {
                alert(error.response?.data?.messageror);
            }
        }
        if (userObject?.role === "Inhaber" && selectedShiftId !== "Select Shift Code") {
            try {
                const response = await axios.get(`${baseUrl}/api/inhaber/manage-shift/get-by-code?code=${selectedShiftId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                setShiftList(response?.data?.message);
            } catch (error) {
                alert(error.response?.data?.messageror);
            }
        }
        if (userObject?.role === "Manager" && selectedShiftId !== "Select Shift Code") {
            try {
                const response = await axios.get(`${baseUrl}/api/manager/manage-shift/get-by-code?code=${selectedShiftId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                setShiftList(response?.data?.message);
            } catch (error) {
                alert(error.response?.data?.messageror);
            }
        }
    };

    return (
        <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
            <div className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl">Schichtplan</h1>
                    <div className="flex flex-row">
                        <Link className="text-xl font-semibold leading-6 hover:underline" to="/dashboard">Dashboard</Link>
                        <span className="text-[#6c757d] font-xl">/ Schichtplan</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    {exportState && (<div className="flex flex-row px-4 gap-4">
                        <button onClick={() => setCreateShiftFormState(!createShiftFormState)} className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-emerald-800">
                            <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            Schicht erstellen
                        </button>
                    </div>)}
                    {exportState && (<div className="flex flex-row px-4 gap-4">
                        <button onClick={() => setEditShiftFormState(!editShiftFormState)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                            <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            Schicht bearbeiten
                        </button>
                    </div>)}
                    {exportState && (<div className="flex flex-row px-4 gap-4">
                        <button onClick={() => setDeleteShiftFormState(!deleteShiftFormState)} className="bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-red-800">
                            <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            Schicht löschen
                        </button>
                    </div>)}
                </div>
            </div>
            <div className="text-xl font-semibold leading-6">Schichtplan</div>
            <div className="z-10 flex flex-row mt-10 justify-between h-[50px]">
                <div
                    onClick={handleShiftIdList}
                    className="w-1/5 h-[50px] text-base cursor-pointer">
                    <div className="flex flex-col w-full py-3 px-2 border border-solid text-placeholderTextColorw-2/3 text-base border-[#d9d9d9] text-[#6c757d] rounded-[6px] hover:border-[#4096ff] focus:border-[#4096ff] placeholder:text-placeholderTextColor">
                        <div className="flex flex-row items-center justify-around w-full">
                            <div className="ml-4">{selectedShiftId}</div>
                            <div className={`w-4 h-4 flex justify-center items-center ${shiftIdMenu ? "rotate-180" : ""}`}>
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="svg-inline--fa fa-caret-down fa-rotate-180 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ color: "rgb(220, 220, 220)" }}><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
                            </div>
                        </div>
                    </div>

                    {shiftIdMenu && (<div className="text-black bg-placeholderTextColor border border-solid border-placeholderTextColor border-t-black w-full overflow-y-scroll h-[300px]">
                        {shiftListConst.map(({ index, code }) => {
                            return <div onClick={() => handleChangeSelectedShiftIdMenu(code)} className="w-full text-center hover:underline mt-3">{code}</div>
                        })}
                    </div>)}
                </div>
                <div
                    onClick={handleSeacrh}
                    className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700 w-1/6">
                    <button className="search-btn">Suchen</button>
                </div>
            </div>

            {/* //---------------------------------------------------------------- CREATE SHIFT ------------------------------------------------------------------------------------// */}

            {createShiftFormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setCreateShiftFormState(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="font-bold text-xl">Schicht erstellen</div>
                                <div
                                    onClick={() => setCreateShiftFormState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full justify-center items-center">
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center z-10">
                                        <div className="loader_search"></div>
                                    </div>)}
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Schichtcode</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            required
                                            className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
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
                                            className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Startzeit</span>
                                        </div>
                                        {/* <input
                                            type="text"
                                            id="start_time"
                                            name="start_time"
                                            value={formData.start_time}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 20:00"
                                            required
                                        /> */}
                                        <TimePicker onChange={handleTimeStartCreateShift} className="w-full h-[42px]" format={format} />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Endzeit</span>
                                        </div>
                                        {/* <input
                                            type="text"
                                            id="end_time"
                                            name="end_time"
                                            value={formData.end_time}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 22:00"
                                            required
                                        /> */}
                                        <TimePicker onChange={handleTimeEndCreateShift} className="w-full h-[42px]" format={format} />
                                    </div>
                                    <button className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-800 w-full" type="submit" onClick={handleSubmit}>
                                        Schicht erstellen
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}

            {deleteShiftFormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setDeleteShiftFormState(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="font-bold text-xl">Schicht löschen</div>
                                <div
                                    onClick={() => setDeleteShiftFormState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7">
                                <form onSubmit={handleDeleteShiftSubmit} className="flex flex-col gap-6 w-full justify-center items-center">
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center z-10">
                                        <div className="loader_search"></div>
                                    </div>)}
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Schichtcode</span>
                                        </div>
                                        <select
                                            id="shift_code"
                                            name="shift_code"
                                            className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                            value={selectedShiftDelete}
                                            onChange={(e) => setSelectedShiftDelete(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Schichtcode auswählen*</option>
                                            {shiftList?.map(({ code }, index) => (
                                                <option className='text-sm text-textColor w-full' key={index} value={code}>
                                                    {code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className=" bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-red-900 w-full" type="submit" onClick={handleDeleteShiftSubmit}>
                                        Schicht löschen
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}

            {editShiftFormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setEditShiftFormState(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="font-bold text-xl">Schicht bearbeiten</div>
                                <div
                                    onClick={() => setEditShiftFormState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7">
                                <form onSubmit={handleEditShiftSubmit} className="flex flex-col gap-6 w-full justify-center items-center">
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center z-10">
                                        <div className="loader_search"></div>
                                    </div>)}
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Schichtcode</span>
                                        </div>
                                        <select
                                            id="shift_code_edit"
                                            name="shift_code_edit"
                                            // className="w-full cursor-pointer"
                                            value={selectedShiftEdit}
                                            onChange={(e) => setSelectedShiftEdit(e.target.value)}
                                            required
                                            className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                        >
                                            <option value="" disabled className='italic text-sm'>Schichtcode auswählen*</option>
                                            {shiftList?.map(({ code }, index) => (
                                                <option className='text-sm text-textColor w-full' key={index} value={code}>
                                                    {code}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Shift's Name</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="name_edit"
                                            name="name_edit"
                                            value={formEdit.name_edit}
                                            onChange={handleEditInputChange}
                                            className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                        // required
                                        />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Startzeit</span>
                                        </div>
                                        <TimePicker onChange={handleTimeStartEditShift} className="w-full h-[42px]" format={format} />
                                    </div>
                                    <div className="w-full h-auto flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Endzeit</span>
                                        </div>
                                        <TimePicker onChange={handleTimeEndEditShift} className="w-full h-[42px]" format={format} />
                                    </div>
                                    <button className=" bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-cyan-700 w-full" type="submit" onClick={handleEditShiftSubmit}>
                                        Schicht bearbeiten
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
                {loading && (<div className="flex w-full h-full items-center justify-center mt-10">
                    <div className="loader_search"></div>
                </div>)}
            </div>)}
        </div>
    )
}

export default WorkingSchedule