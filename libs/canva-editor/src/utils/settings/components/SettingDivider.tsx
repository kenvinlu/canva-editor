import { FC } from 'react';

interface Props {
  background?: string;
}
const SettingDivider: FC<Props> = ({ background = 'rgba(57,76,96,.15)' }) => {
  return (
    <div
      css={{
        height: 24,
        width: 1,
        background,
      }}
    />
  );
};

export default SettingDivider;
