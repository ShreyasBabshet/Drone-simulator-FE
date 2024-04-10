import { useState } from "react";
import styles from "./FileUpload.module.scss";

const FileUpload = ({ onFileUpload }) => {
  const [files, setFiles] = useState({});
  let fileReader;

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      setFiles(newFiles);
    }
  };

  const handleFileRead = () => {
    const content = fileReader.result;
    try {
      const contentArray = JSON.parse(content);
      if (Array.isArray(contentArray)) {
        onFileUpload?.(contentArray);
      } else {
        console.error(
          "File content is not in expected format: Array of objects."
        );
      }
    } catch (error) {
      console.error("Error parsing file content:", error);
    }
  };

  const handleUpload = () => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(files[0]);
  };

  return (
    <>
      <section className={styles.container}>
        <p className={styles.text}>Drag and drop your files anywhere or</p>
        <button onClick={handleUpload} type="button" className={styles.button}>
          <span> Upload a file</span>
        </button>
        <input
          className={styles.input}
          type="file"
          accept=".txt"
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
