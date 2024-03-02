import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DatePicker, Space } from 'antd';
import axios from "axios";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import DeleteIcon from "../../assets/images/icon-delete.png"
import "./Car.css"
import CarItem from "./CarItem";

dayjs.extend(customParseFormat);
const dateFormat = 'MM/DD/YYYY';

const Car = () => {
    const [carList, setCarList] = useState()
    const [loading, setLoading] = useState(false);
    const [exportState, setExportState] = useState(false)
    const [createCarFormState, setCreateCarFormState] = useState(false)
    const [deleteCarFormState, setDeleteCarFormState] = useState(false)
    const [departmentList, setDepartmentList] = useState()
    const [selectedCarEdit, setSelectedCarEdit] = useState("")
    const [formEdit, setFormEdit] = useState(false)
    const [selectedDepartmentCar, setSelectedDepartmentCar] = useState('');
    const [registerDate, setRegisterDate] = useState("")
    const [departmentInhaberOrManager, setDepartmentInhaberOrManager] = useState()
    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)
    const [selectedCarDelete, setSelectedCarDelete] = useState(false)
    const [filterCarById, setFilterCarById] = useState()
    const [registerDateOfCar, setRegisterDateOfCar] = useState("")
    const userString = localStorage.getItem('user');
    const userObject = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (userObject?.role === 'Admin' || userObject?.role === 'Inhaber') {
            setExportState(true)
        }
        if (userObject?.role == "Inhaber") {
            const arrayFilter = userObject?.department?.map((item => item.name))
            setDepartmentInhaberOrManager(arrayFilter)
            console.log("arrayFilter", departmentInhaberOrManager);
        }
    }, [userObject?.role])

    const getAllCars = async () => {
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-car/get', { withCredentials: true });
                // console.log(response.data.message);
                setCarList(response?.data?.message);
            } catch (err) {
                alert(err.response?.data?.message)
            }
        }
        if (userObject?.role === "Inhaber") {
            try {
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-car/get?inhaber_name=${userObject?.name}`, { withCredentials: true });
                // console.log(response.data.message);
                setCarList(response?.data?.message);
            } catch (err) {
                alert(err.response?.data?.message)
            }
        }
    };


    const getAllDepartments = async () => {
        if (userObject?.role === "Admin") {
            try {
                const response = await axios.get('https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-department/get-all', { withCredentials: true });
                setDepartmentList(response.data);
            } catch (err) {
                alert(err.response?.data?.message)
            }
        }
    };

    useEffect(() => {
        getAllCars();
        getAllDepartments();
    }, []);

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

    const getCarById = async () => {

        if (userObject?.role === "Admin" && selectedCarEdit !== "") {
            setRegisterDateOfCar("")
            try {
                const response = await axios.get(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-car/get-by-id/${selectedCarEdit}`, { withCredentials: true })
                console.log(response.data.message);
                setFilterCarById(response.data.message)
            } catch (err) {
                alert(err.response);
            }
        }
    }

    useEffect(() => {
        getCarById()
    }, [selectedCarEdit])

    useEffect(() => {
        if (filterCarById) {
            const year = new Date(filterCarById.register_date).getFullYear();
            const month = String(new Date(filterCarById.register_date).getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const day = String(new Date(filterCarById.register_date).getDate()).padStart(2, '0');

            const formattedDateOfCarString = `${month}/${day}/${year}`;
            setRegisterDateOfCar(formattedDateOfCarString);
            console.log(formattedDateOfCarString);
        }
    }, [filterCarById]);

    const [editingCarData, setEditingCarData] = useState({
        car_name: '',
        car_number: '',
    })

    useEffect(() => {
        // Update editingData whenever user changes
        if (filterCarById) {
            setEditingCarData({
                car_name: filterCarById.car_name || '',
                car_number: filterCarById.car_number || '',
            });
        }
    }, [filterCarById]);

    const handleChangeEditCar = (e) => {
        const { name, value } = e.target;
        setEditingCarData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleSubmitEditCar = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (userObject?.role === "Admin") {
            try {
                const { data } = await axios.put(`https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-car/update-by-id/${selectedCarEdit}`, {
                    car_name: editingCarData.car_name,
                    car_number: editingCarData.car_number,
                    register_date: registerDateOfCar
                }, {
                    withCredentials: true,
                })
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false)
                setFormEdit(false)
                getAllCars()
            }
        }
    }

    const [formData, setFormData] = useState({
        car: {
            car_name: '',
            car_number: '',
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            car: {
                ...prevData.car,
                [name]: value,
            },
        }));
    };

    const handleRegisterDate = (date, dateString) => {
        console.log('Selected Date:', dateString);
        setRegisterDate(dateString)
    };

    const handleRegisterDateEdit = (date, dateString) => {
        console.log('Selected Date Edit:', dateString);
        setRegisterDateOfCar(dateString)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        // ----------------------------------------------------------------CREATE BY ADMIN ---------------------------------------------------------------- //

        //CREATE CAR BY ADMIN
        if (userObject?.role === 'Admin') {
            try {
                const { data } = await axios.post(
                    "https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-car/create",
                    {
                        car_name: formData.car.car_name,
                        car_number: formData.car.car_number,
                        register_date: registerDate,
                        department_name: selectedDepartmentCar
                    },
                    { withCredentials: true }
                );

                getAllCars()
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setCreateCarFormState(false)
                setFormData({
                    car: {
                        car_name: '',
                        car_number: '',
                    },
                })
                setRegisterDate("")
                setSelectedDepartmentCar("")

            }
        }
        if (userObject?.role === 'Inhaber') {
            try {
                const { data } = await axios.post(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-car/create?inhaber_name=${userObject?.name}`,
                    {
                        car_name: formData.car.car_name,
                        car_number: formData.car.car_number,
                        register_date: registerDate,
                        department_name: selectedDepartmentCar
                    },
                    { withCredentials: true }
                );

                getAllCars()
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setCreateCarFormState(false)
                setFormData({
                    car: {
                        car_name: '',
                        car_number: '',
                    },
                })
                setRegisterDate("")
                setSelectedDepartmentCar("")

            }
        }
    }

    const handleDeleteCarSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        // ----------------------------------------------------------------CREATE BY ADMIN ---------------------------------------------------------------- //

        //CREATE CAR BY ADMIN
        if (userObject?.role === 'Admin') {
            try {
                const { data } = await axios.post(
                    "https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/admin/manage-car/create",
                    {
                        car_name: formData.car.car_name,
                        car_number: formData.car.car_number,
                        register_date: registerDate,
                        department_name: selectedDepartmentCar
                    },
                    { withCredentials: true }
                );

                getAllCars()
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setCreateCarFormState(false)
                setFormData({
                    car: {
                        car_name: '',
                        car_number: '',
                    },
                })
                setRegisterDate("")
                setSelectedDepartmentCar("")

            }
        }
        if (userObject?.role === 'Inhaber') {
            try {
                const { data } = await axios.post(
                    `https://qrcodecheckin-d350fcfb1cb9.herokuapp.com/api/inhaber/manage-car/create?inhaber_name=${userObject?.name}`,
                    {
                        car_name: formData.car.car_name,
                        car_number: formData.car.car_number,
                        register_date: registerDate,
                        department_name: selectedDepartmentCar
                    },
                    { withCredentials: true }
                );

                getAllCars()
            } catch (err) {
                alert(err.response?.data?.message)
            } finally {
                setLoading(false);
                setCreateCarFormState(false)
                setFormData({
                    car: {
                        car_name: '',
                        car_number: '',
                    },
                })
                setRegisterDate("")
                setSelectedDepartmentCar("")

            }
        }
    }

    return (
        <div>
            {exportState ? (
                <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5">
                    <div className="flex flex-row items-center justify-between">
                        <div>
                            <h1 className="font-bold text-3xl">Car Management</h1>
                            <div className="flex flex-row">
                                <Link className="text-xl font-semibold leading-6 hover:underline" to="/dashboard">Dashboard</Link>
                                <span className="text-[#6c757d] font-xl">/ Car Management</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {exportState && (<div className="flex flex-row px-4 gap-4">
                                <button onClick={() => setCreateCarFormState(!createCarFormState)} className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-emerald-800">
                                    <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                                    Create Car
                                </button>
                            </div>)}
                            {exportState && (<div className="flex flex-row px-4 gap-4">
                                <button onClick={() => setDeleteCarFormState(!deleteCarFormState)} className="bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-red-800">
                                    <img className="w-4 h-4" src={DeleteIcon} />
                                    Delete Car
                                </button>
                            </div>)}
                        </div>
                    </div>
                    <div className="text-xl font-semibold leading-6">Car Management</div>
                    <div className="flex flex-row gap-4 text-xl">
                        <div
                            className="cursor-pointer text-buttonColor1 underline decoration-buttonColor1">Car Management</div>
                    </div>

                    {/* //---------------------------------------------------------------- CREATE CAR ------------------------------------------------------------------------------------// */}
                    {createCarFormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                        <div
                            onClick={() => setCreateCarFormState(false)}
                            className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                        <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white overflow-y-aut">
                            <div className="w-full h-full">
                                <div className="flex flex-col mt-8">
                                    <div className="flex flex-row justify-between px-8 items-center">
                                        <div className="font-bold text-xl">Create Car</div>
                                        <div
                                            onClick={() => setCreateCarFormState(false)}
                                            className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                    </div>
                                    <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                    <div className="flex flex-col px-8 w-full mt-7o">
                                        <form
                                            className="flex flex-col gap-6 w-full justify-center items-center"
                                            onSubmit={handleSubmit}>
                                            {loading && (<div className="absolute flex w-full h-full items-center justify-center z-10">
                                                <div className="loader"></div>
                                            </div>)}
                                            <div className="w-full h-auto flex flex-col gap-2 mt-4">
                                                <div className="flex flex-row gap-2">
                                                    <span className="text-rose-500">*</span>
                                                    <span className="">Car Name</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="car_name"
                                                    className="border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] w-full text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                                                    required
                                                    value={formData.car.car_name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="w-full h-auto flex flex-col gap-2">
                                                <div className="flex flex-row gap-2">
                                                    <span className="text-rose-500">*</span>
                                                    <span className="">Car Number</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="car_number"
                                                    className="border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] w-full text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                                                    required
                                                    value={formData.car.car_number}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="w-full h-auto flex flex-col gap-2">
                                                <div className="flex flex-row gap-2">
                                                    <span className="text-rose-500">*</span>
                                                    <span className="">Register Date</span>
                                                </div>
                                                <Space className="w-full" direction="vertical" size={12}>
                                                    <DatePicker onChange={handleRegisterDate} className="w-full h-[45px] text-base text-placeholderTextColor" format={dateFormat} />
                                                </Space>
                                            </div>
                                            {checkAdmin && (<div className="w-full flex flex-col gap-2">
                                                <div className="flex flex-row gap-2">
                                                    <span className="text-rose-500">*</span>
                                                    <span className="">Department</span>
                                                </div>
                                                <div className="w-full flex flex-row gap-8 justify-between">
                                                    <div className="flex flex-col gap-2">
                                                        {departmentList?.slice(0, Math.ceil(departmentList.length / 2)).map((item, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`department${index}`}
                                                                    name={`department${index}`}
                                                                    value={item.name}
                                                                    checked={selectedDepartmentCar.includes(item.name)}
                                                                    onChange={(e) => {
                                                                        const isChecked = e.target.checked;
                                                                        setSelectedDepartmentCar((prevDepartments) =>
                                                                            isChecked
                                                                                ? [...prevDepartments, item.name]
                                                                                : prevDepartments.filter((dept) => dept !== item.name)
                                                                        );
                                                                    }}
                                                                />
                                                                <label htmlFor={`department_${index}`} className="text-sm text-textColor">
                                                                    {item.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {departmentList?.slice(Math.ceil(departmentList.length / 2)).map((item, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`department${index}`}
                                                                    name={`department${index}`}
                                                                    value={item.name}
                                                                    checked={selectedDepartmentCar.includes(item.name)}
                                                                    onChange={(e) => {
                                                                        const isChecked = e.target.checked;
                                                                        setSelectedDepartmentCar((prevDepartments) =>
                                                                            isChecked
                                                                                ? [...prevDepartments, item.name]
                                                                                : prevDepartments.filter((dept) => dept !== item.name)
                                                                        );
                                                                    }}
                                                                />
                                                                <label htmlFor={`department_${index}`} className="text-sm text-textColor">
                                                                    {item.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>)}
                                            {checkInhaber && (<div className="w-full flex flex-col gap-2">
                                                <div className="flex flex-row gap-2">
                                                    <span className="text-rose-500">*</span>
                                                    <span className="">Department</span>
                                                </div>
                                                <div className="w-full flex flex-row gap-8 justify-between">
                                                    <div className="flex flex-col gap-2">
                                                        {departmentInhaberOrManager?.slice(0, Math.ceil(departmentInhaberOrManager?.length / 2)).map((item, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`department${index}`}
                                                                    name={`department${index}`}
                                                                    value={item}
                                                                    checked={selectedDepartmentCar.includes(item)}
                                                                    onChange={(e) => {
                                                                        const isChecked = e.target.checked;
                                                                        setSelectedDepartmentCar((prevDepartments) =>
                                                                            isChecked
                                                                                ? [...prevDepartments, item]
                                                                                : prevDepartments.filter((dept) => dept !== item)
                                                                        );
                                                                    }}
                                                                />
                                                                <label htmlFor={`department_${index}`} className="text-sm text-textColor">
                                                                    {item}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {departmentInhaberOrManager?.slice(Math.ceil(departmentInhaberOrManager?.length / 2)).map((item, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`department${index}`}
                                                                    name={`department${index}`}
                                                                    value={item}
                                                                    checked={selectedDepartmentCar.includes(item)}
                                                                    onChange={(e) => {
                                                                        const isChecked = e.target.checked;
                                                                        setSelectedDepartmentCar((prevDepartments) =>
                                                                            isChecked
                                                                                ? [...prevDepartments, item]
                                                                                : prevDepartments.filter((dept) => dept !== item)
                                                                        );
                                                                    }}
                                                                />
                                                                <label htmlFor={`department_${index}`} className="text-sm text-textColor">
                                                                    {item}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>)}
                                            <div
                                                className=" bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-emerald-700 w-full">
                                                <button type="submit" className="w-full">Add</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}

                    {formEdit && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                        <div
                            onClick={() => setFormEdit(false)}
                            className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                        <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white overflow-y-aut">
                            <div className="w-full h-full">
                                <div className="flex flex-col mt-8">
                                    <div className="flex flex-row justify-between px-8 items-center">
                                        <div className="font-bold text-xl">Create Car</div>
                                        <div
                                            onClick={() => setFormEdit(false)}
                                            className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                    </div>
                                    <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                    <div className="flex flex-col px-8 w-full mt-7o">
                                        <form
                                            className="flex flex-col gap-6 w-full justify-center items-center"
                                            onSubmit={handleSubmitEditCar}>
                                            {loading && (<div className="absolute flex w-full h-full items-center justify-center z-10">
                                                <div className="loader"></div>
                                            </div>)}
                                            <div className="w-full h-auto flex flex-col gap-2 mt-4">
                                                <div className="flex flex-row gap-2">
                                                    <span className="text-rose-500">*</span>
                                                    <span className="">Car Name</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="car_name"
                                                    className="border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] w-full text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                                                    required
                                                    value={editingCarData.car_name}
                                                    onChange={handleChangeEditCar}
                                                />
                                            </div>
                                            <div className="w-full h-auto flex flex-col gap-2">
                                                <div className="flex flex-row gap-2">
                                                    <span className="text-rose-500">*</span>
                                                    <span className="">Car Number</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="car_number"
                                                    className="border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] w-full text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                                                    required
                                                    value={editingCarData.car_number}
                                                    onChange={handleChangeEditCar}
                                                />
                                            </div>
                                            <div className="w-full h-auto flex flex-col gap-2">
                                                <div className="flex flex-row gap-2">
                                                    <span className="text-rose-500">*</span>
                                                    <span className="">Register Date</span>
                                                </div>
                                                {registerDateOfCar !== "" && (<Space className="w-full" direction="vertical" size={12}>
                                                    <DatePicker defaultValue={dayjs(registerDateOfCar)} onChange={handleRegisterDateEdit} className="w-full h-[45px] text-base text-placeholderTextColor" format={dateFormat} />
                                                </Space>)}
                                            </div>
                                            <div
                                                className=" bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-cyan-800 w-full">
                                                <button type="submit" className="w-full">Edit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}

                    {deleteCarFormState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                        <div
                            onClick={() => setDeleteCarFormState(false)}
                            className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                        <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white">
                            <div className="w-full h-full">
                                <div className="flex flex-col mt-8">
                                    <div className="flex flex-row justify-between px-8 items-center">
                                        <div className="font-bold text-xl">Delete Car</div>
                                        <div
                                            onClick={() => setDeleteCarFormState(false)}
                                            className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                    </div>
                                    <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                    <div className="flex flex-col px-8 w-full mt-7">
                                        <form onSubmit={handleDeleteCarSubmit} className="flex flex-col gap-6 w-full justify-center items-center">
                                            {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                                <div className="loader"></div>
                                            </div>)}
                                            <div className="w-full flex flex-col gap-2">
                                                <div className="flex flex-row gap-2">
                                                    <span className="text-rose-500">*</span>
                                                    <span className="">Car</span>
                                                </div>
                                                <select
                                                    id="shift_code"
                                                    name="shift_code"
                                                    className="rounded-[6px] border-[#d9d9d9] hover:border-[#4096ff] focus:border-[#4096ff]"
                                                    value={selectedCarDelete}
                                                    onChange={(e) => setSelectedCarDelete(e.target.value)}
                                                    required
                                                >
                                                    <option value="" disabled className='italic text-sm'>Select Car*</option>
                                                    {carList?.map((item, index) => (
                                                        <option className='text-sm text-textColor w-full' key={index} value={item.car_name}>
                                                            {item.car_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button className=" bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid py-3 rounded-md cursor-pointer hover:bg-red-900 w-full" type="submit" onClick={handleDeleteCarSubmit}>
                                                Delete Car
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}



                    {/* //----------------------------------------------------------------CAR MANAGEMENT------------------------------------------------------------------------------------// */}

                    <div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
                        <table className="w-full table">
                            <thead className="">
                                <tr className="">
                                    <th className="p-4 text-left">
                                        <span className="font-bold">Car Name</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-id">Car Number</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">Register Date</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">Department</span>
                                    </th>
                                    <th className="p-4 text-left">
                                        <span className="table-title-role">Action</span>
                                    </th>
                                </tr>
                            </thead>
                            {Array.isArray(carList) && carList?.length === 0 ? (
                                <div className="no-result-text">NO RESULT</div>
                            ) : (
                                <tbody className="tbody">
                                    {carList?.map(({ _id, car_name, car_number, register_date, department_name, formEdit }) => (
                                        <CarItem
                                            key={_id}
                                            car_name={car_name}
                                            car_number={car_number}
                                            register_date={register_date}
                                            department_name={department_name}
                                            setSelectedCarEdit={setSelectedCarEdit}
                                            setFormEdit={setFormEdit}
                                            id={_id}
                                            formEdit={formEdit}
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

export default Car