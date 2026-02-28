import { NextResponse } from "next/server"

type ContactPayload = {
  name: string
  email: string
  message: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 200
const MAX_MESSAGE_LENGTH = 3000

function normalizeSingleLine(value: string, maxLength: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength)
}

function normalizeMultiLine(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength)
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.error("Telegram env vars are missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID")
    return NextResponse.json(
      { error: "Contact service is not configured." },
      { status: 500 },
    )
  }

  let body: Partial<ContactPayload>

  try {
    body = (await request.json()) as Partial<ContactPayload>
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const name = normalizeSingleLine(String(body.name ?? ""), MAX_NAME_LENGTH)
  const email = normalizeSingleLine(String(body.email ?? ""), MAX_EMAIL_LENGTH)
  const message = normalizeMultiLine(String(body.message ?? ""), MAX_MESSAGE_LENGTH)

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 },
    )
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Email is invalid." }, { status: 400 })
  }

  const text = [
    "New contact message from doermusic.com",
    `Name: ${name}`,
    `Email: ${email}`,
    "Message:",
    message,
  ].join("\n")

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    })

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text()
      console.error(`Telegram sendMessage failed with status ${telegramResponse.status}: ${errorText}`)
      return NextResponse.json(
        { error: "Failed to deliver message." },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Telegram request failed:", error)
    return NextResponse.json(
      { error: "Failed to deliver message." },
      { status: 502 },
    )
  }
}
