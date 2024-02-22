const ReportFormItem = (props) => {
    const { date, employee_id, position, car_info, employee_name, check_in_km, check_out_km, bar, kredit_karte, kassen_schniff, gesamt_ligerbude, gesamt_liegerando, gesamt, trinked_ec, trink_geld, auf_rechnung, results } = props;
    const inputDateString = date;
    const inputDate = new Date(inputDateString);

    // Get the date components
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(inputDate.getDate()).padStart(2, '0');
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const seconds = String(inputDate.getSeconds()).padStart(2, '0');
    const timezoneOffset = inputDate.getTimezoneOffset();
    const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const timezoneOffsetMinutes = Math.abs(timezoneOffset) % 60;
    const timezoneOffsetString = `${timezoneOffset < 0 ? '+' : '-'}${String(timezoneOffsetHours).padStart(2, '0')}:${String(timezoneOffsetMinutes).padStart(2, '0')}`;

    // Create the formatted date string
    const formattedDateString = `${year}-${month}-${day}`;
    return (
        <tr className="tr-item">
            <td className="p-4 hover:text-buttonColor2">{formattedDateString}</td>
            <td className="p-4 text-left">{employee_name}</td>
            <td className="p-4 text-left">{employee_id}</td>
            <td className="p-4 text-left">{position}</td>
            <td className="p-4 text-left">
                <div className="flex flex-col">
                    <span>{car_info?.car_number}</span>
                    <span>{car_info?.car_type}</span>
                </div>
            </td>
            <td className="p-4 text-left">{check_in_km}</td>
            <td className="p-4 text-left">{check_out_km}</td>

            
            {position === "Lito" && 
                (<td className="p-4 text-left">
                    <div className="flex flex-col">
                        <span>Bar: {bar}</span>
                        <span>Kreditkarte: {kredit_karte}</span>
                        <span>Kassen-Schniff: {kassen_schniff}</span>
                        <span>Gesamt Liegerbude: {gesamt_ligerbude}</span>
                        <span>Gesamt Lieferando: {gesamt_liegerando}</span>
                        <span>results: {results}</span>
                    </div>
                </td>
            )}
            {position === "Service" && 
                (<td className="p-4 text-left">
                    <div className="flex flex-col">
                        <span>Bar: {bar}</span>
                        <span>gesamt: {gesamt}</span>
                        <span>trinked_ec: {trinked_ec}</span>
                        <span>trink_geld: {trink_geld}</span>
                        <span>auf_rechnung: {auf_rechnung}</span>
                        <span>results: {results}</span>
                    </div>
                </td>
            )}
        </tr>
    );
}

export default ReportFormItem