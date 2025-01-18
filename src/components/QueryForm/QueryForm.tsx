"use client";

import { submitQueryForm } from "@/lib/api";
import { QueryFormInput, QueryFormResponse } from "@/lib/io";
import Button from "@mui/material/Button";
import { toastErrorMessage } from "@/components/toastErrorMessage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Select from "react-select";
import { useState, useMemo, FormEvent, useEffect } from "react";
const options = [
  { value: "street_address", label: "Address" },
  { value: "email_address", label: "Email" },
  { value: "network_number", label: "Network Number (NN)" },
  { value: "install_number", label: "Install Number (#)" },
  { value: "bin", label: "BIN" },
  { value: "name", label: "Member Name" },
];

import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import { ColDef, GridOptions } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

import styles from "./QueryForm.module.scss";
import { getMeshDBAPIEndpoint } from "@/lib/endpoint";
import { useEnvContext } from "@/lib/EnvProvider";
import { useIsDeveloper } from "@/lib/AckDevProvider";

export function QueryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tableVisible, setTableVisible] = useState(true);
  const [legacyQueryResults, setLegacyQueryResults] = useState<
    QueryFormResponse["results"]
  >([]);
  const [queryLabel, setQueryLabel] = useState("Select Query Type");
  const [queryResult, setQueryResult] = useState<unknown>([]);
  const [meshDBUrl, setMeshDBUrl] = useState<string>("");

  const env = useEnvContext();
  const [isDeveloper, showIsDeveloperDialog] = useIsDeveloper();
  if (env?.includes("dev") && !isDeveloper) {
    showIsDeveloperDialog();
  }

  function parseForm(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const data: Record<string, string | Blob> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    return QueryFormInput.parse(data);
  }

  // TODO: Check if we need to log in the user
  async function sendForm(event: FormEvent<HTMLFormElement>) {
    // Clear previous query results
    setLegacyQueryResults([]);
    setQueryResult([]);

    event.preventDefault();
    setIsLoading(true);
    console.log(event);
    try {
      const queryForm: QueryFormInput = parseForm(event);
      let route: string = "";

      switch (queryForm.query_type) {
        case "email_address":
        case "name":
          route = "members";
          break;
        case "street_address":
          console.log(queryForm.data);
          if (!isNaN(Number(queryForm.data))) {
            console.log("Parsing as zip");
            queryForm.query_type = "zip_code";
          }
        case "bin":
          route = "buildings";
          break;
        case "install_number":
        case "network_number":
          route = "installs";
          break;
      }
      console.log(queryForm);
      let resp = await submitQueryForm(
        route,
        queryForm.query_type,
        queryForm.data,
      );
      console.log("response is:");
      console.log(resp);

      // If the query was empty, complain and bail
      if (resp.results.length === 0) {
        toast.warning("Query returned no results.", {
          hideProgressBar: true,
        });
        setIsLoading(false);
        return;
      }

      // Crappy hack to change `Request Received` to `-`
      resp.results = resp.results.map((obj) => {
        if (obj.status === "Request Received") {
          return { ...obj, status: "-" };
        } else {
          return obj;
        }
      });

      // Check if we wanna use the legacy query form
      if (queryForm.legacy === "on") {
        setLegacyQueryResults(resp.results);
        setTableVisible(false);
      } else {
        setTableVisible(true);
        setQueryResult(resp.results);
      }

      // Notify user of success
      toast.success("Success!", {
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

  useEffect(() => {
    (async () => {
      setMeshDBUrl(await getMeshDBAPIEndpoint());
    })();
  }, [setMeshDBUrl]);

  // Column Definitions: Defines & controls grid columns.
  const colDefs: ColDef[] = useMemo(
    () => [
      {
        field: "install_number",
        headerName: "Install #",
        cellRenderer: (props: any) => {
          return (
            <a href={`${meshDBUrl}/admin/meshapi/install/?q=${props.value}`}>
              {props.value}
            </a>
          );
        },
      },
      { field: "street_address", headerName: "Address" },
      { field: "unit", headerName: "Unit" },
      { field: "city", headerName: "City" },
      { field: "state", headerName: "State" },
      { field: "zip_code", headerName: "Zip" },
      { field: "name", headerName: "Member Name" },
      {
        field: "phone_number",
        headerName: "Phone Number",
        cellRenderer: (props: any) => {
          return <a href={`tel:${props.value}`}>{props.value}</a>;
        },
      },
      {
        field: "primary_email_address",
        headerName: "Email",
        cellRenderer: (props: any) => {
          return <a href={`mailto:${props.value}`}>{props.value}</a>;
        },
      },
      {
        field: "stripe_email_address",
        headerName: "Stripe Email",
        cellRenderer: (props: any) => {
          return <a href={`mailto:${props.value}`}>{props.value}</a>;
        },
      },
      {
        field: "additional_email_addresses",
        headerName: "Additional Email(s)",
        editable: true,
        cellEditor: "agLargeTextCellEditor",
        cellEditorPopup: true,
        /*cellEditorPopupPosition: 'over' as 'over',*/
      },
      {
        field: "network_number",
        headerName: "NN",
        cellRenderer: (props: any) => {
          return (
            <a href={`${meshDBUrl}/admin/meshapi/node/?q=${props.value}`}>
              {props.value}
            </a>
          );
        },
      },
      { field: "status", headerName: "Node Status" },
      { field: "status", headerName: "Install Status" },
      { field: "notes", headerName: "Notes", width: 400 },
    ],
    [meshDBUrl],
  );

  // a default column definition with properties that get applied to every column
  const defaultColDef: ColDef = useMemo(() => {
    return {
      editable: true,
      cellEditor: "agLargeTextCellEditor",
      cellEditorPopup: true,
      cellEditorPopupPosition: "over",
      resizable: true,
    };
  }, []);

  let exceptNotes: string[] = colDefs
    .map((x) => (x.field != undefined ? x.field : ""))
    .filter((x) => x !== "notes");

  const gridOptions: GridOptions = {
    autoSizeStrategy: {
      type: "fitCellContents",
      colIds: exceptNotes,
    },
  };

  return (
    <>
      <div className={styles.formBody}>
        <form onSubmit={sendForm}>
          <h2>MeshDB Query</h2>
          <p>
            This is for installers to query our database. This is password
            protected.
          </p>
          <br />
          <Select
            name="query_type"
            placeholder="Query Type"
            options={options}
            className={styles.drop}
            onChange={(selected) => {
              selected ? setQueryLabel(selected.label) : null;
            }}
          />
          <div className={styles.horizontal}>
            <input type="text" name="data" placeholder={queryLabel} required />
          </div>
          <div className={styles.centered}>
            <label>
              <input type="checkbox" name="legacy" />
              Use legacy join form format
            </label>
            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              size="large"
              sx={{ width: "12rem", fontSize: "1rem", m: "1rem" }}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>

      <div
        hidden={tableVisible}
        style={{ fontFamily: "monospace", fontSize: "12px", width: "100%" }}
      >
        <strong>
          Install # / Address / City / State / ZIP / Unit / Name / Email Address
          / Stripe Email / Phone / NN / Node Status / Install Status
        </strong>
        <ul style={{ listStyleType: "none" }}>
          {legacyQueryResults.map((r, key) => {
            return (
              <li>
                {r.install_number}, {r.street_address}, {r.city}, {r.state},{" "}
                {r.zip_code}, {r.unit ?? ""}, {r.name},{" "}
                <a href={"mailto:" + r.primary_email_address}>
                  {r.primary_email_address}
                </a>
                ,{" "}
                <a href={"mailto:" + r.stripe_email_address}>
                  {r.stripe_email_address}
                </a>
                , <a href={"tel:" + r.phone_number}>{r.phone_number}</a>,{" "}
                {r.network_number}, {r.network_number_status}, {r.status}
              </li>
            );
          })}
        </ul>
      </div>
      <div hidden={!tableVisible}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Double-click to select/expand. Scroll for more.
        </h2>
        <div className={styles.queryResultTableContainer}>
          <div id="queryResultTable" className={styles.queryResultTable}>
            <div
              className={"ag-theme-quartz"}
              style={{ minHeight: "400px", overflow: "auto" }}
            >
              <AgGridReact
                domLayout={"print"}
                rowData={queryResult as any[]}
                columnDefs={colDefs as any[]}
                defaultColDef={defaultColDef}
                enableCellTextSelection={true}
                gridOptions={gridOptions}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
