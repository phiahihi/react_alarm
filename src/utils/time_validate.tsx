export function isValid24HourTimeFormat(number: string) {
  const cleanedString = number.replace(/[-:]/g, '');

  if (cleanedString.length === 1) {
    return true;
  } else if (cleanedString.length === 2) {
    const firstDigit = parseInt(cleanedString[0], 10);
    const secondDigit = parseInt(cleanedString[1], 10);

    if (firstDigit === 1 || firstDigit === 0) {
      return true;
    } else if (firstDigit === 2 && secondDigit < 4) {
      return true;
    } else {
      return secondDigit < 6;
    }
  } else if (cleanedString.length === 3) {
    if (cleanedString[0] === '0') {
      if (cleanedString[2] < '6') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else if (cleanedString.length === 4) {
    const lastDigit = parseInt(cleanedString[2], 10);
    const fullTime = parseInt(cleanedString, 10);

    return lastDigit < 6 && fullTime < 2360;
  } else {
    return false;
  }
}
