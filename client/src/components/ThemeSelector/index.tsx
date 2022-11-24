import useSelectorComponent from "../Selector";
import "./style.scss";
import { THEME } from "../../@types/gallery";
import themeStore from "../../store/theme.store";
import { useEffect, useState } from "react";

export default function ThemeSeletor() {
  const { theme, setTheme } = themeStore();

  return (
    <>
      <div className="select-box">
        <div className="select-box__current" tabIndex={1}>
          <div className="select-box__value">
            <input className="select-box__input" type="radio" id="0" checked={true} />
            <p className="select-box__input-text">{theme}</p>
          </div>
        </div>
        <ul className="select-box__list">
          <li>
            <label
              className="select-box__option"
              onClick={() => {
                setTheme(THEME.DREAM);
              }}
            >
              {THEME.DREAM}
            </label>
          </li>
          <li>
            <label
              className="select-box__option"
              onClick={() => {
                setTheme(THEME.SPRING);
              }}
            >
              {THEME.SPRING}
            </label>
          </li>
          <li>
            <label
              className="select-box__option"
              htmlFor="2"
              onClick={() => {
                setTheme(THEME.SUMMER);
              }}
            >
              {THEME.SUMMER}
            </label>
          </li>
          <li>
            <label
              className="select-box__option"
              htmlFor="2"
              onClick={() => {
                setTheme(THEME.AUTUMN);
              }}
            >
              {THEME.AUTUMN}
            </label>
          </li>
          <li>
            <label
              className="select-box__option"
              htmlFor="3"
              onClick={() => {
                setTheme(THEME.WINTER);
              }}
            >
              {THEME.WINTER}
            </label>
          </li>
        </ul>
      </div>
    </>
  );
}
