import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import styles from "../styles/footer.module.css";
export const Footer = () => {
  return (
    <>
      <div className={styles.footerMainContainer}>
        {/* footer container */}
        <footer>
          <div className={styles.footerContainer}>
            {/* about us container */}
            <div className={styles.aboutUsContainer}>
              <h2>The experience innovation company.</h2>
              <p>We exist to unlock a better way to experience the world.</p>
              <a href="https://www.valtech.com/en-in/about/" target="_blank">
                Know More about us
              </a>
            </div>
            {/* social media links container */}
            <div className={styles.folllowUsContainer}>
              <h2>Follow us on</h2>
              <div className={styles.links}>
                <a
                  href="https://www.linkedin.com/company/valtech"
                  target="_blank"
                >
                  <Linkedin size={40} />
                </a>
                <a
                  href="https://www.instagram.com/valtech_india/"
                  target="_blank"
                >
                  <Instagram size={40} />
                </a>
                <a
                  href="https://www.facebook.com/valtech.india/"
                  target="_blank"
                >
                  <Facebook size={40} />
                </a>
              </div>
            </div>
          </div>
          {/* footer bootom */}
          <div className={styles.footerbottom}>
            <p>&copy; 2024 BookMySeat. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};
