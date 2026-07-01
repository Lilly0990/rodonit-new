import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email: senderEmail, message } = body as {
      name?: string
      phone?: string
      email?: string
      message?: string
    }

    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Вкажіть ім'я та телефон" },
        { status: 400 },
      )
    }

    const toEmail = process.env.CONTACT_EMAIL || 'reklama@rodonit.com.ua'

    // ── Надсилаємо email ────────────────────────────────────────────────────
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const port = Number(process.env.SMTP_PORT || 465)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      const subject = `📩 Нова заявка з сайту — ${name.trim()}`
      const textBody = [
        `Ім'я: ${name.trim()}`,
        `Телефон: ${phone.trim()}`,
        senderEmail ? `Email: ${senderEmail}` : '',
        message ? `\nПовідомлення:\n${message}` : '',
      ]
        .filter(Boolean)
        .join('\n')

      const htmlBody = `
        <h2 style="color:#1a3a26">Нова заявка з сайту Rodonit Agro</h2>
        <table cellpadding="6" style="font-size:15px">
          <tr><td><b>Ім'я:</b></td><td>${name.trim()}</td></tr>
          <tr><td><b>Телефон:</b></td><td>${phone.trim()}</td></tr>
          ${senderEmail ? `<tr><td><b>Email:</b></td><td>${senderEmail}</td></tr>` : ''}
        </table>
        ${message ? `<p style="margin-top:12px"><b>Повідомлення:</b><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
      `

      await transporter.sendMail({
        from: `"Rodonit Agro Site" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject,
        text: textBody,
        html: htmlBody,
      })
    } else {
      console.log('[contact form]', { name, phone, senderEmail, message })
    }

    // ── Telegram-сповіщення (опційно) ───────────────────────────────────────
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (botToken && chatId) {
      const text = [
        '📩 *Нова заявка з сайту Rodonit Agro*',
        `👤 ${name.trim()}`,
        `📞 ${phone.trim()}`,
        senderEmail ? `✉️ ${senderEmail}` : '',
        message ? `💬 ${message.slice(0, 300)}` : '',
      ]
        .filter(Boolean)
        .join('\n')

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact API error]', err)
    return NextResponse.json(
      { error: 'Помилка сервера. Спробуйте пізніше або зателефонуйте нам.' },
      { status: 500 },
    )
  }
}
