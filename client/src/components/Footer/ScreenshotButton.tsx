import ScreenShotIcon from "../../assets/images/screenshot.svg";
export default function ScreenshotButton() {
  return (
    <button
      type="button"
      className="footer-element"
      onClick={(e) => {
        document.dispatchEvent(new CustomEvent("save-screenshot"));
        e.currentTarget.blur();
      }}
    >
      <img width={24} height={24} src={ScreenShotIcon} alt="screenshot" />
    </button>
  );
}
