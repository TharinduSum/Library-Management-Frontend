import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Button } from '../ui'

const borrowSchema = z.object({
  book_id: z.number().min(1, 'Book is required'),
  days: z.number().min(1).max(90).default(14),
  notes: z.string().optional(),
})

export const BorrowForm = ({ books, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(borrowSchema),
    defaultValues: {
      book_id: '',
      days: 14,
      notes: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="label">Book</label>
        <select className="input" {...register('book_id', { valueAsNumber: true })}>
          <option value="">Select a book</option>
          {books
            ?.filter((book) => book.available_copies > 0)
            .map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.available_copies} available)
              </option>
            ))}
        </select>
        {errors.book_id && <p className="error-text">{errors.book_id.message}</p>}
      </div>
      <Input
        label="Borrow Days"
        type="number"
        {...register('days', { valueAsNumber: true })}
        error={errors.days?.message}
      />
      <div className="form-group">
        <label className="label">Notes</label>
        <textarea
          className="input"
          rows={2}
          {...register('notes')}
        />
      </div>
      <div className="flex gap-3 justify-end mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          Borrow
        </Button>
      </div>
    </form>
  )
}

export default BorrowForm
