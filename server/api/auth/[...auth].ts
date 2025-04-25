export default eventHandler((event) => {
  return auth.handler(toWebRequest(event))
})
