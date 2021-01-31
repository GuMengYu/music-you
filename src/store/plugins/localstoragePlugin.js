export default store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'app/updateSettings') {
      localStorage.setItem('settings', JSON.stringify(state.app.settings));
    }
  })
}
