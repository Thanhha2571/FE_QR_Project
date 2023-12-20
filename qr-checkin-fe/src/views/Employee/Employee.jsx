import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { positionList } from "assets/data/data";
import { roleList, roleListForInhaber } from "assets/data/data";
import EmployeeItem from "./EmployeeItem";
import "./Employee.css"
import axios, { all } from "axios";
// import { response, response } from "express";
function Employee() {
    document.title = "Employee";
    const [selectedPosition, setSelectedPosition] = useState("Select Position")
    const [selectedDepartment, setSelectedDepartment] = useState("Select Department")
    const [selectedRole, setSelectedRole] = useState("Select Role")

    const [positionMenu, setPositionMenu] = useState(false)
    const [departmentMenu, setDepartmentMenu] = useState(false)
    const [roleMenu, setRoleMenu] = useState(false)

    const [addEmployee, setAddEmployee] = useState(false)

    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState()
    const [userObject, setUserObject] = useState()

    const [departmentList, setDepartmentList] = useState()

    const [selectedDepartmentEmployee, setSelectedDepartmentEmployee] = useState('');
    const [selectedPositionEmployee, setSelectedPositionEmployee] = useState('');
    const [selectedRoleUser, setSelectedRoleUser] = useState('');
    const [inputSearch, setInputSearch] = useState("");

    const [positionFormMenuState, setPositionFormMenuState] = useState(false)

    const [checkRole, setCheckRole] = useState(false)
    const [checkInhaber, setCheckInhaber] = useState(false)
    const [checkManager, setCheckManager] = useState(false)
    const [checkAdmin, setCheckAdmin] = useState(false)

    const PAGE_SIZE = 20
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * PAGE_SIZE;
    const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
    const currentUsers = userList?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(userList?.length / PAGE_SIZE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const [formData, setFormData] = useState({
        user: {
            id: '',
            name: '',
            password: '',
            email: '',
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            user: {
                ...prevData.user,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        // ----------------------------------------------------------------CREATE BY ADMIN ---------------------------------------------------------------- //

        //CREATE EMPLOYEE BY ADMIN
        if (userObject.role === 'Admin' && selectedRoleUser === 'Employee') {
            try {
                const { data } = await axios.post(
                    "https://qr-code-checkin.vercel.app/api/auth/manage-admin/register-employee",
                    {
                        id: formData.user.id,
                        name: formData.user.name,
                        password: formData.user.password,
                        email: formData.user.email,
                        department_name: selectedDepartmentEmployee,
                        role: "Employee",
                        position: selectedPositionEmployee,
                    },
                    { withCredentials: true }
                );

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
        //CREATE EMPLOYEE BY INHABER
        if (userObject.role === 'Inhaber' && selectedRoleUser === 'Employee') {
            try {
                const { data } = await axios.post(
                    `https://qr-code-checkin.vercel.app/api/auth/manage-inhaber/register-employee?inhaber_name=${userObject?.name}`,
                    {
                        id: formData.user.id,
                        name: formData.user.name,
                        password: formData.user.password,
                        email: formData.user.email,
                        department_name: selectedDepartmentEmployee,
                        role: "Employee",
                        position: selectedPositionEmployee,
                    },
                    { withCredentials: true }
                );

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
        //CREATE INHABER BY ADMIN
        if (userObject.role === 'Admin' && selectedRoleUser === 'Inhaber') {
            try {
                const { data } = await axios.post(
                    "https://qr-code-checkin.vercel.app/api/auth/manage-admin/register-inhaber",
                    {
                        id: formData.user.id,
                        name: formData.user.name,
                        password: formData.user.password,
                        email: formData.user.email,
                        department_name: selectedDepartmentEmployee,
                        role: "Inhaber",
                        // position: selectedPositionEmployee,
                    },
                    { withCredentials: true }
                );

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
        //CREATE MANAGER BY ADMIN
        if (userObject.role === 'Admin' && selectedRole === 'Manager') {
            try {
                const { data } = await axios.post(
                    "https://qr-code-checkin.vercel.app/api/auth/manage-admin/register-manager",
                    {
                        id: formData.user.id,
                        name: formData.user.name,
                        password: formData.user.password,
                        email: formData.user.email,
                        department_name: selectedDepartmentEmployee,
                        role: "Manager",
                        // position: selectedPositionEmployee,
                    },
                    { withCredentials: true }
                );

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

    const handlePositionMenu = () => {
        setPositionMenu(!positionMenu)
        setDepartmentMenu(false)
        setRoleMenu(false)

    }

    const handleDepartmetnnMenu = () => {
        setDepartmentMenu(!departmentMenu)
        setPositionMenu(false)
        setRoleMenu(false)
    }

    const handleRoleMenu = () => {
        setRoleMenu(!roleMenu)
        setPositionMenu(false)
        setDepartmentMenu(false)
    }

    const handleChangeSelectedPosition = (item) => {
        setSelectedPosition(item)
    }

    const handleChangeSelectedDepartment = (item) => {
        setSelectedDepartment(item)
    }

    const handleChangeSelectedRole = (item) => {
        setSelectedRole(item)
    }

    const SeacrhTyoe = async (department, details, role) => {
        if (userObject.role === 'Admin') {
            try {
                const response = await axios.get(`https://qr-code-checkin.vercel.app/api/admin/manage-all/search-specific?department=${department}&details=${details}&role=${role}`, { withCredentials: true });
                // console.log(query);
                setUserList(response.data.message);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

    };

    const handleSeacrh = async () => {
        if (userObject?.role === 'Admin') {
            if (inputSearch !== "" && selectedDepartment === "Select Department" && selectedRole === "Select Role") {
                SeacrhTyoe("", inputSearch, "")
            }
            if (inputSearch === "" && selectedDepartment !== "Select Department" && selectedRole === "Select Role") {
                SeacrhTyoe(selectedDepartment, "", "")
            }
            if (inputSearch === "" && selectedDepartment === "Select Department" && selectedRole !== "Select Role") {
                SeacrhTyoe("", "", selectedRole)
            }
            if (inputSearch !== "" && selectedDepartment !== "Select Department" && selectedRole !== "Select Role") {
                SeacrhTyoe(selectedRole, selectedDepartment, inputSearch)
            }
            if (inputSearch === "" && selectedDepartment !== "Select Department" && selectedRole !== "Select Role") {
                SeacrhTyoe(selectedDepartment, "", selectedRole)
            }
            if (inputSearch === "" && selectedDepartment === "Select Department" && selectedRole === "Select Role") {
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            setTimeout(() => {
                setSelectedDepartment("Select Department")
                setSelectedRole("Select Role")
                setSelectedPosition("Select Position")
            }, 2000);
        }

        if (userObject.role === 'Inhaber') {
            try {
                const response = await axios.get(`https://qr-code-checkin.vercel.app/api/inhaber/manage-employee/get-specific?inhaber_name=${userObject.name}&query=${inputSearch}`, { withCredentials: true });
                // console.log(query);
                setUserList(response.data.message);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                if (userObject?.role === 'Admin') {
                    const response = await axios.get('https://qr-code-checkin.vercel.app/api/admin/manage-all/search-specific', { withCredentials: true });
                    setUserList(response.data.message);
                }
                if (userObject?.role === 'Inhaber') {
                    // console.log("sdfs");
                    const response = await axios.get(`https://qr-code-checkin.vercel.app/api/inhaber/manage-employee/get-all?inhaber_name=${userObject.name}`, { withCredentials: true }
                    );
                    setUserList(response.data.message);
                }
                if (userObject?.role === 'Manager') {
                    const response = await axios.get('https://qr-code-checkin.vercel.app/api/admin/manage-employee/get-all', {
                        manager_name: userObject.name
                    }, { withCredentials: true });
                    setUserList(response.data.message);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (selectedRoleUser === "Employee") {
            setPositionFormMenuState(true)
        }

        if (selectedRoleUser !== "Employee") {
            setPositionFormMenuState(false)

        }

        const getAllDepartments = async () => {
            try {
                const response = await axios.get('https://qr-code-checkin.vercel.app/api/admin/manage-department/get-all', { withCredentials: true });
                setDepartmentList(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getAllUsers();
        getAllDepartments()
    }, [selectedRoleUser, userObject?.role, userObject?.name]);

    useEffect(() => {
        const userString = localStorage.getItem('user');
        const userObject = userString ? JSON.parse(userString) : null;
        setUserObject(userObject)
        console.log(userObject);
    }, [])

    useEffect(() => {
        if (userObject?.role === 'Admin') {
            setCheckRole(true)
            setCheckAdmin(true)
            setCheckInhaber(false)
            setCheckManager(false)
        }

        if (userObject?.role === 'Inhaber') {
            setCheckRole(false)
            setCheckAdmin(false)
            setCheckInhaber(true)
            setCheckManager(false)
        }
    }, [userList, userObject?.role])
    return (
        <>
            <div className="relative ml-[260px] h-auto p-5 flex flex-col font-Changa text-textColor gap-5 justify-center">
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <h1 className="font-bold text-3xl">Employees</h1>
                        <div className="flex flex-row">
                            <Link className="text-xl font-semibold leading-6 hover:underline" to="/">Dashboard</Link>
                            <span className="text-[#6c757d] font-xl">/ Employees</span>
                        </div>
                    </div>
                    <div className="flex flex-row px-4 gap-4">
                        <button onClick={() => setAddEmployee(!addEmployee)} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                            <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            Add Employee
                        </button>
                        <button className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                            <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                            Export File
                        </button>
                    </div>
                </div>
                <div className="border border-solid border-t-[#6c757d]"></div>

                {/* //---------------------------------------------------------------- SEARCH ----------------------------------------------------------------// */}
                <div className="z-10 flex flex-row mt-10 justify-between h-[50px]">
                    <input
                        className="w-1/4 text-base px-4 py-3 placeholder:text-placeholderTextColor focus:border-2 focus:border-solid focus:border-placeholderTextColor focus:ring-0"
                        type="text"
                        placeholder="Search by name, ID, position"
                        value={inputSearch}
                        onChange={(e) => setInputSearch(e.target.value)}
                    />
                    {checkRole && (<div
                        onClick={handleRoleMenu}
                        className="w-1/6 h-[50px] text-base cursor-pointer">
                        <div className="flex flex-col w-full py-3 px-2 border border-solid border-placeholderTextColor text-placeholderTextColor">
                            <div className="flex flex-row items-center justify-around w-full">
                                <div className="ml-4">{selectedRole}</div>
                                <div className={`w-4 h-4 flex justify-center items-center ${roleMenu ? "rotate-180" : ""}`}>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="svg-inline--fa fa-caret-down fa-rotate-180 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ color: "rgb(220, 220, 220)" }}><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
                                </div>
                            </div>
                        </div>

                        {roleMenu && (<div className="text-black bg-placeholderTextColor border border-solid border-placeholderTextColor border-t-black flex flex-col gap-3 px-2 py-3 items-center w-full overflow-y-scroll max-h-[200px]">
                            {roleList.map(({ index, name }) => {
                                return <div onClick={() => handleChangeSelectedRole(name)} className="py-1">{name}</div>
                            })}
                        </div>)}
                    </div>)}

                    {checkRole && (<div
                        onClick={handleDepartmetnnMenu}
                        className="w-1/6 h-[50px] text-base cursor-pointer">
                        <div className="flex flex-col w-full py-3 px-2 border border-solid border-placeholderTextColor text-placeholderTextColor">
                            <div className="flex flex-row items-center justify-around w-full">
                                <div className="ml-4">{selectedDepartment}</div>
                                <div className={`w-4 h-4 flex justify-center items-center ${departmentMenu ? "rotate-180" : ""}`}>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="svg-inline--fa fa-caret-down fa-rotate-180 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ color: "rgb(220, 220, 220)" }}><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
                                </div>
                            </div>
                        </div>

                        {departmentMenu && (<div className="text-black bg-placeholderTextColor border border-solid border-placeholderTextColor border-t-black flex flex-col gap-3 px-2 py-3 items-center w-full overflow-y-scroll max-h-[200px]">
                            {departmentList.map(({ index, name }) => {
                                return <div onClick={() => handleChangeSelectedDepartment(name)} className="py-1">{name}</div>
                            })}
                        </div>)}
                    </div>)}

                    {/* <div
                        onClick={handlePositionMenu}
                        className="w-1/6 h-[50px] text-base cursor-pointer">
                        <div className="flex flex-col w-full py-3 px-2 border border-solid border-placeholderTextColor text-placeholderTextColor">
                            <div className="flex flex-row items-center justify-around w-full">
                                <div className="ml-4">{selectedPosition}</div>
                                <div className={`w-4 h-4 flex justify-center items-center ${positionMenu ? "rotate-180" : ""}`}>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" class="svg-inline--fa fa-caret-down fa-rotate-180 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style={{ color: "rgb(220, 220, 220)" }}><path fill="currentColor" d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path></svg>
                                </div>
                            </div>
                        </div>

                        {positionMenu && (<div className=" text-black bg-placeholderTextColor border border-solid border-placeholderTextColor border-t-black flex flex-col gap-3 px-2 py-3 items-center w-full overflow-y-scroll max-h-[200px]">
                            {positionList.map(({ index, name }) => {
                                return <div onClick={() => handleChangeSelectedPosition(name)} className="py-1">{name}</div>
                            })}
                        </div>)}
                    </div> */}
                    <div
                        onClick={handleSeacrh}
                        className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md cursor-pointer hover:bg-emerald-700 w-1/6">
                        <button className="search-btn">Seacrh</button>
                    </div>
                </div>

                {/* //---------------------------------------------------------------- USER LIST ----------------------------------------------------------------// */}
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
                                    <span className="table-title-email">Email</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-role">Role</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-role">Department</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-role"></span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-role">Position</span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-role"></span>
                                </th>
                                <th className="p-2 text-left">
                                    <span className="table-title-status">Status</span>
                                </th>
                            </tr>
                        </thead>
                        {Array.isArray(currentUsers) && currentUsers?.length === 0 ? (
                            <div className="no-result-text text-center">NO RESULT</div>
                        ) : (
                            <tbody className="tbody">
                                {currentUsers?.map(({ id, name, email, status, department, department_name, role, position }) => (
                                    <EmployeeItem
                                        key={id}
                                        name={name}
                                        id={id}
                                        email={email}
                                        status={status}
                                        department={department}
                                        department_name={department_name}
                                        role={role}
                                        position={position}
                                        checkAdmin={checkAdmin}
                                        checkInhaber={checkInhaber}
                                        checkManager={checkManager}
                                    />
                                ))}
                            </tbody>)}
                    </table>
                </div>
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
                {/* add Employee */}
                {addEmployee && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa overflow-y-auto">
                    <div
                        onClick={() => setAddEmployee(false)}
                        className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                    <div className="absolute w-[500px] top-0 right-0 bottom-0 z-30 bg-white">
                        <div className="w-full h-full">
                            <div className="flex flex-col mt-8">
                                <div className="flex flex-row justify-between px-8 items-center">
                                    <div className="font-bold text-xl">Crete Employee</div>
                                    <div
                                        onClick={() => setAddEmployee(false)}
                                        className="text-lg border border-solid border-[rgba(0,0,0,.45)] py-1 px-3 rounded-full cursor-pointer">x</div>
                                </div>
                                <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div>
                                <div className="flex flex-col px-8 w-full mt-7">
                                    <form
                                        className="flex flex-col gap-6 w-full justify-center items-center"
                                        onSubmit={handleSubmit}>
                                        {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                                            <div className="loader"></div>
                                        </div>)}
                                        <div className="w-full h-auto flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Employee's ID</span>
                                            </div>
                                            <input
                                                type="text"
                                                name="id"
                                                required
                                                value={formData.user.id}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full h-auto flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Name</span>
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.user.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full h-auto flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Password</span>
                                            </div>
                                            <input
                                                type="text"
                                                name="password"
                                                required
                                                value={formData.user.password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="w-full h-auto flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Email</span>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.user.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {checkAdmin && (
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
                                                    {departmentList?.map((item, index) => (
                                                        <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        {checkAdmin && (<div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Role</span>
                                            </div>
                                            <select
                                                id="role"
                                                name="role"
                                                className="w-full cursor-pointer"
                                                value={selectedRoleUser}
                                                onChange={(e) => setSelectedRoleUser(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled className='italic text-sm'>Select Role*</option>
                                                {roleList?.map((item, index) => (
                                                    <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>)}
                                        {checkInhaber && (<div className="w-full flex flex-col gap-2">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-rose-500">*</span>
                                                <span className="">Role</span>
                                            </div>
                                            <select
                                                id="role"
                                                name="role"
                                                className="w-full cursor-pointer"
                                                value={selectedRoleUser}
                                                onChange={(e) => setSelectedRoleUser(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled className='italic text-sm'>Select Role*</option>
                                                {roleListForInhaber?.map((item, index) => (
                                                    <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>)}
                                        {positionFormMenuState && (<div className="w-full flex flex-col gap-2">
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
            </div>
        </>
    );
}

export default Employee;

