"use client"
import React, { useState } from "react";
import { fetchSubmissions } from "@/app/data";
import { Button } from "@mui/material";
import { JoinLogLine, NewJoinLogLine } from "@/app/types";

export function JoinExplorer() {
  const [joinList, setJoinList]: Array<JoinLogLine> = useState([NewJoinLogLine()]);

  async function loadSubmissions() {
    console.log("Chom");
    setJoinList(await fetchSubmissions());

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
