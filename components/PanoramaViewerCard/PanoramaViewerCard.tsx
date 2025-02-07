import React from "react";

import styles from "./PanoramaViewerCard.module.scss";

interface PanoramaViewerCardProps {
  originalFilename: string;
  timestamp: string;
  category: string;
  url: string;
}

export default function PanoramaViewerCard({
  originalFilename,
  timestamp,
  category,
  url,
}: PanoramaViewerCardProps) {
  return (
    <React.Fragment>
      <div className={styles.card}>
        <div className={styles.imageMetadata}>
          <ul>
            <li>{originalFilename}</li>
            <li>{timestamp}</li>
            <li>{category}</li>
          </ul>
        </div>
        <div className={styles.image}>
          <img src={url} />
        </div>
      </div>
    </React.Fragment>
  );
}
