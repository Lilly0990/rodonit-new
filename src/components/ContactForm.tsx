'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    setStatus('sending')
    try {
      const res = await fetch('/form-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json() as { ok?: boolean; error?: string }
      if (json.ok) {
        setStatus('success')
        form.reset()
      } else {
        setErrorMsg(json.error ?? 'Помилка')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Помилка мережі. Спробуйте ще раз.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Заявка надіслана!</h3>
        <p className="text-gray-600 text-sm">
          Ми зв'яжемося з вами найближчим часом. Дякуємо!
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-green-700 text-sm hover:underline"
        >
          Надіслати ще одну заявку
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Ваше ім'я <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Іван Петренко"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Телефон <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="+380 XX XXX XX XX"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email (необов'язково)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Запитання або повідомлення
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Опишіть вашу культуру і проблему..."
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-green-700 text-white font-medium py-2.5 rounded hover:bg-green-600 transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? 'Надсилаємо...' : 'Надіслати заявку'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Натискаючи кнопку, ви погоджуєтесь з{' '}
        <a href="/privacy" className="underline hover:text-gray-600">
          політикою конфіденційності
        </a>
      </p>
    </form>
  )
}
