const ConvertNumber = (number: number) => {
  let suffix = '';

  if (number < 1000) return number;

  if (number >= 1000000) {
    suffix = 'M';
    number /= 1000000;
  } else if (number >= 1000) {
    suffix = 'K';
    number /= 1000;
  }

  return number >= 10 ? Math.floor(number) + suffix : number.toFixed(1) + suffix;
};

export default ConvertNumber;
