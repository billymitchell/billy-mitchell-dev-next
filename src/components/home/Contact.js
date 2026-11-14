import { linkedInUrl } from "../utilities/site"

// Simple contact call-to-action. The header "Contact" link scrolls here (/#contact).
const Contact = () => {
  return (
    <>
      <section
        id="contact"
        className="home-page-section"
      >
        <div className="outer-container">
          <div className="inner-width-600">
            <h2 className="h3">Let&apos;s Work Together</h2>
            <p>
              Have a role or a project in mind? Send me a note and I&apos;ll get
              back to you as soon as I can.
            </p>
            <div className="contact-actions">
              <a className="button button-primary" href="mailto:hello@billymitchell.dev">
                hello@billymitchell.dev
              </a>
              <a
                className="button"
                href="/files/Billy-Mitchell-Resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
              <a
                className="button"
                href={linkedInUrl}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
