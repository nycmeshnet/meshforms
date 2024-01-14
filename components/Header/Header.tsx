
import "./Header.css"
import logo from '@/res/logo.svg'

// TODO: Roboto

export function Header() {
    return <>
      <div className="top">
      <img className="logo" src={logo.src} height={512} width={512} alt="" />
        <h1>
            NYC Mesh
        </h1>
      </div>
    </>
  }
  