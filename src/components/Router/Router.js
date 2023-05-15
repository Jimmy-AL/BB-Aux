import {BrowserRouter, Route, Routes} from "react-router-dom";
import BBAuxes from "../BBAuxes/BBAuxes"

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="tool" element={<BBAuxes />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;