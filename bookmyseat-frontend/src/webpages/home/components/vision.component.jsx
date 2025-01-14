import styles from "../styles/vision.module.css"

export const OurVision = () => {
  return (
    <>
    {/* vision main container */}
      <div id="vision" className={styles.ourVision}>
        <div className={styles.imageContainer}></div>
        <div className={styles.visionMessage}>
          <h3>Revolutionize your workspace with effortless seat booking!</h3>
          <p>
            Welcome to the future of office productivity and collaboration. Say
            goodbye to the days of hunting for an available desk or meeting
            room. Our intuitive seat booking platform empowers you to reserve
            your ideal workspace with just a few clicks. Whether you prefer a
            cozy corner for focused work or a vibrant space for team
            brainstorming sessions, we've got you covered. Elevate your office
            experience and unlock unparalleled efficiency with our seamless seat
            booking solution. Join us and experience the future of work today!
          </p>
        </div>
      </div>
    </>
  );
}