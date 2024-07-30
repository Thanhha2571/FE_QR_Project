const HistoryItem = (props) => {
    const { total_salary,date, employee_id, employee_name, year, month, a_parameter, b_parameter, c_parameter, d_parameter, f_parameter } = props;
    console.log(props);
    const inputDateString = date; // Example date string, replace with actual 'date'
    const inputDate = new Date(inputDateString);
    
    // Get the date components
    const yearInput = inputDate.getFullYear();
    const monthInput = String(inputDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(inputDate.getDate()).padStart(2, '0');
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const seconds = String(inputDate.getSeconds()).padStart(2, '0');
    const timezoneOffset = inputDate.getTimezoneOffset();
    const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const timezoneOffsetMinutes = Math.abs(timezoneOffset) % 60;
    const timezoneOffsetString = `${timezoneOffset < 0 ? '+' : '-'}${String(timezoneOffsetHours).padStart(2, '0')}:${String(timezoneOffsetMinutes).padStart(2, '0')}`;
    
    console.log(`Input Date: ${yearInput}-${monthInput}-${day}T${hours}:${minutes}:${seconds}${timezoneOffsetString}`);
    
    // Create a Date object from the original timestamp
    const time = date; // Example time string, replace with actual 'time'
    const created_at = new Date(time);
    
    // Calculate the offset for UTC+2 directly using JavaScript Date methods
    const utcPlus2Date = new Date(created_at.getTime() + 2 * 60 * 60 * 1000);
    
    // Format the date and time as a string
    const formattedDate = utcPlus2Date.toISOString().replace('Z', '+02:00');
    
    console.log(`Formatted Date (UTC+2): ${formattedDate}`);

    return (
        <tr className="tr-item" key={employee_id}>
            <td className="p-2 hover:text-buttonColor2">
                <h2 className="text-left">
                    <div className="cursor-pointer flex flex-col">{employee_name}
                    </div>
                </h2>
            </td>
            <td className="p-2">{employee_id}</td>
            <td className="p-2">{month}</td>
            <td className="p-2">{year}</td>
            <td className="p-2">{formattedDate.substring(0,10)}</td>
            <td className="p-2">{formattedDate.substring(11,16)}</td>
            <td className="p-2">{a_parameter}</td>
            <td className="p-2">{b_parameter}</td>
            <td className="p-2">{c_parameter}</td>
            <td className="p-2">{d_parameter}</td>
            <td className="p-2">{f_parameter}</td>
            <td className="p-2">{total_salary}</td>
        </tr>
    );
}

export default HistoryItem