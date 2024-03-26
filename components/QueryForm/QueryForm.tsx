'use client'

import { QueryFormInput, submitQueryForm } from "@/app/api";
import Button from "@mui/material/Button";
import { toastErrorMessage } from "@/app/utils/toastErrorMessage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Select from 'react-select'
import { useState, useMemo, FormEvent } from "react";
const options = [
  { value: "street_address", label: "Address" },
  { value: "email_address", label: "Email" },
  { value: "network_number", label: "Network Number" },
  { value: "install_number", label: "Install Number" },
  { value: "bin", label: "BIN" }
]

import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import { ColDef } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

import styles from './QueryForm.module.scss'

export function QueryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [queryLabel, setQueryLabel] = useState('Select Query Type');
  const [queryResult, setQueryResult] = useState<unknown>([]);

  function parseForm(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const data: Record< string, string | Blob > = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    return QueryFormInput.parse(data);
  }

  async function sendForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    console.log(event);
    try {
      const queryForm: QueryFormInput = parseForm(event);
      let route: string = '';

      switch(queryForm.query_type) {
        case 'email_address':
          route = 'members';
          break;
        case 'street_address':
          console.log(queryForm.data);
          if (!isNaN(Number(queryForm.data))) {
            console.log("Parsing as zip");
            queryForm.query_type = 'zip_code';
          }
        case 'bin':
          route = 'buildings';
          break;
        case 'install_number':
        case 'network_number':
          route = 'installs';
          break;
      }
      console.log(queryForm);
      const resp = await submitQueryForm(
        route,
        queryForm.query_type,
        queryForm.data,
        queryForm.password
      );
      console.log('response is:');
      console.log(resp);
      if (resp.results.length === 0) {
        toast.warning('Query returned no results.', {
          hideProgressBar: true,
        });
        setIsLoading(false);
        return;
      }
      setQueryResult(resp.results);
      toast.success('Success!', {
        hideProgressBar: true,
      });
      setIsLoading(false);
    } catch (e) {
      console.log("Could not submit Query Form: ");
      console.log(e);
      toastErrorMessage(e);
      setIsLoading(false);
      return;
    }
  }

  // Column Definitions: Defines & controls grid columns.
  const colDefs: ColDef[] = useMemo(() => [
    { field: "install_number", headerName: 'Install #', width: 100 },
    { field: "street_address", headerName: 'Address', width: 250 },
    { field: "unit", headerName: 'Unit', width: 100 },
    { field: "city", headerName: 'City', width: 100 },
    { field: "state", headerName: 'State', width: 80 },
    { field: "zip_code", headerName: 'Zip', width: 80 },
    { field: "name", headerName: 'Member Name', width: 250 },
    { field: "phone_number", headerName: 'Phone Number', width: 250 },
    { field: "primary_email_address", headerName: 'Email', width: 300 },
    { field: "stripe_email_address", headerName: 'Stripe Email', width: 300 },
    { field: "additional_email_addresses", headerName: 'Additional Email(s)', 
        editable: true,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorPopup: true,
        /*cellEditorPopupPosition: 'over' as 'over',*/
    },
    { field: "network_number", headerName: 'NN', width: 80 },
    { field: "status", headerName: 'Install Status', width: 160 },
    { field: "notes",
        headerName: 'Notes',
        width: 400,
    },
  ], []); 
  

// a default column definition with properties that get applied to every column
const defaultColDef: ColDef = useMemo(() => { 
  return {
    width: 200,
    editable: true,
    cellEditor: 'agLargeTextCellEditor',
    cellEditorPopup: true,
    cellEditorPopupPosition: 'over'
  };
}, []);


  return <>
    <div className={styles.formBody}>
      <form onSubmit={sendForm}>
        <h2>MeshDB Query</h2>
        <p>This is for installers to query our database. This is password protected.</p>
        <br/>
          <Select 
            name="query_type"
            placeholder="Query Type"
            options={options}
            className={styles.drop}
            onChange={(selected) => {
              selected? setQueryLabel(selected.label):null;
            }}
          />
          <div className={styles.horizontal}>
            <input type="text" name="data" placeholder={queryLabel} required />
            <input type="password" name="password" placeholder="Password" required />
          </div>
          <div className={styles.centered}>
            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              size="large"
              sx={{ width: "12rem", fontSize: "1rem", m:"1rem"}}
            >
              { isLoading ? "Loading..." : "Submit" }
            </Button>
            <Button
              type="submit"
              value="legacy"
              disabled={isLoading}
              variant="outlined"
              color="info"
              size="large"
              sx={{ width: "12rem", fontSize: "1rem", m:"1rem"}}
            >
              { isLoading ? "Loading..." : "Legacy" }
            </Button>
          </div>
      </form>
    </div>
    <strong>Double-click to select/expand. Scroll for more!</strong>
    <br/>
    <br/>
    <div className={styles.queryResultTable}>
      <div className={"ag-theme-quartz"} style={{ width: '100%', minHeight: '400px', overflow: 'auto'}}>
        <AgGridReact
          domLayout={'print'}
          rowData={queryResult as any[]}
          columnDefs={colDefs as any[]}
          defaultColDef={defaultColDef}
          enableCellTextSelection={true}
        />
      </div>
    </div>
    <ToastContainer />
  </>
}
