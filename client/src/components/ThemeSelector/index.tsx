import "./style.scss";
import { THEME } from "../../@types/gallery";
import galleryStore from "../../store/gallery.store";
import audioStore from "../../store/audio.store";

export default function ThemeSeletor() {
  const theme = galleryStore((store) => store.theme);
  const setTheme = galleryStore((store) => store.setTheme);
  const setSourceUrl = audioStore((store) => store.setSourceUrl);

  return (
    <div className="theme-select-box">
      <div className="theme-select-box__current" tabIndex={1}>
        <div className="theme-select-box__value">
          <input className="theme-select-box__input" type="radio" id="0" defaultChecked />
          <p className="theme-select-box__input-text">{theme}</p>
        </div>
      </div>
      <ul className="theme-select-box__list">
        <li>
          <label
            className="theme-select-box__option"
            onClick={() => {
              setTheme(THEME.DREAM);
              setSourceUrl(THEME.DREAM);
            }}
          >
            {THEME.DREAM}
          </label>
        </li>
        <li>
          <label
            className="theme-select-box__option"
            onClick={() => {
              setTheme(THEME.SPRING);
              setSourceUrl(THEME.SPRING);
            }}
          >
            {THEME.SPRING}
          </label>
        </li>
        <li>
          <label
            className="theme-select-box__option"
            htmlFor="2"
            onClick={() => {
              setTheme(THEME.SUMMER);
              setSourceUrl(THEME.SUMMER);
            }}
          >
            {THEME.SUMMER}
          </label>
        </li>
        <li>
          <label
            className="theme-select-box__option"
            htmlFor="2"
            onClick={() => {
              setTheme(THEME.AUTUMN);
              setSourceUrl(THEME.AUTUMN);
            }}
          >
            {THEME.AUTUMN}
          </label>
        </li>
        <li>
          <label
            className="theme-select-box__option"
            htmlFor="3"
            onClick={() => {
              setTheme(THEME.WINTER);
              setSourceUrl(THEME.WINTER);
            }}
          >
            {THEME.WINTER}
          </label>
        </li>
      </ul>
    </div>
  );
}
