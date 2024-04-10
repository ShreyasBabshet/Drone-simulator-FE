import styles from "./Form.module.scss";

const Form = ({ formData, handleFormChange, handleSubmit, error }) => {
  const { startLatitude, startLongitude, destLatitude, destLongitude, time } =
    formData;

  return (
    <>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label htmlFor="startLatitude">Start Latitude:</label>
            <input
              type="text"
              id="startLatitude"
              name="startLatitude"
              value={startLatitude}
              onChange={handleFormChange}
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="startLongitude">Start Longitude:</label>
            <input
              type="text"
              id="startLongitude"
              name="startLongitude"
              value={startLongitude}
              onChange={handleFormChange}
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="destLatitude">Destination Latitude:</label>
            <input
              type="text"
              id="destLatitude"
              name="destLatitude"
              value={destLatitude}
              onChange={handleFormChange}
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="destLongitude">Destination Longitude:</label>
            <input
              type="text"
              id="destLongitude"
              name="destLongitude"
              value={destLongitude}
              onChange={handleFormChange}
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="time">Time (in seconds):</label>
            <input
              type="number"
              id="time"
              name="time"
              value={time}
              onChange={handleFormChange}
            />
          </div>
          <button type="submit" className={styles.simulate}>
            Simulate
          </button>
          <p className={styles.error}>{error}</p>
        </form>
      </div>
    </>
  );
};

export default Form;
