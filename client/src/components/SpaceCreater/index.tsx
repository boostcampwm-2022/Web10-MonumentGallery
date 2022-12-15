import useSelectorComponent from "../Selector";
import ProgressBar from "../ProgressBar";
import { THEME, THEME_ITEM_LIST } from "../../constants/theme";
import { PeriodType, ThemeType } from "../../@types/gallery";
import { PERIOD_ITEM_LIST } from "../../constants/periods";
import "./style.scss";
const ModalName = {
  create: "갤러리 만들기",
  sync: "갤러리 동기화하기",
};

const ButtonName = {
  create: "생성하기",
  sync: "동기화하기",
};

interface IOnLoadFunction {
  <T>(a: T): void;
}

interface SpaceCreaterProps {
  eventSourceUrl: string;
  onSubmit: (period: PeriodType | null, theme: ThemeType | null) => void;
  onLoad: IOnLoadFunction;
  requested: boolean;
  setRequested: React.Dispatch<React.SetStateAction<boolean>>;
  type?: "create" | "sync";
}

export default function SpaceCreater({
  eventSourceUrl,
  onSubmit,
  onLoad,
  requested,
  setRequested,
  type = "create",
}: SpaceCreaterProps) {
  const [period, PeriodSelectorWrapper, PeriodSelectorItem] = useSelectorComponent<PeriodType>("all");
  const [theme, ThemeSelectorWrapper, ThemeSelectorItem] = useSelectorComponent<ThemeType>(THEME.DREAM);
  return (
    <div className="create-modal">
      <span className="make-gallery">{ModalName[type]}</span>
      <PeriodSelectorWrapper title="기간">
        {PERIOD_ITEM_LIST.map((periodItem) => (
          <PeriodSelectorItem key={`period-item-${periodItem.value}`} value={`${periodItem.value}`}>
            {periodItem.text}
          </PeriodSelectorItem>
        ))}
      </PeriodSelectorWrapper>
      <ThemeSelectorWrapper title="테마">
        {THEME_ITEM_LIST.map((themeItem) => (
          <ThemeSelectorItem
            key={`theme-item-${themeItem.value}`}
            value={`${themeItem.value}`}
            className={`${themeItem.style}`}
          >
            {themeItem.text}
          </ThemeSelectorItem>
        ))}
      </ThemeSelectorWrapper>
      {requested ? (
        <ProgressBar eventSourceUrl={eventSourceUrl} onLoad={onLoad as IOnLoadFunction} />
      ) : (
        <button
          onClick={() => {
            setRequested(true);
            onSubmit(period, theme);
          }}
        >
          {ButtonName[type]}
        </button>
      )}
    </div>
  );
}
