"use client";

import Button from '@/components/Button/Button';

import styles from './Landing.module.scss'

const Landing = () => {
  return <>
    <div className={styles.landPage}>
      <div className={styles.speal}>
        <p>
          Welcome to MeshForms! This website contains a handful of tools to help
          our volunteers operate and get new members connected.
        </p>
        <p>
          To get started, pick a form or tool to fill out below.
        </p>
      </div>
      <div className={styles.horizontalize}>
        <div className={styles.bigLink}>
          <a href='/join'><Button>Join Form</Button></a>
        </div>

        <div className={styles.bigLink}>
          <a href='/nn-assign'><Button>NN Assign Form</Button></a>
        </div>

        <div className={styles.bigLink}>
          <a href='/query'><Button>Query Form</Button></a>
        </div>

        <div className={styles.bigLink}>
          <a href={process.env.NEXT_PUBLIC_MESHDB_URL + "/admin/"}><Button>MeshDB Admin</Button></a>
        </div>
      </div>
    </div>
  </>
}

export default Landing
