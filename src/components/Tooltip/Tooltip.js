import { useState } from "react";

const Tooltip = ({ children, text }) => {
    const [show, setShow] = useState(false)

    return (
        <>
            <div 
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                <div>
                    {show && (
                        <div>
                            {text}
                        </div>
                    )}
                </div>                
                {children}
            </div>
        </>
    );
}

export default Tooltip