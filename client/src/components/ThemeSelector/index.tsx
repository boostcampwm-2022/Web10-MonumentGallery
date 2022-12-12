import "./style.scss";
import { THEME } from "../../@types/gallery";
import galleryStore from "../../store/gallery.store";
import audioStore from "../../store/audio.store";

export default function ThemeSeletor() {
  const theme = galleryStore((store) => store.theme);
  const setTheme = galleryStore((store) => store.setTheme);
  const setSourceUrl = audioStore((store) => store.setSourceUrl);
  const themeList = [THEME.DREAM, THEME.SPRING, THEME.SUMMER, THEME.AUTUMN, THEME.WINTER];

  return (
    <div className="theme-select-box">
      <div className="theme-select-box__current" tabIndex={0}>
        <div className="theme-select-box__value">
          <input className="theme-select-box__input" type="radio" id="0" defaultChecked />
          <p className="theme-select-box__input-text">{theme}</p>
        </div>
      </div>
      <ul className="theme-select-box__list">
        {themeList.map((themeItem) => {
          return (
            <li key={themeItem}>
              <label
                className="theme-select-box__option"
                onClick={() => {
                  setTheme(themeItem);
                  setSourceUrl(themeItem);
                }}
              >
                {themeItem}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
