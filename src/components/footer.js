import { linkedInUrl } from "./utilities/site";
import GetCurrentDate from "./utilities/getcurrentdate"

const Footer = () => {
    return (

        <footer className="site-footer">
            <div className="outer-container">
                <div className="inner-width">
                    <div className="primary-contact-info">
                        <p>
                            <i className="fas fa-paper-plane" aria-hidden="true"></i><a href="mailto:hello@billymitchell.dev">hello@billymitchell.dev</a>
                            <br />
                            <i className="fas fa-phone-alt" aria-hidden="true"></i><a href="tel:+14437658265">(443) 765-8265</a><br />
                            <i className="fas fa-file-alt" aria-hidden="true"></i><a href="/files/Billy-Mitchell-Resume.pdf" target="_blank" rel="noreferrer">Resume</a>
                        </p>
                    </div>
                    <div className="external-social-links">
                        <a
                            target="_blank"
                            href={linkedInUrl}
                            rel="noreferrer"
                        >
                            <i className="fab fa-linkedin-in" aria-hidden="true"></i>
                            <span className="visually-hidden">LinkedIn</span>
                        </a>

                        <a target="_blank" href="https://github.com/billymitchell" rel="noreferrer">

                            <i className="fab fa-github" aria-hidden="true"></i>
                            <span className="visually-hidden">GitHub</span>
                        </a>
                    </div>
                    <div className="footer-bottom">
                        <small>
                            Made with <span style={{ color: "red" }}>♥</span> on a rock in
                            space
                            <br />
                            Copyright © <GetCurrentDate /> Billy Mitchell Development
                            <br />
                        </small>
                        <span className="block padding-5">
                            <small>
                                <a href="https://github.com/billymitchell/billy-mitchell-dev-next">
                                    This website code is Open Source!
                                </a>
                            </small>
                        </span>
                    </div>
                </div>
            </div>
        </footer>

    )
}
export default Footer
