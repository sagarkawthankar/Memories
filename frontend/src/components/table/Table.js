import React from "react";
import { Table } from "react-bootstrap";
import { useTable } from "react-table";
import './Table.css';
/**
 * As in the previous versions, a react-table accepts colums where at the core we have a field Header, and accessor
 * As in the previous versions, a react-table has data that consist of an array of JSONs
 */
const ReactTable = ({ columns, data }) => {
    // you can get the react table functions by using the hook useTable
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    });
    return (
        <Table bordered {...getTableProps()}>
            <thead className="TableHeading">
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => {
                        const {render, getHeaderProps} = column
                        return (
                            <th {...getHeaderProps()}>{render("Header")}</th>
                        )
                    })}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()} className="TableBody">
            {rows.map((row, i) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                        })}
                    </tr>
                );
            })}
            </tbody>
        </Table>
    );
};

export default ReactTable;