// backend/src/middelwares/loggingMiddleware.mjs

export default function logger(req, res, next) {
  console.log("====================================")
  console.log(`📥 ${req.method} ${req.originalUrl}`)
  console.log("🕒 Time:", new Date().toISOString())

  if (Object.keys(req.body || {}).length > 0) {
    console.log("📦 Body:", req.body)
  }

  if (Object.keys(req.query || {}).length > 0) {
    console.log("🔎 Query:", req.query)
  }

  if (Object.keys(req.params || {}).length > 0) {
    console.log("📌 Params:", req.params)
  }

  const start = Date.now()

  res.on("finish", () => {
    console.log(`📤 Status: ${res.statusCode}`)
    console.log(`⏱️ Time: ${Date.now() - start} ms`)
    console.log("====================================\n")
  })

  next()
}