const generateProductId = (prefix: string = 'PROD') => {
  const timestamp = Date.now() // Current timestamp
  const randomNum = Math.floor(Math.random() * 1000) // Random number between 0 and 999
  return `${prefix}-${timestamp}-${randomNum}`
}

export default {
  generateProductId
}
