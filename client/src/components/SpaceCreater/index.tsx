import useSelectorComponent from "../Selector";
import SuspenseButton from "../buttons/SuspenseButton";
import styles from "./style.module.scss";

export type PeriodType = "all" | "2w" | "1m" | "3m" | "1y";
export type ThemeType = "dream" | "spring" | "summer" | "autumn" | "winter";

interface SpaceCreaterProps {
  fetcher: { get: () => void } | null;
  onSubmit: (period: PeriodType | null, theme: ThemeType | null) => void;
}

export default function SpaceCreater({ fetcher, onSubmit }: SpaceCreaterProps) {
  const [period, PeriodSelectorWrapper, PeriodSelectorItem] = useSelectorComponent<PeriodType>("all");
  const [theme, ThemeSelectorWrapper, ThemeSelectorItem] = useSelectorComponent<ThemeType>("dream");

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
        <ThemeSelectorItem value="dream" className={styles.dream}>
          꿈
        </ThemeSelectorItem>
        <ThemeSelectorItem value="spring" className={styles.spring}>
          봄
        </ThemeSelectorItem>
        <ThemeSelectorItem value="summer" className={styles.summer}>
          여름
        </ThemeSelectorItem>
        <ThemeSelectorItem value="autumn" className={styles.autumn}>
          가을
        </ThemeSelectorItem>
        <ThemeSelectorItem value="winter" className={styles.winter}>
          겨울
        </ThemeSelectorItem>
      </ThemeSelectorWrapper>
      <SuspenseButton fallback="생성중..." name="생성하기" fetcher={fetcher} onClick={() => onSubmit(period, theme)} />
    </div>
  );
}
