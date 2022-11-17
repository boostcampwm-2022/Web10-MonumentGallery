import useSelectorComponent from "../Selector";
import styles from "./style.module.scss";

interface SpaceCreaterProps {
  onSubmit: () => void;
}

export default function SpaceCreater({ onSubmit }: SpaceCreaterProps) {
  const [period, PeriodSelectorWrapper, PeriodSelectorItem] = useSelectorComponent("all");
  const [theme, ThemeSelectorWrapper, ThemeSelectorItem] = useSelectorComponent("dream");

  return (
    <div className="create-modal">
      <span className="make-gallery">갤러리 만들기</span>
      <PeriodSelectorWrapper title="기간">
        <PeriodSelectorItem value="all">전체</PeriodSelectorItem>
        <PeriodSelectorItem value="14day">14일</PeriodSelectorItem>
        <PeriodSelectorItem value="1month">1개월</PeriodSelectorItem>
        <PeriodSelectorItem value="3month">3개월</PeriodSelectorItem>
        <PeriodSelectorItem value="1year">1년</PeriodSelectorItem>
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
      <div>{period}</div>
      <div>{theme}</div>
      <button type="button" onClick={onSubmit}>
        <span>생성하기</span>
      </button>
    </div>
  );
}
