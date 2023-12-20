import { Routes, Route, useLocation } from "react-router-dom";

import Dashboard from "views/Dashboard/Dashboard";
import Attendance from "views/Attendance/Attendance";
import Employee from "views/Employee/Employee";
import Department from "views/Employee/Department/Department";
import Position from "views/Position/Position";
import ProfileEmployee from "views/ProfileEmployee/ProfileEmployee";
import WorkingSchedule from "views/Attendance/WorkingSchedule/WorkingSchedule";
// import AddEmployee from "views/Employee/AddEmployee/AddEmployee";
import Login from "views/Login/Login";
// import { AuthContextProvider } from "context/AuthContext";
import Layout from "components/Layout";
import RequireAuth from "components/RequireAuth";
import Unauthorized from "components/Unauthorized";
import Missing from "components/Missing";
import DayOffManagement from "views/Attendance/DayOffManagement/DayOffManagement";
import SalarySummarize from "views/Salary/SalarySummarize";
import SalaryEmployee from "views/Salary/SalaryEmployee";

const titles = {
    '/': 'QR Checkin',
    '/attendance': 'Attendance',
    '/employee': 'Employee',
}

const ROLES = {
    'Admin': 'Admin',
    'Inhaber': 'Inhaber',
    'Manager': 'Manager',
    'Employee': 'Employee',
}


const Router = () => {
    // const location = useLocation()
    // useEffect(
    //     async () => (document.title = titles[location.pathname]),
    //     [location],
    // )  
    return (
        <Routes>
            <Route path="/" element={<Layout />} >
                {/* public routes */}
                <Route path="login" element={<Login />} />
                <Route path="unauthorized" element={<Unauthorized />} />

                {/* protected routes */}
                {/* <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Inhaber]}/>} > */}
                    <Route path="/" element={<Dashboard />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="employee" element={<Employee />} />
                    <Route path="employee/departments" element={<Department />} />
                    <Route path="employee/position" element={<Position />} />
                    <Route path="employee/view-profile/:id" element={<ProfileEmployee />} />
                    <Route path="working-schedule" element={<WorkingSchedule />} />
                    <Route path="working-schedule/day-off-management" element={<DayOffManagement />} />
                    <Route path="salary/summarize" element={<SalarySummarize />} />
                    <Route path="salary/sumarize/:employeeId" element={<SalaryEmployee />} />
                    {/* <Route path="employee/add-employee" element={<AddEmployee />} /> */}
                {/* </Route> */}

                {/* missing route */}
                <Route path="*" element={<Missing />} />

            </Route>
        </Routes>

    );
};

export default Router;

