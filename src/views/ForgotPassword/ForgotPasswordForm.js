import SendIcon from "../../assets/images/SendIcon.png"
import { useState } from "react";
import { baseUrl } from "components/api/httpService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { roleItems } from "assets/data/data";
import IconSucess from "../../assets/images/icon-active.png"
import IconHide from "../../assets/images/hide-icon.png"
import IconUnHide from "../../assets/images/unhide_icon.png"
import SubmitCode from "./SubmitCode";
const ForgotPasswordForm = () => {
    document.title = "Forgot Password Form";
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [confirmEmailModal, setConfirmEmailModal] = useState(false)
    const [verifyNotice, setVerifyNotice] = useState(false)
    const [showPassword, setShowPassword] = useState(true);
    const [showCfPassword, setShowCfPassword] = useState(true);
    const [successFullState, setSuccessFullState] = useState(false)
    const [forgotPasswordState, setForgotPasswordState] = useState(false)
    const [emailCodeState, setEmailCodeState] = useState(true)
    const [emailCode, setEmailCode] = useState('')
    const [showEmailCode, setShowEmailCode] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const handleSubmitResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setVerifyNotice(true)
        }
        else {
            if (role === "Admin") {
                try {
                    const response = await axios.post(
                        `${baseUrl}/api/auth/manage-password/forgot-admin`,
                        {
                            id: id,
                            name: name,
                            role: role,
                            newPassword: newPassword,
                        },
                    );
                    setSuccessFullState(true)
                    setId('')
                    setName('')
                    setRole('')
                    setNewPassword('')
                    setConfirmNewPassword('')
                    setVerifyNotice(false)
                    // setConfirmEmailModal(true)
                    // navigate('/login');
                } catch (err) {
                    alert(err.response?.data?.message);
                    setId('')
                    setName('')
                    setRole('')
                    setNewPassword('')
                    setConfirmNewPassword('')
                    setVerifyNotice(false)
                }
            } else {
                try {
                    const response = await axios.post(
                        `${baseUrl}/api/auth/manage-password/forgot-employee`,
                        {
                            id: id,
                            name: name,
                            role: role,
                            newPassword: newPassword,
                        },
                    );
                    setSuccessFullState(true)
                    setId('')
                    setName('')
                    setRole('')
                    setNewPassword('')
                    setConfirmNewPassword('')
                    setVerifyNotice(false)
                    // setConfirmEmailModal(true)
                } catch (err) {
                    alert(err.response?.data?.message);
                    setId('')
                    setName('')
                    setRole('')
                    setNewPassword('')
                    setConfirmNewPassword('')
                    setVerifyNotice(false)
                }
            }
        }
    }

    const handleEmailCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}/api/auth/manage-password/check-token`,
                {
                    token: emailCode,
                },
            );
            setEmailCode('')
            setEmailCodeState(false);
            setForgotPasswordState(true)
            setLoading(false)
        } catch (err) {
            alert(err.response?.data?.message);
            setEmailCode('')
            setEmailCodeState(true);
            setForgotPasswordState(false)
            setLoading(false)
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowCfPassword = () => {
        setShowCfPassword(!showCfPassword);
    };

    const toggleShowEmailCode = () => {
        setShowEmailCode(!showEmailCode);
    };

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white flex flex-col justify-center min-h-screen overflow-hidden font-Changa">
            {loading && (<div className="absolute flex w-full h-full items-center justify-center">
                <div className="loader_search"></div>
            </div>)}
            {forgotPasswordState && (<div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
                    Reset Password Form
                </h1>
                <form className="mt-6">
                    <div className="mb-4 flex flex-col gap-3">
                        <div className="flex flex-row gap-2">
                            <span className="text-rose-500">*</span>
                            <span className="">ID</span>
                        </div>
                        <input
                            type="text"
                            id="id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                            className="w-full cursor-pointer border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                        />
                    </div>
                    <div className="mb-4 flex flex-col gap-3">
                        <div className="flex flex-row gap-2">
                            <span className="text-rose-500">*</span>
                            <span className="">Name</span>
                        </div>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full cursor-pointer border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                        />
                    </div>
                    <div className="w-full flex flex-col gap-3 mb-4">
                        <div className="flex flex-row gap-2">
                            <span className="text-rose-500">*</span>
                            <span className="">Rolle</span>
                        </div>
                        <select
                            id="role"
                            name="role"
                            className="w-full cursor-pointer border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="" disabled className='italic text-sm'>Wählen Sie Rolle aus*</option>
                            {roleItems?.map((item, index) => (
                                <option className='text-sm text-textColor w-full' key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 flex flex-col gap-3">
                        <div className="flex flex-row gap-2">
                            <span className="text-rose-500">*</span>
                            <span>New Password</span>
                            <img src={showPassword ? IconHide : IconUnHide} className="w-6 h-auto cursor-pointer" onClick={toggleShowPassword} />
                        </div>
                        <input
                            type={showPassword ? "password" : "text"}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full cursor-pointer border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                        />
                    </div>
                    <div className="mb-4 flex flex-col gap-3">
                        <div className="flex flex-row gap-2">
                            <span className="text-rose-500">*</span>
                            <span>Confirm New Password</span>
                            <img src={showCfPassword ? IconHide : IconUnHide} className="w-6 h-auto cursor-pointer" onClick={toggleShowCfPassword} />
                        </div>
                        <input
                            type={showCfPassword ? "password" : "text"}
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            className="w-full cursor-pointer border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                        />
                    </div>
                    {verifyNotice && (<span className="text-red-600">New Password and Confirm New Password is not match</span>)}
                    <div className="mt-6 flex flex-row gap-3 items-center justify-center">
                        <button
                            onClick={handleSubmitResetPassword}
                            className="flex flex-row items-center font-bold justify-center gap-4 w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                        >
                            Reset Password <img src={SendIcon} w-4 h-auto />
                        </button>
                    </div>
                </form>
            </div>)}
            {emailCodeState && (<div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
                    Submit Email Code
                </h1>
                <form className="mt-6">
                    <div className="mb-4 flex flex-col gap-3">
                        <div className="flex flex-row gap-2">
                            <span className="text-rose-500">*</span>
                            <span className="">Email Code</span>
                            <img src={showEmailCode ? IconHide : IconUnHide} className="w-6 h-auto cursor-pointer" onClick={toggleShowEmailCode} />
                        </div>
                        <input
                            type={showEmailCode ? "password" : "text"}
                            id="email_code"
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value)}
                            required
                            className="w-full cursor-pointer border-[#d9d9d9] text-[#6c757d] rounded-[6px] h-[45px] text-base px-4 py-3 placeholder:text-placeholderTextColor hover:border-[#4096ff] focus:border-[#4096ff]"
                        />
                    </div>
                    {/* {verifyNotice && (<span className="text-red-600">New Password and Confirm New Password is not match</span>)} */}
                    <div className="mt-6 flex flex-row gap-3 items-center justify-center">
                        <button
                            onClick={handleEmailCode}
                            className="flex flex-row items-center font-bold justify-center gap-4 w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                        >
                            Send Code <img src={SendIcon} w-4 h-auto />
                        </button>
                    </div>
                </form>
            </div>)}
            {successFullState && (<div className="fixed top-0 bottom-0 right-0 left-0 z-20 font-Changa">
                <div
                    onClick={() => setSuccessFullState(false)}
                    className="absolute top-0 bottom-0 right-0 left-0 bg-[rgba(0,0,0,.45)] cursor-pointer"></div>
                <div className="absolute w-[700px] h-[230px] top-[300px] right-[500px] bottom-0 z-30 bg-white">
                    <div className="w-full h-full">
                        <div className="flex flex-col mt-8">
                            <div className="flex flex-row px-8 items-center gap-3">
                                <img src={IconSucess} w-8 h-auto />
                                <span className="font-bold text-2xl">Reset Password Successfully</span>
                            </div>
                            {/* <div className="w-full border border-solid border-t-[rgba(0,0,0,.45)] mt-4"></div> */}
                            <div className="flex flex-col px-8 w-full mt-7 font-Changa gap-4 items-center">
                                <div className="flex flex-row gap-3">
                                    <span className="text-xl">Please comeback to Login Page</span>
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

export default ForgotPasswordForm