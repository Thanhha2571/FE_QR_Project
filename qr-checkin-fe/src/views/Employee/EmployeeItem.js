import "./EmployeeItem.css"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import IconActice from "../../assets/images/icon-active.png"
import IconInactive from "../../assets/images/icon-inactive.png"
const EmployeeItem = (props) => {
    const { id, name, email, status, department, department_name, role, position } = props
    // const [checkRole, setCheckRole] = useState(false)
    // const [checkAdmin, setCheckAdmin] = useState(false)
    const [userObject, setUserObject] = useState()

    // useEffect(() => {
    //     // if (role === "Employee") {
    //     //     setCheckRole(true)
    //     // }
    //     if (userObject?.role !== "Admin") {
    //         setCheckAdmin(false)
    //     }
    //     if (userObject?.role === "Admin") {
    //         setCheckAdmin(true)
    //     }
    // }, [userObject?.role])

    useEffect(() => {
        const userString = localStorage.getItem('user');
        const userObject = userString ? JSON.parse(userString) : null;
        setUserObject(userObject)
        // console.log(userObject);
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
            <td className="p-2 flex flex-col gap-2">
                {department?.map(({ name, position }) => <div>{name} </div>)}
            </td>

            <td className="p-2"></td>

            <td className="p-2 flex flex-col gap-2">
                {department?.map(({ position }) => <div>{position?.join(", ")} </div>)}
            </td>

            <td className="p-2"></td>
            <td className="p-2 flex flex-row gap-2 items-center w-full h-full mt-2">
                {status === "active" &&(<img className="w-4 h-4" src={IconActice} />)}
                {status === "inactive" &&(<img className="w-4 h-4" src={IconInactive} />)}
                <span className={`${status === "active" ? "text-buttonColor2" : "text-red-600"}`}>{status}</span>
            </td>
        </tr>
    )
}

export default EmployeeItem