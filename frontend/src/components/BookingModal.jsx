import { useState } from 'react'
import { bookingsApi } from '../api/bookings'

export default function BookingModal({ resource, onClose, onSuccess }) {
  const [form, setForm] = useState({ startTime: '', endTime: '', purpose: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError('End time must be after start time')
      return
    }
    setLoading(true)
    try {
      await bookingsApi.create({
        resourceId: resource.id,
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose,
      })
      onSuccess()
      alert('Booking submitted! Awaiting admin approval.')
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. The resource may be unavailable at that time.')
    } finally {
      setLoading(false)
    }
  }

  const minDateTime = new Date(Date.now() + 60000).toISOString().slice(0, 16)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-1">Book Resource</h2>
        <p className="text-sm text-gray-500 mb-4">{resource.name}</p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              required
              min={minDateTime}
              value={form.startTime}
              onChange={e => setForm({...form, startTime: e.target.value})}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              required
              min={minDateTime}
              value={form.endTime}
              onChange={e => setForm({...form, endTime: e.target.value})}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <textarea
              placeholder="What is this booking for?"
              value={form.purpose}
              onChange={e => setForm({...form, purpose: e.target.value})}
              className="input-field h-20 resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
