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
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  const phoneDigits = phone.replace(/\D/g, '')
  const phoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 13
  const nameValid = name.trim().length >= 2
  const formValid = nameValid && phoneValid

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!formValid) return
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
      setTouched(false)
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
                <form onSubmit={submit} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="ob-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Ім'я
                    </label>
                    <input
                      id="ob-name"
                      type="text"
                      placeholder="Напр. Олег"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-white text-gray-900 placeholder-gray-400 border rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/40 ${
                        touched && !nameValid ? 'border-red-400' : 'border-gray-300 focus:border-green-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="ob-phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон
                    </label>
                    <input
                      id="ob-phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="+380 XX XXX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-white text-gray-900 placeholder-gray-400 border rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/40 ${
                        touched && !phoneValid ? 'border-red-400' : 'border-gray-300 focus:border-green-500'
                      }`}
                    />
                    {touched && !phoneValid && (
                      <p className="text-red-600 text-xs mt-1">Введіть коректний номер (не менше 10 цифр).</p>
                    )}
                  </div>
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
