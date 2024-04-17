import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const GroupItem = (props) => {
    const { name, code, shift_type, shift_design, members } = props;
    console.log(shift_design);
    const [addEmployee, setAddEmployee] = useState(false)
    const [loading, setLoading] = useState(false);
    const handleAddEmployee = () => {
        setAddEmployee(true)
    }

    const [formData, setFormData] = useState({
        user: {
            id: '',
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
        try {
            const { data } = await axios.put(`https://qr-code-checkin.vercel.app/api/admin/group/add-member?code=${code}`, {
                employeeID: formData.user.id,
            });

            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            // Handle error
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }


    };
    return (
        <tr className="tr-item">
            <td className="py-4 px-2 hover:text-buttonColor2">
                <h2 className="text-left">
                    <Link className="cursor-pointer flex flex-col">{name}</Link>
                </h2>
            </td>
            <td className="py-4 px-2 text-left">{cosdfdsfsdde}</td>
            <td className="py-4 px-2">{shift_type}</td>
            <td className="py-4 px-2 flex flex-col gap-3">
                {shift_design?.map((item, index) => (
                    <div className="flex flex-row gap-2" key={index}>
                        <span>{item?.date}: </span>
                        <span>{item?.shift_code}</span>
                        {item?.time_slot?.detail?.map((item, index) => (
                            <div key={index}>{item?.start_time}-{item?.end_time}</div>
                        ))}
                    </div>
                ))}
            </td>
            <td className="py-4 px-2">{members?.length}</td>
            <td className="">
                <button onClick={handleAddEmployee} className="bg-buttonColor1 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid p-2 rounded-md hover:bg-cyan-800">
                    <svg style={{ width: '14px', height: '16px' }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg>
                    Add Employee
                </button>
            </td>
            {addEmployee && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
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
        </tr>

    );
}

export default GroupItem