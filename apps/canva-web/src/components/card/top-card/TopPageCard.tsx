'use client';

import styles from './TopPageCard.module.css';
import UnderlineIcon from '../../icons/UnderlineIcon';
import CardBackgroundIcon from '../../icons/CardBackgroundIcon';

type Props = {
  title: string;
  subTitle: string;
  searchBox: React.ReactNode;
};

export default function TopPageCard({ title, subTitle, searchBox }: Props) {
  return (
    <div className={`${styles.card} w-full p-4 border border-gray-200 rounded-xl shadow-xs sm:p-8 mb-8`}>
      <div className={`${styles.cardBackground} rounded-xl`}>
        <div className={styles.cardBackgroundImage}>
          <CardBackgroundIcon style={{ pointerEvents: 'none' }} />
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className={`${styles.heading} text-3xl font-bold tracking-tight md:text-4xl`}>
          {title}
        </h2>
        <div className={styles.underline}>
          <UnderlineIcon />
        </div>
        <p className={`${styles.subHeading} mt-4 max-w-2xl`}>{subTitle}</p>
        <div className="mt-10 w-full">{searchBox}</div>
      </div>
    </div>
  );
}