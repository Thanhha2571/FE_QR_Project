import SendIcon from "../../assets/images/SendIcon.png"
import { useState } from "react";
import { baseUrl } from "components/api/httpService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IconSucess from "../../assets/images/icon-active.png"
const SubmitEmail = () => {
    document.title = "Submit Email";
    const [email, setEmail] = useState('');
    const [confirmEmailModal, setConfirmEmailModal] = useState(false)
    const navigate = useNavigate();
    const handleSendEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${baseUrl}/api/auth/manage-password/reset-password`,
                {
                    email: email,
                },
            );
            // console.log(response);
            setEmail("")
            setConfirmEmailModal(true)
            // navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message);
            setEmail("")
        }
    }

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white flex flex-col justify-center min-h-screen overflow-hidden font-Changa">
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
                    Email Address
                </h1>
                <form className="mt-6">
                    <div className="mb-2">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mt-6 flex flex-row gap-3 items-center justify-center">
                        <button
                            onClick={handleSendEmail}
                            className="flex flex-row items-center font-bold justify-center gap-4 w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                        >
                            Send Email <img src={SendIcon} w-4 h-auto />
                        </button>
                    </div>
                </form>
            </div>
            {confirmEmailModal && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setConfirmEmailModal(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[700px] h-[230px] top-[300px] right-[500px] bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row px-8 items-center gap-3">
                                <img src={IconSucess} w-8 h-auto />
                                <span className="font-bold text-2xl">Sent Successfully</span>
                            </div>
                            {/* <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div> */}
                            <div className="flex flex-col px-8 w-full mt-7 font-Changa gap-4 items-center">
                                <div className="flex flex-row gap-3">
                                    <span className="text-xl">Please check your email to reset the password</span>
                                </div>
                                <div className="flex flex-row gap-3 justify-center items-center">
                                    <a
                                        // onClick={() => {
                                        //     setConfirmEmailModal(false)
                                        //     navigate('/login')
                                        // }}
                                        href="/login"
                                        type="button" className="w-[100px] bg-buttonColor2 text-white text-base flex flex-row gap-1 justify-center items-center border border-solid px-2 py-1 rounded-md cursor-pointer">Okay</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    )
}

export default SubmitEmail