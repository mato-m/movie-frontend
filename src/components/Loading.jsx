import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        color: "#212427",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ClipLoader size={80} />
    </div>
  );
};

export default Loading;
