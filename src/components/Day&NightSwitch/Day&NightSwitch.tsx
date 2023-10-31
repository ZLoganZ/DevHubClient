import { useAppSelector } from '@/hooks/special';
import './Day&NightSwitch.css';

interface ISwitch {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const DayNightSwitch: React.FC<ISwitch> = ({ checked, onChange }) => {
  // Lấy theme từ LocalStorage chuyển qua css
  useAppSelector((state) => state.theme.change);

  return (
    <div className='containerButton inline'>
      <div className='switch'>
        <label htmlFor='toggle'>
          <input
            id='toggle'
            className='toggle-switch'
            type='checkbox'
            defaultChecked={!checked}
            onClick={() => {
              onChange(!checked);
            }}
          />
          <div className='sun-moon'>
            <div className='dots' />
          </div>
          <div className='background'>
            <div className='stars1' />
            <div className='stars2' />
          </div>
        </label>
      </div>
    </div>
  );
};

export default DayNightSwitch;
