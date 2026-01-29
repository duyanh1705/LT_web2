import { BlobProvider } from "@react-pdf/renderer";
import { useRecordContext } from "react-admin";
import MyDocument from "./MyDocument";
import { HiOutlinePrinter } from "react-icons/hi";

const PDFButton = () => {
  const record = useRecordContext();

  if (!record) return null;

  const styles = {
    btn: {
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 10px",
      fontSize: "12px",
      color: "#ffd700",
      fontWeight: 700,
      cursor: "pointer",
      backgroundColor: "transparent",
      textDecoration: "none",
    } as React.CSSProperties,
  };

  return (
    <BlobProvider document={<MyDocument data={record} />}>
      {({ url }) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={styles.btn}
          >
            <HiOutlinePrinter size={17} />
            <span>PRINT</span>
          </a>
        ) : null
      }
    </BlobProvider>
  );
};

export default PDFButton;
