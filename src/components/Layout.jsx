import { Outlet } from "react-router-dom";

import Navigation from "./Navigation/Navigation";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Layout = () => {
    // const navigate = useNavigate()

    // useEffect(() =>{
    //     navigate("/login")
    // },[])
    return (
        <main className="App">
            <Navigation />
            <Outlet />
        </main>
    );
}

export default Layout;
 