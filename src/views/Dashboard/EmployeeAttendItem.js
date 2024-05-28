import { Link } from "react-router-dom"

const EmployeeAttendItem = (props) => {
    const { employee_name, employee_id, position, department_name, shift_info, status } = props;
    return (
        <tr className="tr-item">
            <td className="p-2 hover:text-buttonColor2">
                <h2 className="text-left">
                    {/* <Link className="img-table-item-block" to={`viewprofile/${uuid}`}>
                        <img className="img-table-item" src={imageUrl} alt="" />
                    </Link> */}
                    <Link className="cursor-pointer flex flex-col" to={`/employee/view-profile/${employee_id}/${employee_name}`}>{employee_name}
                        <span className="text-xs text-neutral-400">{employee_id}</span>
                    </Link>
                </h2>
            </td>
            <td className="p-2">{department_name}</td>
            {/* <td className="p-2">{position}</td> */}
            <td className="p-2">{shift_info?.shift_code}</td>
            <td className="p-2 flex flex-col">
                {status === "missing" ? (<span className="p-2">{status}</span>) :
                    (<div className="p-2 flex flex-col">
                        <span>{shift_info?.time_slot?.check_in_time}</span>
                        <span className="italic">{shift_info?.time_slot?.check_in_status}</span>
                    </div>)}
            </td>
            <td className="p-2"></td>
            <td className="p-2 flex flex-col">
                <div className="p-2 flex flex-col">
                    <span>{shift_info?.time_slot?.check_out_time}</span>
                    <span className="italic">{shift_info?.time_slot?.check_out_status}</span>
                </div>
            </td>
        </tr>
    )
}

export default EmployeeAttendItem