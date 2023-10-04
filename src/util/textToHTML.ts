const textToHTMLWithAllSpecialCharacter = (text: string, tabSize: number = 4) => {
  const tab = '&nbsp;'.repeat(tabSize);
  
  return text
    .replace(/\r\n/g, '<br>')
    .replace(/\r/g, '<br>')
    .replace(/\n/g, '<br>')
    .replace(/\t/g, tab)
    .replace(/ /g, '&nbsp;')
    .replace(/-/g, '&#8209;');
};

export default textToHTMLWithAllSpecialCharacter;
