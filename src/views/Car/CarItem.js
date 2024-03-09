import { useEffect } from "react";

const CarItem = (props) => {
    const { user, car_name, car_number, register_date, department_name, setSelectedCarEdit, id, setFormEdit, formEdit, setFormDelete, formDelete, setSelectedCarDelete, formAddDepartment, setFormAddDepartment, setSelectedCarAddDepartment, formRemoveDepartment, setFormRemoveDepartment, setSelectedCarRemoveDepartment } = props;
    const inputDateString = register_date;
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

    const handleGetIdCarEdit = (id) => {
        setFormEdit(!formEdit)
        setSelectedCarEdit(id)
        console.log("Car id", id);
    }

    const handleGetIdCarDelete = (id) => {
        setFormDelete(!formDelete)
        setSelectedCarDelete(id)
        console.log(id);
    }

    const handleGetIdCarAddDepartement = (id) => {
        setFormAddDepartment(!formAddDepartment)
        setSelectedCarAddDepartment(id)
        console.log(id);
    }

    const handleGetIdCarRemoveDepartement = (id) => {
        setFormRemoveDepartment(!formRemoveDepartment)
        setSelectedCarRemoveDepartment(id)
        console.log(id);
    }
    return (
        <tr className="tr-item">
            <td className="p-4 hover:text-buttonColor2">{car_name}</td>
            <td className="p-4 text-left">{car_number}</td>
            <td className="p-4 text-left">{formattedDateString}</td>
            <td className="p-4 text-left">{department_name?.join(", ")}</td>
            <td className="p-4 text-left flex flex-row gap-3">
                <button
                    onClick={() => handleGetIdCarEdit(id)}
                    type="button"
                    className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800 px-4"
                >Edit</button>
                <button
                    onClick={() => handleGetIdCarDelete(id)}
                    type="button"
                    className="bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-red-800"
                >Delete</button>
                {user.role === "Admin" && (<button
                    onClick={() => handleGetIdCarAddDepartement(id)}
                    type="button"
                    className="bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-emerald-800"
                >
                    <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>Add Department</button>)}
                {user.role === "Admin" && (<button
                    onClick={() => handleGetIdCarRemoveDepartement(id)}
                    type="button"
                    className="bg-red-600 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-red-800"
                >
                    Remove Department</button>)}

            </td>
        </tr>
    );
}

export default CarItem