"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { QueryFormInput, QueryFormResponse, submitQueryForm } from "@/app/api";
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from "react-error-boundary";
import { toastErrorMessage } from "@/app/utils/toastErrorMessage";
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

export function QueryForm() {

  function parseForm(event: FormData) {
    const data: Record< string, string | Blob > = {};
    event.forEach((value, key) => {
      data[key] = value;
    });

    return QueryFormInput.parse(data);
  }

  async function sendForm(event: FormData) {
    try {
      setQueryComplete(true);
      const queryForm: QueryFormInput = parseForm(event);
      let route: string = '';

      switch(queryForm.query_type) {
        case 'email_address':
          route = 'member';
          break;
        case 'street_address':
          console.log(queryForm.data);
          if (!isNaN(Number(queryForm.data))) {
            console.log("Parsing as zip");
            queryForm.query_type = 'zip_code';
          }
        case 'bin':
          route = 'building';
          break;
        case 'install_number':
        case 'network_number':
          route = 'install';
          break;
      }
      console.log(queryForm);
      let resp = await submitQueryForm(
        route,
        queryForm.query_type,
        queryForm.data,
        queryForm.password
      );
      console.log(resp);
      if (resp.length === 0) {
        toast.warning('Query returned no results.', {
          hideProgressBar: true,
        });
        return
      }
      toast.success('Success!', {
        hideProgressBar: true,
      });
      setQueryResult(resp);
    } catch (e) {
      console.log("Could not submit Query Form: ");
      console.log(e);
      toastErrorMessage(e);
      setQueryComplete(false);
      return;
    }
  }

  const initialState = {};
  const router = useRouter()
  const [queryComplete, setQueryComplete] = useState(false);
  const [queryType, setQueryType] = useState('select_query_type');
  const [queryLabel, setQueryLabel] = useState('Select Query Type');

  const [queryResult, setQueryResult] = useState<unknown>([]);
 
  const showLineBreaks = ({ value }) => {
    // Replace newline characters with <br> for HTML rendering
    const formattedValue = value.replace(/\n/g, '<br>');

    return <div dangerouslySetInnerHTML={{ __html: formattedValue }} />;
  };

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    { field: "install_number", headerName: 'Install #' },
    { field: "street_address", headerName: 'Address' },
    { field: "unit", headerName: 'Unit' },
    { field: "city", headerName: 'City' },
    { field: "state", headerName: 'State' },
    { field: "zip_code", headerName: 'Zip' },
    { field: "name", headerName: 'Member Name' },
    { field: "email_address", headerName: 'Email' },
    { field: "stripe_email_address", headerName: 'Stripe Email' },
    { field: "secondary_emails", headerName: 'Secondary Email(s)' },
    { field: "network_number", headerName: 'Network Number' },
    { field: "install_status", headerName: 'Install Status' },
    { field: "notes", headerName: 'Notes', width: 800, wrapText: true, autoHeight: true, },
  ]); 

  // a default column definition with properties that get applied to every column
  const defaultColDef = useState(() => { 
      return {
          // set every column width
          width: 100,
      };
  }, []);

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
              selected? setQueryType(selected.value):null;
              selected? setQueryLabel(selected.label):null;
            }}
          />
          <div className={styles.horizontal}>
            <input type="text" name="data" placeholder={queryLabel} required />
            <input type="password" name="password" placeholder="Password" required />
          </div>
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
    </div>
    <strong>Scroll for more!</strong>
    <br/>
    <br/>
    <div className={styles.queryResultTable}>
      <div className={"ag-theme-quartz"} style={{ width: '100%', overflow: 'auto'}}>
        <AgGridReact domLayout={'print'} rowData={queryResult as any[]} defaultColDef={defaultColDef} columnDefs={colDefs as any[]} enableCellTextSelection={true}  />
      </div>
    </div>
    <ToastContainer />
  </>
}
