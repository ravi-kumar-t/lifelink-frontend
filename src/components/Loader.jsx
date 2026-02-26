import "./Loader.css";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader-content">
        <div className="loader-ring">
          <div></div>
          <div></div>
        </div>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
};

export default Loader;