const SubmitEmail = () => {
    return (
        <div className="">
            <div className="flex flex-col gap-5 items-center justify-center w-full h-full">
                <div className="w-full h-full bg-gray-50 rounded-lg">
                    <div className="flex flex-col gap-5 items-center justify-center w-full h-full">
                        <div className="text-3xl font-bold">Forgot Password</div>
                        <form className="flex flex-col gap-3 w-full">
                            <input
                                type="text"
                                placeholder="Email"
                                className="border-2 border-gray-400 p-3 rounded-lg"
                            />
                            <button className="w-full text-white bg-blue-600 hover:bg-blue-700 p-3 rounded-lg">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubmitEmail