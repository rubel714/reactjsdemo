import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios'
import { ReactTabulator, reactFormatter } from 'react-tabulator';
import "tabulator-tables/dist/css/tabulator.min.css";
import './Customstyle.css'; 
import '../node_modules/font-awesome/css/font-awesome.min.css'; 


function ActionButtons(props) {
   
    if (props.cell._cell.row.data.status == 0) {
        return (
            <div className="icon-size"><i className="fa fa-edit" onClick={editMasterRow} ></i> <i className="fa fa-trash pad-left" onClick={deleteMasterRow}></i></div>
            )
    }else{
        return (
            <div className="icon-size"><i className="fa fa-eye" onClick={viewMasterRow}></i></div>
            )
    }
}

function editMasterRow(){
    alert("Edit");
}

function deleteMasterRow(){
    alert("Delete");
}

function viewMasterRow(){
    alert("View");
}

function Adjustment() {

    const mToDate = moment();    
    const sToDate = mToDate.format("YYYY-MM-DD");

    const mFromDate = mToDate.subtract(90, "days");

    const sFromDate = mFromDate.format("YYYY-MM-DD");

    const [fromDate, setFromDate] = useState(sFromDate);
    const [toDate, setToDate] = useState(sToDate);

    const adjTypeList = {1:"Expiry", 2:"Loss", 3:"Adj+", 4:"Adj-"};
    const transStatusList = {0:"Draft", 1:"Posted"};

    const options = {};
    const columns = [
        { title: 'Adjustment Date', field: 'adj_date', width: '15%', formatter: function (cell, formatterParams) {
            let value = cell.getValue();               
            return  moment(value).format('DD/MM/YYYY');
        } },
        { title: 'Invoice#', field: 'inv_no', headerFilter:"input", width: '35%', },
        { title: 'Adjustment Type', field: 'adj_type', width: '20%', formatter: function (cell, formatterParams) {
            let value = cell.getValue();
            return adjTypeList[value];
        }},
        { title: 'Status', field: 'status', width: '15%', formatter: function (cell, formatterParams) {
            let value = cell.getValue();
            return transStatusList[value];
        }},
        { 
            title: 'Action', field: 'action', width: '15%', headerSort:false, hozAlign: "center", headerHozAlign:"center", formatter: reactFormatter(<ActionButtons />)
         
        }
    ];
    const [gridData, setGridData] = useState([]);

    function  changeFromDateHandler(e) {
        setFromDate(e.target.value);
    }
    
    function  changeToDateHandler(e) {
        setToDate(e.target.value);
    }

    function  loadData() {
        const username = "admin";
        const password = "district";
        const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
                
        const config = {
            method: 'get',
            url: 'http://178.128.105.42:8080/api/35/trackedEntityInstances/query.json?ou=Faz8TQ1lqm6&program=qY4JI979mcA&filter=wmJRVEE8b87:GE:'+fromDate+':LE:'+toDate+'&filter=r5dtGHGjUz1:EQ:5',
            headers: { 
            'Authorization': 'Basic '+token, 
            'Cookie': 'JSESSIONID=CC88D112714F1C6894BCE97BC7B4C8C9'
            }
        };
        
        axios(config)
        .then(function (response) {
            const rows = response.data.rows;

            if (rows) {
                const rowData = rows.map(row => {
                    return {
                        id: row[0],
                        adj_date: row[9],
                        inv_no: row[8],
                        adj_type: row[18],
                        status: row[19],
                        action: ''
                    }
                });

                setGridData(rowData);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
        loadData();
    }, [fromDate, toDate]);


    return (
      <div>
        <h1>Adjustment</h1>

        <div className="filterRow">

            <div className="filterOption">
                <label>From </label>
                <input type="date" id="FromDate" name="FromDate" onChange={(e) => changeFromDateHandler(e)}  value={fromDate}></input>
            </div>

            <div className="filterOption">
                <label>To </label>
                <input type="date" id="ToDate" name="ToDate" onChange={(e) => changeToDateHandler(e)} value={toDate} ></input>
            </div>

           <div className="filterOption add-icon icon-size"><i className="fa fa-plus-square-o"></i></div>
            
        </div>

        <ReactTabulator
                columns={columns}
                data={gridData}
                options={options}
                className="tableWrapper tabulator"
                layout={"fitColumns"}
            />

      </div>
      
    );
    
  }



export default Adjustment