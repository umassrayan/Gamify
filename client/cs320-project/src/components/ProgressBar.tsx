type ProgressBarProps = {
  progress: number; // 0 to 100
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div>
    <div
      style={{
        fontWeight: "bold",
        margin: "40px",
        textAlign: "center",
      }}
    >
      {progress}%
    </div>
    <div
      style={{
        height: "75vh",
        width: "35px",
        backgroundColor: "#e0e0e0",
        borderRadius: "20px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        marginLeft: "40px",
        marginTop: "-10px",
      }}
    >
      <div
        style={{
          height: `${progress}%`,
          width: "100%",
          backgroundColor: "#6D5A4F",
          transition: "height 0.3s ease-in-out",
          borderRadius: "20px",
        }}
      />
    </div>
  </div>
);

export default ProgressBar;
