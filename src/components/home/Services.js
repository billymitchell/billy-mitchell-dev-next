"use client";
import React from "react";
import useParallaxDisabled from "../utilities/useParallaxDisabled";
import InViewAnimationTwo from "../utilities/InViewAnimationTwo.js";
import ParallaxWrapper from "../utilities/ParallaxProviderWrapper";

export default function Services({ children }) {
  const parallaxDisabledState = useParallaxDisabled();

  return (
    <>
      <section
        id="services"
        className="home-page-section"
      >
        <div className="outer-container">
          <div className="inner-width-1000">
            <ParallaxWrapper disabled={parallaxDisabledState} y={[-30, 30]} x={[0, 0]}>
              <InViewAnimationTwo
                rootMargin="-25% 0%"
                delay="delay-0ms"
                className="init-invisible"
              >
                <h2 className="h3">Developer Services</h2>
              </InViewAnimationTwo>
              <div className="services-container grid-container col-3 small-col-1">
                {children}
              </div>
            </ParallaxWrapper>
          </div>
        </div>
      </section>
    </>
  );
}
