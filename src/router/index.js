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
import ManageLog from "views/Attendance/MangeLog/ManageLog";
import Car from "views/Car/Car";
import AttendanceHistory from "views/Salary/AttendanceHistory";
import ReportForm from "views/ReportForm/ReportForm";
import GenerateQR from "views/GenerateQR/GenerateQR";
import History from "views/Salary/History";
import QrLink from "views/GenerateQR/QrLink";
import SubmitEmail from "views/ForgotPassword/submitEmail";
import ForgotPasswordForm from "views/ForgotPassword/ForgotPasswordForm";
import ChangePassword from "views/ChangePassword/ChangePassword";
import LoadingLayout from "views/LoadingLayout/LoadingLayout";
import ScheduleEmployees from "views/ScheduleEmployees/SheduleEmployees";
const titles = {
    '/': 'QR Checkin',
    '/attendance': 'Attendance',
    '/employee': 'Employee',
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
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="unauthorized" element={<Unauthorized />} />
        
                {/* protected routes */}
                {/* <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Inhaber]}/>} > */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="employee" element={<Employee />} />
                <Route path="employee/departments" element={<Department />} />
                <Route path="employee/position" element={<Position />} />
                <Route path="employee/view-profile/:id/:name" element={<ProfileEmployee />} />
                <Route path="working-schedule" element={<WorkingSchedule />} />
                <Route path="working-schedule/day-off-management" element={<DayOffManagement />} />
                <Route path="salary/summarize" element={<SalarySummarize />} />
                {/* <Route path="salary/history_counting" element={<History />} /> */}
                <Route path="salary/sumarize/:employeeId/:employeeName" element={<SalaryEmployee />} />
                <Route path="manage-log" element={<ManageLog />} />
                <Route path="manage-car" element={<Car />} />
                <Route path="manage-report-form" element={<ReportForm />} />
                {/* <Route path="attendance/summarize" element={<AttendanceHistory />} /> */}
                <Route path="generate_qr" element={<GenerateQR />} />
                <Route path="Qr_link/:selectedDepartment" element={<QrLink />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="schedule-employees" element={<ScheduleEmployees />} />
                {/* <Route path="employee/add-employee" element={<AddEmployee />} /> */}
                {/* </Route> */}

                {/* missing route */}
                <Route path="*" element={<Missing />} />
            </Route>
            <Route path="submit-email" element={<SubmitEmail />} />
            <Route path="reset-password" element={<ForgotPasswordForm />} />
        </Routes>

    );
};

export default Router;

