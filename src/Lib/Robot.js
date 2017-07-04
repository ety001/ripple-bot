const install = (Vue, options = {}) => {
  Vue.Robot = {
    run: (component) => {
      console.log(123)
    }
  }
}
export default install
