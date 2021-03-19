const set = (option, value) => {
  if (typeof option === 'string') {
    option = { key: option };
  }
  const section = option.section || 'user';
  const state = JSON.parse(localStorage.getItem(section));
  const temp = { ...state, ...{ [option.key]: value } };
  localStorage.setItem(section, JSON.stringify(temp));
};
const get = (option) => {
  if (typeof option === 'string') {
    option = { key: option };
  }
  const section = option.section || 'user';
  const state = JSON.parse(localStorage.getItem(section)) ?? {};
  return state[option.key];
};
export default {
  get,
  set,
};
