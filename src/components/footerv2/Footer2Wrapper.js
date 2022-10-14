import { Outlet } from "react-router-dom";
import Footer2 from "./Footer2";
function FooterWrapper(){
    return(
        <>
            <Outlet />
            <Footer2 />
        </>

    )
}
export default FooterWrapper