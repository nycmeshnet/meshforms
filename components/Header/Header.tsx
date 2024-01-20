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
      </div>
    </>
  }
  