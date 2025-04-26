import React, { useEffect } from "react";
import styles from "./PanoHeader.module.scss";

interface PanoHeaderProps {
  user: string;
  panoEndpoint: string;
}

export default function PanoHeader({ user, panoEndpoint }: PanoHeaderProps) {
  return (
    <>
      <div className={styles.panoHeader}>
        <a
          href="/pano/view"
          style={{
            display: "flex",
            flexDirection: "row",
            textDecoration: "none",
            color: "black",
          }}
        >
          <img src="/pano.png" height={72} />
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Pano</p>
        </a>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <a
            href={"/pano/upload"}
            style={{ padding: "10px" }}
            className={`${user === "" ? styles.disabled : ""}`}
          >
            <img src="/upload_icon.png" width={24} />
          </a>
          {user !== "" && (
            <p>
              {user} (<a href={`${panoEndpoint}/logout`}>Logout</a>)
            </p>
          )}
          {user === "" && (
            <a href={`${panoEndpoint}/login/google`}>
              <p>Log In</p>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
