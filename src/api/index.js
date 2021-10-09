// 这个文件目的是把所有的接口整合到一起，然后统一暴露出去

// 使用引入并暴露的方式，default引入的时候不能简写
export { default as power } from './modules/power'
export { default as goods } from './modules/goods'
export { default as order } from './modules/order'
export { default as report } from './modules/report'
export * as user from './modules/user'

// 最终出去的是
// {
//   trademark,
//   attr
// }
