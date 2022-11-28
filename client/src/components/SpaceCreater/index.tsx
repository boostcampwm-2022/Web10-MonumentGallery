import useSelectorComponent from "../Selector";
import SuspenseButton from "../buttons/SuspenseButton";
import styles from "./style.module.scss";
import { Resource } from "../../utils/suspender";
import { THEME } from "../../@types/gallery";
import themeStore from "../../store/theme.store";

export type PeriodType = "all" | "2w" | "1m" | "3m" | "1y";

interface IOnLoadFunction {
  <T>(a: T): void;
}

interface SpaceCreaterProps {
  resource: Resource | null;
  onSubmit: (period: PeriodType | null, theme: THEME | null) => void;
  onLoad: IOnLoadFunction;
}

export default function SpaceCreater({ resource, onSubmit, onLoad }: SpaceCreaterProps) {
  const [period, PeriodSelectorWrapper, PeriodSelectorItem] = useSelectorComponent<PeriodType>("all");
  const [theme, ThemeSelectorWrapper, ThemeSelectorItem] = useSelectorComponent<THEME>(THEME.DREAM);
  const { setTheme } = themeStore();
  return (
    <div className="create-modal">
      <span className="make-gallery">갤러리 만들기</span>
      <PeriodSelectorWrapper title="기간">
        <PeriodSelectorItem value="all">전체</PeriodSelectorItem>
        <PeriodSelectorItem value="2w">14일</PeriodSelectorItem>
        <PeriodSelectorItem value="1m">1개월</PeriodSelectorItem>
        <PeriodSelectorItem value="3m">3개월</PeriodSelectorItem>
        <PeriodSelectorItem value="1y">1년</PeriodSelectorItem>
      </PeriodSelectorWrapper>
      <ThemeSelectorWrapper title="테마">
        <ThemeSelectorItem value={THEME.DREAM} className={styles.dream}>
          꿈
        </ThemeSelectorItem>
        <ThemeSelectorItem value={THEME.SPRING} className={styles.spring}>
          봄
        </ThemeSelectorItem>
        <ThemeSelectorItem value={THEME.SUMMER} className={styles.summer}>
          여름
        </ThemeSelectorItem>
        <ThemeSelectorItem value={THEME.AUTUMN} className={styles.autumn}>
          가을
        </ThemeSelectorItem>
        <ThemeSelectorItem value={THEME.WINTER} className={styles.winter}>
          겨울
        </ThemeSelectorItem>
      </ThemeSelectorWrapper>
      <SuspenseButton
        fallback="생성중..."
        name="생성하기"
        resource={resource}
        onClick={() => {
          setTheme(theme);
          onSubmit(period, theme);
        }}
      >
        <Data resource={resource} onLoad={onLoad} />
      </SuspenseButton>
    </div>
  );
}

function Data({ resource, onLoad }: { resource: Resource | null; onLoad: IOnLoadFunction }) {
  const res = resource?.read();
  console.log(res);
  if (!res || res?.error) return <>에러가 발생했습니다.</>;
  onLoad(res.data);
  return null;
}
