"use client"
import InViewAnimationTwo from "../utilities/InViewAnimationTwo.js";
//import { Parallax } from "react-scroll-parallax"

export default function Companies({ children }) {
  return (
    <>
      <section id="companies" className="home-page-section">
        <div className="outer-container">
          <div className="inner-width-1000">
            {/* <Parallax disabled={parallaxDisabledState} y={[-30, 30]} x={[0, 0]}> */}
            <InViewAnimationTwo
              rootMargin="-25% 0%"
              className="init-invisible" animation={undefined} duration={undefined} delay={undefined} fillmode={undefined} easing={undefined} iteration={undefined} threshold={undefined}            >
              <h2 className="h3 margin-top-0">Businesses I&apos;ve Worked With</h2>
            </InViewAnimationTwo>
            <InViewAnimationTwo
              rootMargin="-25% 0%"
              className="init-invisible"
              delay="delay-250ms" animation={undefined} duration={undefined} fillmode={undefined} easing={undefined} iteration={undefined} threshold={undefined}            >
              <p>
                Teams and clients I&apos;ve worked with in developer, designer, and freelance roles.
              </p>
            </InViewAnimationTwo>
              <div className="company-logos" >
                {children}
              </div>
          </div>
        </div>
      </section>
    </>
  )
}
