// export function someGetter (state) {
// }

export function getPermissions (state) {
  return state.permissions
}

export function getUserInfo (state) {
  return state.user
}

export function getUserPk (state) {
  return state.user.pk
}

export function isLoggedIn (state) {
  return !!state.token
}
