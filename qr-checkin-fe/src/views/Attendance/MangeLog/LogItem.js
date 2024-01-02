const LogItem = (props) => {
    const { date, _id, editor_name, editor_role, edited_name, edited_role, before_update, after_update } = props
    const inputDateString = before_update?.date;
    // Create a Date object from the input string
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

    console.log(formattedDateString);
    return (
        <tr className="tr-item">
            <td className="p-4 text-left">{date?.substring(0, 10)}</td>
            <td className="p-4 text-left">{editor_name}</td>
            <td className="p-4 text-left">{editor_role}</td>
            <td className="p-4 text-left">{edited_name}</td>
            <td className="p-4 text-left">{edited_role}</td>
            <td className="p-4 text-left">{before_update?.shift_info?.shift_code}</td>
            <td className="p-4 text-left">{formattedDateString}</td>
            <td className="p-4 flex flex-col gap-2">
                <div>{before_update?.shift_info.time_slot?.check_in_time}</div>
                <div>{before_update?.shift_info.time_slot?.check_in_status}</div>
                <div>{before_update?.shift_info.time_slot?.check_out_time}</div>
                <div>{before_update?.shift_info.time_slot?.check_out_status}</div>
            </td>
            <td></td>
            <td className="p-4 flex flex-col gap-2">
                <div>{after_update?.shift_info.time_slot?.check_in_time}</div>
                <div>{after_update?.shift_info.time_slot?.check_in_status}</div>
                <div>{after_update?.shift_info.time_slot?.check_out_time}</div>
                <div>{after_update?.shift_info.time_slot?.check_out_status}</div>
            </td>
        </tr>
    );
}

export default LogItem