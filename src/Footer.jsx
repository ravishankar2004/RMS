import React from "react";

function Footer() {
  return (
    <div>
      <style>
        {`
          .footer {
            background-color: #e0e0c0;
            border-top: 1px solid #d2b48c;
            padding: 20px 0;
            position: relative;
          }
          .footer__container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            flex-wrap: wrap; /* Allow items to wrap on small screens */
          }
          .footer__links {
            list-style-type: none;
            padding: 0;
            margin: 0;
          }
          .footer__copy {
            font-size: 14px;
            color: #6b4423;
          }
          .footer__social {
            display: flex;
            justify-content: center;
            gap: 15px;
            max-width: 300px;
            width: 100%;
          }
          .footer__social-link img {
            width: 25px;
          }

          /* Responsive Styling */
          @media (max-width: 768px) {
            .footer__container {
              flex-direction: column; /* Stack items vertically */
              align-items: center;
              text-align: center;
              gap:0px 
            }
            .footer__social {
              margin-top: 15px;
              justify-content: center; /* Center social icons */
            }
            .footer__social-link img {
              width: 30px; /* Slightly larger icons on smaller screens */
            }
            .footer__copy {
              margin-top: 10px;
            }
          }

          @media (max-width: 480px) {
            .footer__social {
              gap: 10px; /* Reduce gap between icons on very small screens */
            }
            .footer__copy {
              font-size: 12px; /* Adjust font size for smaller screens */
            }
          }
        `}
      </style>
      <footer className="footer">
        <div className="footer__container">
          <span style={{ fontWeight: "bold", fontSize: "18px", color: "#6b4423" }}>Conet</span>

          <ul className="footer__links">
            <span className="footer__copy" style={{ fontSize: "14px", color: "#6b4423" }}>
              &#169; Conet 2024. All rights reserved
            </span>
          </ul>

          <div className="footer__social">
            <a
              href="https://www.linkedin.com/in/Ravi-Shankar-Linkdein/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
            >
              <img src="linkedin.png" alt="Ravi" />
            </a>

            <a
              href="https://www.linkedin.com/in/giri-venkat-kadamati-1a5729266/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
            >
              <img src="linkedin.png" alt="Giri" />
            </a>

            <a
              href="https://www.linkedin.com/in/sailesh-pulukuri/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
            >
              <img src="linkedin.png" alt="Sailesh" />
            </a>

            <a
              href="https://www.linkedin.com/in/likithpyneni1/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
            >
              <img src="linkedin.png" alt="Likith" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
