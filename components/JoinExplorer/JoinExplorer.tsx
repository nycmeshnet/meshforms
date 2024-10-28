"use client"
import React, { useState } from "react";
import { fetchSubmissions } from "@/app/data";
import { Button } from "@mui/material";

export function JoinExplorer() {
  const [joinList, setJoinList] = useState([]);

  async function loadSubmissions() {
    console.log("Chom");
    console.log(await fetchSubmissions());
  }

  return (<>
    <Button onClick={loadSubmissions}>Refresh</Button>
    <ul>
      {joinList.map((s) => (
        <li>
          {s}
        </li>
      ))}
    </ul>
  </>);
}
