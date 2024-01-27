import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import DeleteIcon from "../../assets/images/icon-delete.png"
import ProfileIcon from "../../assets/images/icon-profile.png"
import IconActive from "../../assets/images/icon-active.png"
import { positionList } from "assets/data/data"
import { roleList, roleListForInhaber } from "assets/data/data"
import { genderList } from "assets/data/data"
import ScheduleTable from "./ScheduleTable"
import { statusList } from "assets/data/data"
import { useNavigate } from "react-router-dom"
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Space } from 'antd';
dayjs.extend(customParseFormat);

const dateFormat = 'MM/DD/YYYY';
const format = 'HH:mm';

const ProfileEmployee = () => {
    const { id, name } = useParams();
    // console.log("Name:"+name+"fsdfd");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileState, setProfileState] = useState(true);
    const [scheduleState, setScheduleState] = useState(false);
    const [departmentList, setDepartmentList] = useState()
    const [checkRole, setCheckRole] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState(null)
    const [formAddDepartmentState, setFormAddDepartmentState] = useState(false)
    const [selectedPositionEmployee, setSelectedPositionEmployee] = useState('');
    const [selectedDepartmentEmployee, setSelectedDepartmentEmployee] = useState('');
    const [departmentDefined, setDepartmentDefined] = useState()
    const [restDepartmentList, setRestDepartmentList] = useState()
    const [deleteFormState, setDeleteFormState] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState("active")
    const [changeStatus, setChangeStatus] = useState(false)
    const [inputDateInactive, setInputDateInactive] = useState('')
    const [exportState, setExportState] = useState(false)
    const navigate = useNavigate()
    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;
    const [inactive, setInactive] = useState()

    // const [userObject, setUserObject] = useState()

    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkManager, setCheckManager] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)

    const [timeInactive, setTimeInactive] = useState("")
    const [dateInactive, setDateInactive] = useState("")

    const handleTimeInactive = (time) => {
        setTimeInactive(time.format('HH:mm'))
    }
    const handleDateChange = (date, dateString) => {
        console.log('Selected Date:', dateString);
        setDateInactive(dateString)
    };

    useEffect(() => {
        if (userObject?.role === 'Admin' || userObject?.role === 'Inhaber') {
            setExportState(true)
        }
    }, [userObject?.role])
    const handleShiftClick = (department) => {
        setSelectedDepartment(department);
    };

    const handleAddDepartmentForEmployee = async () => {
        if (userObject?.role === "Admin") {
            setLoading(true);
            try {
                const { data } = await axios.put(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-department/add-member/${selectedDepartmentEmployee}`,
                    {
                        employeeID: id,
                        employeeName: name,
                        position: selectedPositionEmployee,
                    },
                    { withCredentials: true },
                );


            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                getUser();
                setFormAddDepartmentState(false)
                setSelectedDepartmentEmployee('')
            }
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        }

    }
    const getUser = async () => {
        if (userObject?.role === 'Admin') {
            try {
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-employee/get-byId?employeeID=${id}&employeeName=${name}`, { withCredentials: true });
                console.log(response.data.message);
                setUser(response.data.message);
                // setDepartmentDefined(response.data.message[0]?.department)
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
            }
        }
        if (userObject?.role === 'Inhaber') {
            try {
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-employee/get-byId?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, { withCredentials: true });
                console.log(response.data.message);
                setUser(response.data.message);
                // setDepartmentDefined(response.data.message[0]?.department)
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
            }
        }

        if (userObject?.role === 'Manager') {
            try {
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/manager/manage-employee/get-byId?manager_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`, { withCredentials: true });
                console.log(response.data.message);
                setUser(response.data.message);
                // setDepartmentDefined(response.data.message[0]?.department)
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
            }
        }
    };
    // useEffect(() => {
    //     setUserObject(userObject)
    //     console.log(userObject);
    // }, [])

    useEffect(() => {
        setLoading(true);
        getUser();
    }, [id]);

    useEffect(() => {
        if (user && userObject?.role === "Admin") {
            const departmentDefined = user[0]?.department?.map((item) => item.name);
            setDepartmentDefined(departmentDefined);

            const restDepartmentList = departmentList
                ?.map((item) => item.name)
                ?.filter((item) => !departmentDefined?.includes(item));
            setRestDepartmentList(restDepartmentList);
        }
    }, [user, departmentList, userObject?.role]);

    // console.log("Department", restDepartmentList);

    useEffect(() => {
        setLoading(true);
        const getAllDepartments = async () => {
            if (userObject?.role === "Admin") {
                try {
                    const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-department/get-all', { withCredentials: true });
                    setDepartmentList(response.data);
                } catch (err) {
                    alert(err.response?.data?.message)
                }
            }
        }
        getAllDepartments()
    }, []);

    useEffect(() => {
        // if (user && user[0]?.role !== "Employee") {
        //     setCheckRole(false)
        // }

        // if (user && user[0]?.role === "Employee") {
        //     setCheckRole(true)
        // }

        if (userObject?.role === 'Admin') {
            setCheckAdmin(true)
            setCheckInhaber(false)
            setCheckManager(false)
        }

        if (userObject?.role === 'Inhaber') {
            setCheckAdmin(false)
            setCheckInhaber(true)
            setCheckManager(false)
        }
    }, [user, userObject?.role]);


    const [editingData, setEditingData] = useState({
        name: '',
        id: '',
        email: '',
        department: '',
        role: '',
        position: '',
        status: '',
        gender: '',
        dob: '',
        address: '',
        default_day_off: '',
        house_rent_money: '',
        realistic_day_off: '',
        total_time_per_month: '',
    });

    const handleCancel = () => {
        if (user) {
            setEditingData({
                name: user[0]?.name || '',
                id: user[0]?.id || '',
                email: user[0]?.email || '',
                department: user[0]?.department_name || '',
                position: user[0]?.position || '',
                status: user[0]?.status || '',
                gender: user[0]?.gender || '',
                dob: user[0]?.dob || '',
                address: user[0]?.address || '',
                role: user[0]?.role || '',
                default_day_off: user[0]?.default_day_off || '',
                house_rent_money: user[0]?.house_rent_money || '',
                realistic_day_off: user[0]?.realistic_day_off || '',
                total_time_per_month: user[0]?.total_time_per_month || '',
                // inactive_day: user[0]?.inactive_day || '',
            });
        }
    };
    useEffect(() => {
        // Update editingData whenever user changes
        if (user) {
            setEditingData({
                name: user[0]?.name || '',
                id: user[0]?.id || '',
                email: user[0]?.email || '',
                department: user[0]?.department_name || '',
                position: user[0]?.position || '',
                role: user[0]?.role || '',
                status: user[0]?.status || '',
                gender: user[0]?.gender || '',
                dob: user[0]?.dob || '',
                address: user[0]?.address || '',
                default_day_off: user[0]?.default_day_off || '',
                house_rent_money: user[0]?.house_rent_money || '',
                realistic_day_off: user[0]?.realistic_day_off || '',
                inactive_day: user[0]?.inactive_day || '',
                total_time_per_month: user[0]?.total_time_per_month || '',
            });
        }
        if (user) {
            const inputDateString = user[0]?.inactive_day;
            const inputDate = new Date(inputDateString);

            // Get the date components
            const year = inputDate.getFullYear();
            const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const day = String(inputDate.getDate()).padStart(2, '0');
            const hours = String(inputDate.getHours()).padStart(2, '0');
            const minutes = String(inputDate.getMinutes()).padStart(2, '0');
            const seconds = String(inputDate.getSeconds()).padStart(2, '0');
            const timezoneOffset = inputDate.getTimezoneOffset();
            const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
            const timezoneOffsetMinutes = Math.abs(timezoneOffset) % 60;
            const timezoneOffsetString = `${timezoneOffset < 0 ? '+' : '-'}${String(timezoneOffsetHours).padStart(2, '0')}:${String(timezoneOffsetMinutes).padStart(2, '0')}`;

            // Create the formatted date string
            const formattedDateString = `${year}-${month}-${day}`;
            setInactive(formattedDateString)
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (userObject?.role === "Admin") {
            try {
                const { data } = await axios.put(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-employee/update-basic?employeeID=${id}&employeeName=${name}`,
                    {
                        id: editingData.id,
                        name: editingData.name,
                        email: editingData.email,
                        department_name: editingData.department,
                        role: editingData.role,
                        position: editingData.position,
                        status: editingData.status,
                        dob: editingData.dob,
                        address: editingData.address,
                        gender: editingData.gender,
                        default_day_off: Number(editingData.default_day_off),
                        house_rent_money: editingData.house_rent_money,
                        realistic_day_off: Number(editingData.realistic_day_off),
                        total_time_per_month: Number(editingData.total_time_per_month),
                        // inactive_day: editingData.inactive_day,
                    },
                    { withCredentials: true },
                );


            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                getUser()
            }
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        }

        if (userObject?.role === "Inhaber") {
            try {
                const { data } = await axios.put(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-employee/update?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`,
                    {
                        id: editingData.id,
                        name: editingData.name,
                        email: editingData.email,
                        role: editingData.role,
                        status: editingData.status,
                        dob: editingData.dob,
                        address: editingData.address,
                        gender: editingData.gender,
                        default_day_off: Number(editingData.default_day_off),
                        house_rent_money: editingData.house_rent_money,
                        realistic_day_off: Number(editingData.realistic_day_off),
                        total_time_per_month: Number(editingData.total_time_per_month)
                    },
                    { withCredentials: true },
                );


            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                getUser()
            }
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        }

    };
    const handleDelete = async () => {
        setLoading(true);

        if (userObject?.role === "Admin") {
            try {
                const { data } = await axios.delete(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-employee/delete-byId?employeeID=${id}&employeeName=${name}`,
                    { withCredentials: true },
                );


            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                navigate("/employee")
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const { data } = await axios.delete(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-employee/delete-byId?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`,
                    { withCredentials: true },
                );


            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                navigate("/employee")
            }
        }
    }
    const handleChangeStatus = async () => {
        setLoading(true);

        if (userObject?.role === "Admin") {
            try {
                const { data } = await axios.post(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-employee/make-inactive?employeeID=${id}&employeeName=${name}`,
                    {

                        inactive_day: `${dateInactive} ${timeInactive}`,
                    },
                    { withCredentials: true },
                );


            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setChangeStatus(false);
                setTimeInactive("")
                setDateInactive("")

            }
        }

        if (userObject?.role === "Inhaber") {
            try {
                const { data } = await axios.post(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-employee/make-inactive?inhaber_name=${userObject?.name}&employeeID=${id}&employeeName=${name}`,
                    {

                        inactive_day: `${dateInactive} ${timeInactive}`,
                    },
                    { withCredentials: true },
                );


            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setChangeStatus(false);
                setTimeInactive("")
                setDateInactive("")

            }
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        }
    }
    return (
        <div className="ml-[260px] flex flex-col font-Changa text-textColor">
            {loading && (<div className="absolute flex w-full h-full justify-center mt-52">
                <div className="loader"></div>
            </div>)}
            <div className="p-5 flex flex-row items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl">Employee's Information</h1>
                    <div className="flex flex-row">
                        <Link className="text-xl font-semibold leading-6 hover:underline" to="/">Dashboard</Link>
                        <Link to="/employee" className="text-[#6c757d] font-xl hover:text-black">/ Employees</Link>
                        <span className="text-[#6c757d] font-xl hover:text-black">/ Employee's Information</span>
                    </div>
                </div>
                <div className="flex flex-row px-4 gap-4">
                    {checkAdmin && (<button onClick={() => setFormAddDepartmentState(!formAddDepartmentState)} className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-lime-800">
                        <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>Add Department
                    </button>)}
                    {exportState && (<button onClick={() => setChangeStatus(true)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                        Make Inactive
                    </button>)}
                    {exportState && (<button onClick={() => setDeleteFormState(true)} className="bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-red-800">
                        <img className="w-4 h-4" src={DeleteIcon} />Delete Employee
                    </button>)}
                </div>
            </div>
            <div className="border border-solid border-t-[#6c757d]"></div>
            <div className="bg-white h-auto w-full flex flex-col p-4 rounded-md">
                <div className="flex flex-row gap-4 text-xl">
                    <div
                        onClick={() => {
                            setScheduleState(false)
                            setProfileState(true)
                        }}
                        className={`hover:text-buttonColor1 cursor-pointer ${profileState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Basic Information</div>
                    <div
                        onClick={() => {
                            setScheduleState(true)
                            setProfileState(false)
                        }}
                        className={`hover:text-buttonColor1 cursor-pointer ${scheduleState ? "text-buttonColor1 underline decoration-buttonColor1" : ""}`}>Schedule's Calendar</div>
                </div>
            </div>
            {user?.map((index, item) =>
                <div className="bg-[#f0f2f5] w-full flex flex-row p-5 font-Changa text-textColor gap-4">
                    {profileState && (<div className="bg-white h-auto w-1/3 flex flex-col p-4 rounded-md">
                        <div className="flex flex-col justify-center items-center gap-1 mt-4">
                            <img src={ProfileIcon} className="w-32 h-32" />
                            <span className="mt-3 font-bold text-xl">{user[0]?.name}</span>
                            <span className="text-base">Employee's ID: {user[0]?.id}</span>
                            <div className="flex gap-2 justify-center items-center w-full h-full">
                                <img className="w-4 h-4" src={IconActive} />
                                <span className="text-buttonColor2">{user[0]?.status}</span>
                            </div>
                            <div className="w-full flex flex-col justify-center items-center gap-1 mt-3 text-base">
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Name</span>
                                    <span className="w-2/3 px-2">{user[0]?.name}</span>
                                </div>
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Gender</span>
                                    <span className="w-2/3 px-2">{user[0]?.gender}</span>
                                </div>
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Address</span>
                                    <span className="w-2/3 px-2">{user[0]?.address}</span>
                                </div>
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Date of Birth</span>
                                    <span className="w-2/3 px-2">{user[0]?.dob}</span>
                                </div>
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Email</span>
                                    <span className="w-2/3 px-2">{user[0]?.email}</span>
                                </div>
                                <div className="flex flex-wrap w-full items-center justify-center">
                                    <span className="text-[#6c757d] w-1/3 text-right px-3">Role</span>
                                    <span className="w-2/3 px-2">{user[0]?.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>)}
                    {profileState && (<div className="bg-white h-auto w-2/3 flex flex-col p-4 rounded-md">
                        <div className="flex flex-col gap-1 mt-4">
                            <div className="text-xl font-bold">Employee's Information</div>
                            <form
                                className="ml-20 mt-10 flex flex-col gap-4"
                                onSubmit={handleSubmit}>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-3/4"
                                        value={editingData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="id">Employee's ID:</label>
                                    <input
                                        type="text"
                                        id="id"
                                        name="id"
                                        className="w-3/4"
                                        value={editingData.id}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="department">Gender:</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        className="w-3/4"
                                        value={editingData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            {editingData.gender || 'Select Gender'}
                                        </option>
                                        {genderList?.map(({ index, name }) => (
                                            <option key={index} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="dob">Date of Birth:</label>
                                    <input
                                        type="text"
                                        id="dob"
                                        name="dob"
                                        className="w-3/4"
                                        value={editingData.dob}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-3/4"
                                        value={editingData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="address">Address:</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        className="w-3/4"
                                        value={editingData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="department">Role:</label>
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        className="w-3/4"
                                        value={editingData.role}
                                        readOnly
                                    // onChange={handleChange}
                                    />
                                </div>
                                {checkAdmin && <div className="flex flex-col w-[600px] items-center">
                                    <div className="flex flex-wrap w-[600px] items-center">
                                        <div className="flex flex-row"></div>
                                        <label className="w-1/4 text-right p-4">Department:</label>
                                        <div className="flex flex-row gap-4">
                                            {user[0]?.department?.map((item, index) => (
                                                <span className={`cursor-pointer ${selectedDepartment === item.name ? 'text-buttonColor1 underline decoration-buttonColor1' : ''
                                                    }`} onClick={() => handleShiftClick(item.name)} key={index}>{item.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {selectedDepartment && (<div className="flex flex-wrap w-[600px] items-center">
                                        <label className="w-1/4 text-right p-4">Position:</label>
                                        <div className="flex flex-row gap-4">
                                            {user[0]?.department?.filter((item) => item?.name === selectedDepartment)
                                                .map((filteredItem, index) => (<div key={index}>
                                                    {filteredItem?.position?.join(", ")}
                                                </div>))
                                            }
                                        </div>
                                    </div>)}
                                </div>}
                                {checkInhaber && <div className="flex flex-col w-[600px] items-center">
                                    <div className="flex flex-wrap w-[600px] items-center">
                                        <div className="flex flex-row"></div>
                                        <label className="w-1/4 text-right p-4">Department:</label>
                                        <div className="flex flex-row gap-4">
                                            {user[0]?.department
                                                // ?.filter((item) => item.name === userObject?.department_name)
                                                ?.map((item, index) => (
                                                    <span
                                                        className={`cursor-pointer ${selectedDepartment === item.name
                                                            ? 'text-buttonColor1 underline decoration-buttonColor1'
                                                            : ''
                                                            }`}
                                                        onClick={() => handleShiftClick(item.name)}
                                                        key={index}
                                                    >
                                                        {item.name}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                    {selectedDepartment && (<div className="flex flex-wrap w-[600px] items-center">
                                        <label className="w-1/4 text-right p-4">Position:</label>
                                        <div className="flex flex-row gap-4">
                                            {user[0]?.department?.filter((item) => item?.name === selectedDepartment)
                                                .map((filteredItem, index) => (<div key={index}>
                                                    {filteredItem?.position?.join(", ")}
                                                </div>))
                                            }
                                        </div>
                                    </div>)}
                                </div>}
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="total_time_per_month">Total Hour(per month):</label>
                                    <input
                                        type="text"
                                        id="total_time_per_month"
                                        name="total_time_per_month"
                                        className="w-3/4"
                                        value={editingData.total_time_per_month}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="phone">Days Off (per year):</label>
                                    <input
                                        type="text"
                                        id="default_day_off"
                                        name="default_day_off"
                                        className="w-3/4"
                                        value={editingData.default_day_off}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="phone">Rest Days Off:</label>
                                    <input
                                        type="text"
                                        id="realistic_day_off"
                                        name="realistic_day_off"
                                        className="w-3/4"
                                        value={editingData.realistic_day_off}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="phone">House renting money:</label>
                                    <input
                                        type="text"
                                        id="house_rent_money"
                                        name="house_rent_money"
                                        className="w-3/4"
                                        value={editingData.house_rent_money}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="department">Status:</label>
                                    <input
                                        type="text"
                                        id="status"
                                        name="status"
                                        className="w-3/4"
                                        value={editingData.status}
                                        readOnly
                                    // onChange={handleChange}
                                    />
                                </div>
                                {editingData.status === "inactive" && (<div className="flex flex-wrap w-[600px] items-center">
                                    <label className="w-1/4 text-right p-4" htmlFor="department">Inactive Day:</label>
                                    <input
                                        type="text"
                                        id="inactive_day"
                                        name="inactive_day"
                                        className="w-3/4"
                                        value={inactive}
                                        readOnly
                                    // onChange={handleChange}
                                    />
                                </div>)}
                                {exportState && (<div className="flex flex-row w-full justify-center gap-6">
                                    <button onClick={handleCancel} className="mt-10 w-1/3 bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                                        Cancel
                                    </button>
                                    <button type="submit" className="mt-10 w-1/3 bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                                        Save Changes
                                    </button>
                                </div>)}
                            </form>
                        </div>
                    </div>)
                    }
                    {scheduleState && <ScheduleTable
                        id={id}
                        name={editingData.name}
                        departmentDefined={departmentDefined}
                        role={editingData.role}
                        position={editingData.position}
                    />}
                </div >
            )}

            {/* //---------------------------------------------------------------- ADD NEW DEPARTMENT FOR EMPLOYEE ----------------------------------------------------------------// */}
            {formAddDepartmentState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa overflow-y-auto">
                <div
                    onClick={() => setFormAddDepartmentState(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="font-bold text-xl">Add Department</div>
                                <div
                                    onClick={() => setFormAddDepartmentState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7">
                                <div
                                    className="flex flex-col gap-6 w-full justify-center items-center"
                                >
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                        <div className="loader"></div>
                                    </div>)}
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Department</span>
                                        </div>
                                        <select
                                            id="department"
                                            name="department"
                                            className="w-full cursor-pointer"
                                            value={selectedDepartmentEmployee}
                                            onChange={(e) => setSelectedDepartmentEmployee(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className='italic text-sm'>Select Department*</option>
                                            {restDepartmentList?.map((item, index) => (
                                                <option className='text-sm text-textColor w-full' key={index} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Positions</span>
                                        </div>
                                        <div className="w-full flex flex-row gap-8 justify-between">
                                            <div className="flex flex-col gap-2">
                                                {positionList?.slice(0, Math.ceil(positionList.length / 2)).map((item, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`position_${index}`}
                                                            name={`position_${index}`}
                                                            value={item.name}
                                                            checked={selectedPositionEmployee.includes(item.name)}
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                setSelectedPositionEmployee((prevPositions) =>
                                                                    isChecked
                                                                        ? [...prevPositions, item.name]
                                                                        : prevPositions.filter((pos) => pos !== item.name)
                                                                );
                                                            }}
                                                        />
                                                        <label htmlFor={`position_${index}`} className="text-sm text-textColor">
                                                            {item.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {positionList?.slice(Math.ceil(positionList.length / 2)).map((item, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`position_${index}`}
                                                            name={`position_${index}`}
                                                            value={item.name}
                                                            checked={selectedPositionEmployee.includes(item.name)}
                                                            onChange={(e) => {
                                                                const isChecked = e.target.checked;
                                                                setSelectedPositionEmployee((prevPositions) =>
                                                                    isChecked
                                                                        ? [...prevPositions, item.name]
                                                                        : prevPositions.filter((pos) => pos !== item.name)
                                                                );
                                                            }}
                                                        />
                                                        <label htmlFor={`position_${index}`} className="text-sm text-textColor">
                                                            {item.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                        <button onClick={handleAddDepartmentForEmployee} type="button" className="w-full">Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
            {deleteFormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setDeleteFormState(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[400px] h-[200px] top-[300px] right-[500px] bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="font-bold text-xl">Delete User</div>
                                <div
                                    onClick={() => setDeleteFormState(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7 font-Changa justify-center items-center gap-4">
                                <span>Are you sure to to delete user {id}?</span>
                                <div className="flex flex-row gap-3">
                                    <button onClick={() => setDeleteFormState(false)} type="button" className="w-[100px] bg-rose-800 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointe">No</button>
                                    <button onClick={handleDelete} type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
            {changeStatus && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa overflow-y-auto">
                <div
                    onClick={() => setChangeStatus(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row justify-between px-8 items-center">
                                <div className="font-bold text-xl">Make Inactive</div>
                                <div
                                    onClick={() => setChangeStatus(false)}
                                    className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                            </div>
                            <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                            <div className="flex flex-col px-8 w-full mt-7 items-center justify-center">
                                <div className="flex flex-col gap-6 w-full">
                                    {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                        <div className="loader"></div>
                                    </div>)}
                                    <div className=" flex flex-row gap-3 items-center">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Day</span>
                                        </div>
                                        <Space className="w-full" direction="vertical" size={12}>
                                            <DatePicker onChange={handleDateChange} className="w-full h-[42px] text-base text-placeholderTextColor" format={dateFormat} />
                                        </Space>
                                    </div>
                                    <div className=" flex flex-row gap-2 items-center">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-rose-500">*</span>
                                            <span className="">Time</span>
                                        </div>
                                        <TimePicker
                                            className="w-full h-[42px]"
                                            onChange={handleTimeInactive}
                                            format={format}
                                        />
                                    </div>
                                    <div
                                        className=" bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-cyan-700 w-full">
                                        <button onClick={handleChangeStatus} type="button" className="w-full">Change Status</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </div >
    )
}

export default ProfileEmployee