"use client"
import React, { useState } from "react";
import { fetchSubmissions } from "@/app/data";

export async function JoinExplorer() {
  const [submissionList, setSubmissionList] = useState({});
  const submissions = await fetchSubmissions();
  setSubmissionList(submissions);


  return (<>
    <ul>
      {submissionList.map((s) => (
        <li>
          {s.json()}
        </li>
      ))}
    </ul>
  </>);
}
