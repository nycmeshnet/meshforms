import logo from '@/res/logo.svg'

import styles from './Header.module.scss'

export function Header() {
    return <>
      <div className={styles.top}>
        <div className={styles.logoAndText}>
          <img className={styles.logo} src={logo.src} height={512} width={512} alt="" />
          <strong>
              NYC Mesh&nbsp;
          </strong>
          <p className="separator">|</p>
          <p>&nbsp;Forms</p>
        </div>

        <div >
          <ul className={styles.navBarItems}>
            <li className="nav-item">
              <a className="nav-link" href="https://nycmesh.net/map">Map</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://nycmesh.net/faq">FAQ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://nycmesh.net/docs">Docs</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://nycmesh.net/blog">Blog</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://nycmesh.net/support"
                >Get Support</a
              >
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://nycmesh.net/donate">Donate</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://nycmesh.net/join"
                >Get Connected</a
              >
            </li>
          </ul>
        </div>
      </div>
    </>
  }
  