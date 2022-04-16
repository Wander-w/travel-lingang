// get user state 

function getUserState() {
  const store = getApp().store
  const user = store.getState().user
  return {
    store,
    user
  }
}


module.exports = {
  getUserState
}