import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Button } from '../ui'

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  published_year: z.number().min(1000).max(new Date().getFullYear()),
  genre: z.string().min(1, 'Genre is required'),
  total_copies: z.number().min(1, 'At least 1 copy required'),
  available_copies: z.number().min(0),
  description: z.string().optional(),
})

export const BookForm = ({ book, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: book || {
      title: '',
      author: '',
      isbn: '',
      published_year: new Date().getFullYear(),
      genre: '',
      total_copies: 1,
      available_copies: 1,
      description: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
      />
      <Input
        label="Author"
        {...register('author')}
        error={errors.author?.message}
      />
      <Input
        label="ISBN"
        {...register('isbn')}
        error={errors.isbn?.message}
      />
      <Input
        label="Published Year"
        type="number"
        {...register('published_year', { valueAsNumber: true })}
        error={errors.published_year?.message}
      />
      <Input
        label="Genre"
        {...register('genre')}
        error={errors.genre?.message}
      />
      <Input
        label="Total Copies"
        type="number"
        {...register('total_copies', { valueAsNumber: true })}
        error={errors.total_copies?.message}
      />
      <Input
        label="Available Copies"
        type="number"
        {...register('available_copies', { valueAsNumber: true })}
        error={errors.available_copies?.message}
      />
      <div className="form-group">
        <label className="label">Description</label>
        <textarea
          className="input"
          rows={3}
          {...register('description')}
        />
      </div>
      <div className="flex gap-3 justify-end mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          {book ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}

export default BookForm
