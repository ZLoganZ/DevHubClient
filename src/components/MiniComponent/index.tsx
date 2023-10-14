import { Button } from 'antd';

import { getTheme } from '@/util/theme';
import { useAppSelector } from '@/hooks/special';
import StyleProvider from './cssMiniComponent';

// ===========================================

type ButtonNormalHoverProps = 'primary' | 'text' | 'default' | 'dashed';

type ButtonActiveHoverProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
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
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();

  return (
    <StyleProvider theme={themeColorSet}>
      <Button
        type={type}
        className='ButtonActiveHover font-bold px-6 py-2'
        onClick={onClick}
        loading={loading}
        style={{
          height: '100%',
          borderRadius: rounded ? '1.5rem' : '0',
          width: block ? '100%' : 'auto'
        }}>
        {children}
      </Button>
    </StyleProvider>
  );
};

// ===========================================

export const ButtonActiveNonHover = () => {
  return <></>;
};

// ===========================================

type ButtonCancelHoverProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export const ButtonCancelHover = ({ className, children, onClick, disabled }: ButtonCancelHoverProps) => {
  useAppSelector((state) => state.theme.change);
  const { themeColorSet } = getTheme();
  return (
    <StyleProvider theme={themeColorSet}>
      <Button
        className={`ButtonCancelHover font-bold px-6 py-2 rounded-3xl ${className}`}
        onClick={onClick}
        style={{ height: '100%' }}
        disabled={disabled}>
        {children}
      </Button>
    </StyleProvider>
  );
};

// ===========================================

export const ButtonCancelNonHover = () => {
  return <></>;
};

// ===========================================
