import "./sample.scss";
import SampleImg from "../assets/sample.png";

export default function Sample() {
  return (
    <>
      <div className="sample">
        <img src={SampleImg} />
        <span className="test">Hey Harvard!</span>
      </div>
    </>
  );
}
