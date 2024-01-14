
import "./Header.css"
import logo from '@/res/logo.svg'

// TODO: Roboto

export function Header() {
    return <>
      <div className="top">
        <div className="logoAndText">
          <img className="logo" src={logo.src} height={512} width={512} alt="" />
          <strong>
              NYC Mesh&nbsp;
          </strong>
          <p className="separator">|</p>
          <p>&nbsp;Forms</p>
        </div>
      </div>
    </>
  }
  