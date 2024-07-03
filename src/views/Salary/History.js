import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./Salary.css"
import * as XLSX from "xlsx";
import { baseUrl } from "components/api/httpService";
import HistoryItem from "./HIstoryItem";
const History = (props) => {
    const { historyListByMonth } = props
    return (
        <div className="block w-full text-base font-Changa mt-5 overflow-y-scroll overflow-x-scroll">
            <table className="w-full table">
                <thead className="">
                    <tr className="">
                        <th className="p-2 text-left">
                            <span className="font-bold">Name</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-id">Employee ID</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">Month</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">Year</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">Date Counting</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">Time Counting</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">netto</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">überweisung</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">optional</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">€/km (0,25)</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">über s x</span>
                        </th>
                        <th className="p-2 text-left">
                            <span className="table-title-status">Gehalt</span>
                        </th>
                    </tr>
                </thead>
                {Array.isArray(historyListByMonth) && historyListByMonth?.length === 0 ? (
                    <div className="no-result-text text-center">NO RESULT</div>
                ) : (
                    <tbody className="tbody">
                        {historyListByMonth?.map(({date_calculate,employee_id, employee_name, year, month, a_parameter, b_parameter, c_parameter, d_parameter, f_parameter, total_salary }) => (
                            <HistoryItem
                                date={date_calculate}
                                employee_id={employee_id}
                                employee_name={employee_name}
                                year={year}
                                month={month}
                                a_parameter={a_parameter}
                                b_parameter={b_parameter}
                                c_parameter={c_parameter}
                                d_parameter={d_parameter}
                                f_parameter={f_parameter}
                                total_salary={total_salary}
                            />
                            // <tr className="tr-item" key={employee_id}>
                            //     <td className="p-2 hover:text-buttonColor2">
                            //         <h2 className="text-left">
                            //             <div className="cursor-pointer flex flex-col">{employee_name}
                            //             </div>
                            //         </h2>
                            //     </td>
                            //     <td className="p-2">{employee_id}</td>
                            //     <td className="p-2">{month}</td>
                            //     <td className="p-2">{year}</td>
                            //     <td className="p-2">{a_parameter}</td>
                            //     <td className="p-2">{b_parameter}</td>
                            //     <td className="p-2">{c_parameter}</td>
                            //     <td className="p-2">{d_parameter}</td>
                            //     <td className="p-2">{f_parameter}</td>
                            // </tr>
                        ))}
                    </tbody>
                )}
            </table>
        </div>
    )
}
export default History

