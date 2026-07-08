'use client'

import { useState } from 'react'

/**
 * Кнопка «Замовити» з pop-up формою (ім'я + телефон).
 * Заявка йде на той самий endpoint /form-submit, що й форма зворотного зв'язку
 * (лист на CONTACT_EMAIL → reklama@rodonit.com.ua).
 */
export default function OrderButton({
  label = 'Замовити консультацію',
  className = '',
}: {
  label?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/form-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: 'Заявка на консультацію (кнопка «Замовити»)',
        }),
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const close = () => {
    setOpen(false)
    setTimeout(() => {
      setStatus('idle')
      setName('')
      setPhone('')
    }, 200)
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={close}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Закрити"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>

            {status === 'ok' ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Заявку надіслано!</h3>
                <p className="text-gray-600 mb-6">Ми зв'яжемося з вами найближчим часом.</p>
                <button
                  onClick={close}
                  className="bg-green-700 text-white font-medium px-6 py-2.5 rounded hover:bg-green-800 transition-colors"
                >
                  Закрити
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Замовити консультацію</h3>
                <p className="text-gray-500 text-sm mb-5">
                  Залиште ім'я та телефон — наш консультант передзвонить вам.
                </p>
                <form onSubmit={submit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Ваше ім'я"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="tel"
                    placeholder="Номер телефону"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:border-green-500"
                  />
                  {status === 'error' && (
                    <p className="text-red-600 text-sm">Не вдалося надіслати. Спробуйте ще раз.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-green-700 text-white font-semibold px-6 py-3 rounded hover:bg-green-800 transition-colors disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Надсилаємо…' : 'Надіслати заявку'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
