import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default <Config>{
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: { min: '320px', max: '639px' },
      sm: { min: '640px', max: '767px' },
      md: { min: '768px', max: '1023px' },
      lg: { min: '1024px', max: '1279px' },
      xl: { min: '1280px', max: '1535px' },
      '2xl': { min: '1536px' }
    }
  },
  plugins: [tailwindcssAnimate]
};
