import { useParams } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

const QrLink = () => {
    const { selectedDepartment } = useParams()
    
    const decryptParameter = (encryptedParam) => {
        const key = 'YourSecretKey'; // Replace 'YourSecretKey' with your actual secret key
        const decrypted = atob(encryptedParam); // Decode from Base64
        const additionalData = 'YourAdditionalDatasdfsdfdfsfdsdfdfdsfffddsfsdfsdfsdfdsfdsfsdfddsfdsfdsfdsfqweww';
        const additionalDataIndex = decrypted.indexOf(additionalData + key); // Find the index of additional data
        console.log(additionalDataIndex);
        if (additionalDataIndex !== -1) {
            // If additional data is found, remove it
            const param = decrypted.substring(0, additionalDataIndex);
            return param;
        } else {
            // If additional data is not found, return the decrypted value as is
            return decrypted;
        }
    };
    
    const [qrData, setQRData] = useState(`QR code for department - ${Date.now()}`);
    useEffect(() => {
        const updateQRCode = () => {
            const timestamp = new Date().toISOString();
            setQRData(`QR code for department ${decryptParameter(selectedDepartment)} - ${timestamp}`);
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
                <div>Willkommen in der Abteilung {decryptParameter(selectedDepartment)}</div>
                <div>Scannen Sie diesen QR-Code, um die Anwesenheit zu überprüfen</div>
                {qrData && <QRCode value={qrData} className="qr-code" />}
            </div>
        </div>
    )
}

export default QrLink