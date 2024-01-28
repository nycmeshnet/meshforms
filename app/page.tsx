import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

import Landing from "@/components/Landing/Landing";
import Image from 'next/image'

export default async function Home() {
  return <>
    <Header/>
    <main>
      {/* TODO: Pretty banner. I have no idea how to do this effectively. This 
        is somebody else's problem because I am a backend programmer.
      <div style={{width: '100%', height: '300px', position: 'relative'}}>
        <Image src='/landing-group-photo-cropped-2.jpg' fill={true} style={{objectFit: 'cover',}}/>
      </div>
      */}
      <Landing/>
    </main>
    <Footer/>
  </>
}
