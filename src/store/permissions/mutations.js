/*
export function someMutation (state) {
}
*/
// export function setPermissions (state, data) {
//   state.permissions = data
// }

// export function setUserInfo (state, data) {
//   state.user = data
// }

export const setPermissions = (state, data) => {
  state.permissions = data
}

export const setUserInfo = (state, data) => {
  state.user = data
}

export const logout = (state) => {
  state.permissions = {}
  state.user = {}
}

export const login = (state, data) => {
  state.token = data
}
