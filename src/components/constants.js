// export const colors = {
//   roman: '#B85828',
//   persina:'#78a878',
//   greek: '#d8b848',
//   syrios:'#737271',
//   political:'#486678',
//   military:'#313029',
//   cultural:'d88858',
//   economic:'#d8a048',
//   eastern_states: '#7FA87F',
//   default: '#71797E',
//   find_color: function(text) {
//     text = text.toLowerCase();
//     if (text.includes('roman'))
//       return this.roman;
//     if (text.includes('persina'))
//       return this.persina;
//     if (text.includes('greek'))
//       return this.greek;
//     if (text.includes('syrios'))
//       return this.syrios;
//     if (text.includes('political'))
//       return this.political;
//     if (text.includes('military'))
//       return this.military;
//     if (text.includes('cultural'))
//       return this.cultural;
//     if (text.includes('economic'))
//       return this.economic;
//     if (text.includes('eastern'))
//       return this.eastern_states;
//     return this.default;
//   }
// };

export const colors = {
  ColorB85828:'#B85828',
  Color78a878:'#78a878',
  Colord8b848:'#d8b848',
  Color737271:'#737271',
  Color486678:'#486678',
  Color313029:'#313029',
  Colord88858:'d88858',
  Colord8a048:'#d8a048',
  Color7FA87F:'#7FA87F',

  default:'#71797E',
  find_color: function(text) {
      text = text.toLowerCase();
      if (text.includes('roman'))
        return this.ColorB85828; //b85828
      if (text.includes('greek' || 'seleucid' || 'ptolemaic' || 'alexander' || 'attalid'))
        return this.Colord8b848;
      if (text.includes('persina' || "parthian" || "hasmonean" || "armenian" || "sasanian" || "herodian" || "nabataean"))
        return this.Color78a878;
      if (text.includes('emesene' || 'commagenian'||'syrian' || 'palmyrene'))
        return this.Color737271;
      if (text.includes('political'))
        return this.Color486678;
      if (text.includes('military'))
        return this.Color313029;
      if (text.includes('cultural'))
        return this.Colord88858;
      if (text.includes('economic'))
        return this.Colord8a048;
      if (text.includes('eastern'))
        return this.Color7FA87F;
      return this.default;
  }
};
