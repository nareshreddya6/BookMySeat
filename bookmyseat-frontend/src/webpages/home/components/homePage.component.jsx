import { useNavigate } from "react-router";
import styles from "../styles/homePage.module.css";
import { Header } from "./header.component";
import { OurVision } from "./vision.component";
import { Footer } from "./footer.component";
export const HomePage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
  return (
    <>
      <Header />
      <div className={styles.homePageContainer}>
        <div className={styles.mainContainer}>
          {/* feature container */}
          <div className={styles.featureContainer}>
            <div className={styles.tagline}>
              <h1>Unlock Productivity, Comfort, and Collaboration</h1>
              <p>"Your Seat Awaits in Our Office Space Booking Platform!"</p>
              <button className={styles.bookNowButton} onClick={handleClick}>
                Get Started
              </button>
            </div>
            <div className={styles.imageContainer}>
              <img src="/assets/Images/chair.png" alt="Chair" />
            </div>
          </div>
          {/* vision message */}
          <OurVision />
        </div>
      </div>
          <Footer />
    </>
  );
};
