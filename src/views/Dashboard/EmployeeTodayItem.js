import { Link } from "react-router-dom"

const EmployeeTodayItem = (props) => {
    const { employee_id, employee_name, shift_code, position, time_slot, department_name } = props;
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
            <td className="p-2">{position}</td>
            <td className="p-2">{shift_code}</td>
            <td className="p-2">{time_slot.start_time} ~ {time_slot.end_time}</td>
        </tr>
    )
}

export default EmployeeTodayItem