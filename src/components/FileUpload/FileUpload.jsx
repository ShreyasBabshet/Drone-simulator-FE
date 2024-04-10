import { useState } from "react";
import styles from "./FileUpload.module.scss";

const FileUpload = () => {
  const [files, setFiles] = useState({});

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      setFiles(newFiles);
    }
  };

  return (
    <>
      <section className={styles.container}>
        <p className={styles.text}>Drag and drop your files anywhere or</p>
        <button type="button" className={styles.button}>
          <span> Upload a file</span>
        </button>
        <input
          className={styles.input}
          type="file"
          onChange={handleNewFileUpload}
        />
      </section>
      {files && (
        <section className={styles.file}>
          <p>{files[0]?.name}</p>
        </section>
      )}
    </>
  );
};

export default FileUpload;
