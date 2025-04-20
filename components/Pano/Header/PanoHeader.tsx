import React, { useEffect } from "react";
import styles from "./PanoHeader.module.scss";

export default function PanoHeader() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState("");
  useEffect(() => {
    // Check if we're logged into pano
    fetch(`http://127.0.0.1:8081/userinfo`, {
      credentials: "include",
    }).then(async (response) => {
      const j = await response.json();
      if (response.status === 200) {
        console.log("You're logged in");
        setUser(j.name);
        setIsLoggedIn(true);
        return;
      }
      setUser("");
      setIsLoggedIn(false);
    });
  }, []);

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
            className={`${!isLoggedIn ? styles.disabled : ""}`}
          >
            <img src="/upload_icon.png" width={24} />
          </a>
          {isLoggedIn && (
            <p>
              {user} (<a href="http://127.0.0.1:8081/logout">Logout</a>)
            </p>
          )}
          {!isLoggedIn && (
            <a href="http://127.0.0.1:8081/login/google">
              <p>Log In</p>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
