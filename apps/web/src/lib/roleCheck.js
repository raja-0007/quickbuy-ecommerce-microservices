
const pagePermissions = {
  '/testPage': ['admin'],
  '/seller': ['seller'], // base path
  '/admin' : ['admin']
}

export const hasPagePermission = (url, token) => {
  const role = token?.role

  const matchedRoute = Object.keys(pagePermissions).find(path =>
    url.startsWith(path)
  )

  if (!matchedRoute) return true

  return pagePermissions[matchedRoute].includes(role)
}