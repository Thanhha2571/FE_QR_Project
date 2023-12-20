import "./EmployeeItem.css"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import IconActice from "../../assets/images/icon-active.png"
const EmployeeItem = (props) => {
    const { id, name, email, status, department, department_name, role, position } = props
    const [checkRole, setCheckRole] = useState(false)

    useEffect(() => {
        if (role === "Employee") {
            setCheckRole(true)
        }
    }, [])
    return (
        <tr className="tr-item">
            <td className="p-2 hover:text-buttonColor2">
                <h2 className="text-left">
                    {/* <Link className="img-table-item-block" to={`viewprofile/${uuid}`}>
                        <img className="img-table-item" src={imageUrl} alt="" />
                    </Link> */}
                    <Link className="cursor-pointer flex flex-col" to={`view-profile/${id}`}>{name}
                        <span className="text-xs text-neutral-400">{role}</span>
                    </Link>
                </h2>
            </td>
            <td className="p-2">{id}</td>
            <td className="p-2">{email}</td>
            <td className="p-2">{role}</td>
            {checkRole ? (<td className="p-2 flex flex-col gap-2">
                {department?.map(({ name, position }) => <div>{name} </div>)}
            </td>) : (<td className="p-2 flex flex-row gap-2">{department_name}</td>)}
            <td className="p-2"></td>
            {checkRole ? (<td className="p-2 flex flex-col gap-2">
                {department?.map(({ position }) => <div>{position?.join(", ")} </div>)}
            </td>) : (<td className="p-2 flex flex-row gap-2"></td>)}
            <td className="p-2"></td>
            <td className="p-2 flex flex-row gap-2 items-center w-full h-full mt-2">
                <img className="w-4 h-4" src={IconActice} />
                <span className="text-buttonColor2">{status}</span>
            </td>
        </tr>
    )
}

export default EmployeeItem