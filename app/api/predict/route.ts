export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Simple mock prediction logic
    // In production, this would call your ML model
    const gluco = body.glucose || 0
    const bmi = body.bmi || 0
    const age = body.age || 0
    const dpf = body.diabetesPedigreeFunction || 0

    // Simplified scoring (replace with your actual ML model)
    const score = gluco * 0.003 + bmi * 0.01 + age * 0.002 + dpf * 0.5
    const prediction = score > 0.5 ? 1 : 0
    const probability = Math.min(Math.max(score, 0), 1)

    return Response.json({
      prediction,
      probability,
    })
  } catch (error) {
    return Response.json({ error: "Failed to process prediction" }, { status: 400 })
  }
}
