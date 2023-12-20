import { Link } from 'react-router-dom';
import { useState } from 'react';
import Logo from "../../assets/images/logo.png"
import WorkingIcon from "../../assets/images/work-icon.png"
import SalaryIcon from "../../assets/images/salary-icon.png"
import DotIcon from "../../assets/images/dot-icon.png"
import './Navigation.css';

const Navigation = () => {
    const [sidebar, setSidebar] = useState(false);
    const [employeeMenu, setEmployeeMenu] = useState(false);
    const [attendanceMenu, setAttendanceMenu] = useState(false);
    const [salaryMenu, setSalaryMenu] = useState(false);

    // const toggleSidebar = () => setSidebar(!sidebar);

    return (
        <div className="navigation-container shadow bg-white font-Changa text-[#b7c0cd]">
            {/* <div>
                <h3 onClick={toggleSidebar} >
                    <i class="bi bi-list"></i>
                </h3>
            </div> */}
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'} >

                <div className="p-4 flex flex-row items-center justify-center">
                    {/* <img src={Logo} alt="" className='w-20 h-auto' /> */}
                    <h3 className='font-DancingScript font-bold text-xl'>CÔCÔ MANAGEMENT</h3>
                </div>

                <ul className="routerLink p-3">
                    <Link to="/">
                        <li className="nav-item mb-3 p-2 rounded">
                            <div className='flex flex-row justify-center items-center gap-4'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" stroke="#b7c0cd" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5" stroke="#b7c0cd" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 13H12" stroke="#b7c0cd" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 17H16" stroke="#b7c0cd" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                <h4 className={sidebar ? "navName" : "navName fullsize"} >
                                    Dashboard
                                </h4>
                            </div>
                        </li>
                    </Link>
                    <div onClick={() => setEmployeeMenu(!employeeMenu)}>
                        <li className="nav-item mb-3 p-2 rounded flex justify-between">
                            <div className='flex flex-row justify-center items-center gap-4'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#b7c0cd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#b7c0cd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                <h4 className={sidebar ? "navName" : "navName fullsize"} >
                                    Employee
                                </h4>
                            </div>
                            <div className={employeeMenu ? "rotate-90" : ""}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="#b7c0cd" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </div>
                        </li>
                        {employeeMenu && (<ul className="flex flex-col gap-3 list-none">
                            <li className='px-8 py-2'>
                                <Link className="flex flex-row gap-2 justify-center items-center" to="employee">
                                    <img src={DotIcon} alt="" className='w-3 h-3' />
                                    <div className="item-sub-menu">
                                        <div className="item-title">All employees</div>
                                    </div>
                                </Link>
                            </li>
                            {/* <li>
                                <Link className="tags" to="employee/departments">
                                    <div className="item-sub-menu">
                                        <div className="item-title">Departments</div>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link className="tags" to="employee/position">
                                    <div className="item-sub-menu">
                                        <div className="item-title">Position</div>
                                    </div>
                                </Link>
                            </li> */}
                        </ul>)}
                    </div>
                    <div onClick={() => setAttendanceMenu(!attendanceMenu)}>
                        <li className="nav-item mb-3 p-2 rounded flex justify-between">
                            <div className='flex flex-row justify-center items-center gap-4'>
                                <img src={WorkingIcon} className='w-6 h-6' />
                                <h4 className={sidebar ? "navName" : "navName fullsize"} >
                                    Work Management
                                </h4>
                            </div>
                            <div className={attendanceMenu ? "rotate-90" : ""}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="#b7c0cd" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </div>
                        </li>
                        {attendanceMenu && (<ul className="flex flex-col gap-3 list-none">
                            <li className='px-8 py-2'>
                                <Link className="flex flex-row justify-center items-center gap-4" to="working-schedule">
                                    <img src={DotIcon} alt="" className='w-3 h-3' />
                                    <div className="item-sub-menu">
                                        <div className="item-title">Working Schedule</div>
                                    </div>
                                </Link>
                            </li>
                            <li className='px-8 py-2'>
                                <Link className="flex flex-row justify-center items-center gap-4" to="working-schedule/day-off-management">
                                    <img src={DotIcon} alt="" className='w-3 h-3' />
                                    <div className="item-sub-menu">
                                        <div className="item-title">Day Off</div>
                                    </div>
                                </Link>
                            </li>
                        </ul>)}
                    </div>
                    <div onClick={() => setSalaryMenu(!salaryMenu)}>
                        <li className="nav-item mb-3 p-2 rounded flex justify-between">
                            <div className='flex flex-row justify-center items-center gap-4'>
                                <img src={SalaryIcon} className='w-6 h-6' />
                                <h4 className={sidebar ? "navName" : "navName fullsize"} >
                                    Salary
                                </h4>
                            </div>
                            <div className={salaryMenu ? "rotate-90" : ""}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="#b7c0cd" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </div>
                        </li>
                        {salaryMenu && (<ul className="flex flex-col gap-3 list-none">
                            <li className='px-8 py-2'>
                                <Link className="flex flex-row justify-center items-center gap-4" to="salary/summarize">
                                    <img src={DotIcon} alt="" className='w-3 h-3' />
                                    <div className="item-sub-menu">
                                        <div className="item-title">Salary Summarize</div>
                                    </div>
                                </Link>
                            </li>
                        </ul>)}
                    </div>
                </ul>
            </nav>
        </div>
    );
}

export default Navigation;