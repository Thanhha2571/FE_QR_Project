const CarItem = (props) => {
    const { car_name, car_number, register_date, department_name } = props;
    const inputDateString = register_date;
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
            <td className="p-4 hover:text-buttonColor2">{car_name}</td>
            <td className="p-4 text-left">{car_number}</td>
            <td className="p-4 text-left">{formattedDateString}</td>
            <td className="p-4 text-left">{department_name?.join(",")}</td>
        </tr>
    );
}

export default CarItem