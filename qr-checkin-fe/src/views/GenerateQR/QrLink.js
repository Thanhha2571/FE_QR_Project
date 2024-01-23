import { useParams } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

const QrLink = () => {
    const { selectedDepartment } = useParams()
    const [qrData, setQRData] = useState(`QR code for department - ${Date.now()}`);
    useEffect(() => {
        const updateQRCode = () => {
            const timestamp = new Date().toISOString();
            setQRData(`QR code for department ${selectedDepartment} - ${timestamp}`);
        };

        updateQRCode();

        const intervalId = setInterval(updateQRCode, 20000);

        return () => {
            clearInterval(intervalId);
        };
    }, [selectedDepartment]);

    return (
        <div className="bg-white h-screen w-full z-20 absolute">
            <div className="flex flex-col items-center justify-center mt-10 gap-3">
                <div>Welcome to department {selectedDepartment}</div>
                <div>Scan this Qr Code to check attendance</div>
                {qrData && <QRCode value={qrData} className="qr-code" />}
            </div>
        </div>
    )
}

export default QrLink