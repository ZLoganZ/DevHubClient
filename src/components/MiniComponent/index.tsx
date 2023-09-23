import { ReactNode } from 'react';
import { Button } from 'antd';

import { getTheme } from '@/util/functions/ThemeFunction';
import { useAppSelector } from '@/hooks/special';
import StyleTotal from './cssMiniComponent';

// ===========================================

type ButtonNormalHoverProps = 'primary' | 'text' | 'default' | 'dashed';

type ButtonActiveHoverProps = {
  children?: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  rounded?: boolean;
  block?: boolean;
  type?: ButtonNormalHoverProps;
};

export const ButtonActiveHover = ({
  children,
  onClick,
  loading,
  rounded,
  block,
  type
}: ButtonActiveHoverProps) => {
  useAppSelector((state) => state.themeReducer.change);
  const { themeColorSet } = getTheme();

  return (
    <StyleTotal theme={themeColorSet}>
      <Button
        type={type}
        className="ButtonActiveHover font-bold px-6 py-2"
        onClick={onClick}
        loading={loading}
        style={{
          height: '100%',
          borderRadius: rounded ? '1.5rem' : '0',
          width: block ? '100%' : 'auto'
        }}>
        {children}
      </Button>
    </StyleTotal>
  );
};

// ===========================================

export const ButtonActiveNonHover = () => {
  return <div></div>;
};

// ===========================================

type ButtonCancelHoverProps = {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export const ButtonCancelHover = ({
  children,
  onClick,
  disabled
}: ButtonCancelHoverProps) => {
  useAppSelector((state) => state.themeReducer.change);
  const { themeColorSet } = getTheme();
  return (
    <StyleTotal theme={themeColorSet}>
      <Button
        className="ButtonCancelHover font-bold px-6 py-2 rounded-3xl"
        onClick={onClick}
        style={{ height: '100%' }}
        disabled={disabled}>
        {children}
      </Button>
    </StyleTotal>
  );
};

// ===========================================

export const ButtonCancelNonHover = () => {
  return <div></div>;
};

// ===========================================
