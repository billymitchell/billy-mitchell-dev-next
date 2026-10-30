'use client';
import Script from 'next/script';
import InViewAnimationTwo from "../utilities/InViewAnimationTwo.js"

const posterUrl = 'https://res.cloudinary.com/billymitchell/image/upload/f_jpg,q_auto,w_1280,c_limit/home/ezgif-1-4acdfd5cf4_opvc85';

const Homesplash = () => {
  return (
    <div className="video-wrapper-home">
      <img
        className="homepage-poster"
        src={posterUrl}
        alt=""
        fetchPriority="high"
        decoding="async"
      />
      <video
        className="homepage-video-file"
        crossOrigin="anonymous"
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
        preload="metadata"
        aria-hidden="true"
        id="homepage-video-file"
      >
        <source
          media="(max-width: 700px)"
          src="https://res.cloudinary.com/billymitchell/video/upload/f_auto,vc_auto,q_auto:eco,w_720,c_limit/home/Billy-Mitchell-Design-Home-Video_zgl0dp"
        ></source>
        <source
          src="https://res.cloudinary.com/billymitchell/video/upload/f_auto,vc_auto,q_auto:eco,w_1280,c_limit/home/Billy-Mitchell-Design-Home-Video_zgl0dp"
        ></source>
      </video>
      <Script
        src="https://unpkg.com/@lottiefiles/lottie-player@0.4.0/dist/lottie-player.js"
        strategy="lazyOnload"
      />
      <lottie-player
        src="https://assets4.lottiefiles.com/private_files/lf30_xRpJ98.json"
        background="transparent"
        speed="1"
        autoplay
      ></lottie-player>
      <div className="overlay-content">
        <div className="outer-container">
          <div className="inner-width">
            <InViewAnimationTwo
              className="init-invisible"
            >
              <h1 className="text-center">Billy Mitchell</h1>
            </InViewAnimationTwo>
            <InViewAnimationTwo
              delay="delay-250ms"
              className="init-invisible"
            >
              <h2 className="text-center">Multidisciplinary Developer</h2>
            </InViewAnimationTwo>
          </div>
        </div>
      </div>
      <div className="scroll-down-overlay">
        <img
          alt="down arrow"
          className="scroll-down"
          src="https://res.cloudinary.com/billymitchell/image/upload/f_auto,q_auto,w_60/v1600977106/home/Scrolldown-white_b7xo4m.gif"
        ></img>
      </div>
    </div>
  )
}
export default Homesplash
