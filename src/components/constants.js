export const colors = {
  roman: '#B85828',
  persina:'#78a878',
  greek: '#Fd8b848',
  syrios:'#737271',
  political:'#486678',
  military:'#313029',
  cultural:'d88858',
  economic:'#d8a048',
  eastern_states: '#7FA87F',
  default: '#71797E',
  find_color: function(text) {
    text = text.toLowerCase();
    if (text.includes('roman'))
      return this.roman;
    if (text.includes('persina'))
      return this.persina;
    if (text.includes('greek'))
      return this.greek;
    if (text.includes('syrios'))
      return this.syrios;
    if (text.includes('political'))
      return this.political;
    if (text.includes('military'))
      return this.military;
    if (text.includes('cultural'))
      return this.cultural;
    if (text.includes('economic'))
      return this.economic;
    if (text.includes('economic'))
      return this.economic;
    if (text.includes('eastern'))
      return this.eastern_states;
    return this.default;
  }
};
