"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { submitQueryForm } from "@/app/api";
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Select from 'react-select'
import { useState } from "react";
const options = [
  { value: "street_address", label: "Address" },
  { value: "email_address", label: "Email" },
  { value: "network_number", label: "Network Number" },
  { value: "install_number", label: "Install Number" },
  { value: "bin", label: "BIN" }
]

import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

import styles from './QueryForm.module.scss'

import { useState } from "react";


export function QueryForm() {
  async function sendForm(event: FormData) {
    try {
      setQueryComplete(true);
      let query_type = event.get('query_type');
      let data = event.get(query_type);
      let route;
      switch(query_type) {
        case 'email_address':
          route = 'member';
          break;
        case 'street_address':
        case 'bin':
          route = 'building';
          break;
        case 'install_number':
        case 'network_number':
          route = 'install';
          break;
      }
      console.log(route);
      console.log(query_type);
      console.log(data);
      let resp = await submitQueryForm(route, query_type, data);
      toast.success('Success!', {
        hideProgressBar: true,
      });
      console.log(resp);
      setQueryResult(resp);
    } catch (e) {
      console.log("Could not submit Query Form: ");
      console.log(e);
      toast.error('Sorry, an error occurred.', {
        hideProgressBar: true,
        theme: "colored",
      });
      setQueryComplete(false);
      return;
    }
  }

  const initialState = {};
  // const [state, formAction] = useFormState(createTodo, initialState);
  const router = useRouter()
  const [queryComplete, setQueryComplete] = useState(false);
  const [queryType, setQueryType] = useState('select_query_type');
  const [queryLabel, setQueryLabel] = useState('Select Query Type');

  const [queryResult, setQueryResult] = useState(
[
    {
      "install_number": -1,
      "street_address": "",
      "city": "",
      "state": "",
      "zip_code": "",
      "unit": "",
      "name": "",
      "email_address": "",
      "notes": "",
      "network_number": -1,
      "install_status": -1
    }
  ]
    );

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    { field: "install_number" },
    { field: "street_address" },
    { field: "city" },
    { field: "state" },
    { field: "zip_code" },
    { field: "unit" },
    { field: "name" },
    { field: "email_address" },
    { field: "notes" },
    { field: "network_number" },
    { field: "install_status" },
  ]);

  return <>
    <div className={styles.formBody}>
      <form action={sendForm}>
        <h2>MeshDB Query</h2>
        <p>This is for installers to query our database. This is password protected.</p>
        <br/>
          <Select 
            name="query_type"
            placeholder="Query Type"
            options={options}
            className={styles.drop}
            onChange={(selected) => {
              setQueryType(selected.value);
              setQueryLabel(selected.label);
            }}
          />
          <div className={styles.horizontal}>
            <input type="text" name={queryType} placeholder={queryLabel} required />
            {/* TODO: <input type="password" name="password" placeholder="Password" required />*/}
          </div>
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
    </div>
    <div className={styles.queryResultTable}>
      <div className={styles.agThemeMesh + "ag-theme-quartz"} style={{height: '500px', width: '100%', overflow: 'auto'}}>
        <AgGridReact rowData={queryResult} columnDefs={colDefs} />
      </div>
    </div>
    <ToastContainer />
  </>
}
