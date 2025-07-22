import { createRequire } from 'node:module'
export const readJson = (path) => createRequire(import.meta.url)(path)

// Es lo mismo...
// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url)
// export const readJson = (path) => require(path)
