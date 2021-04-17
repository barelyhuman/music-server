
export async function hbJSONParser (req) {
  return new Promise(resolve => {
    let data = ''
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', () => {
      if (data.length) {
        const body = JSON.parse(data)
        resolve(body)
      } else {
        resolve({})
      }
    })
  })
}
