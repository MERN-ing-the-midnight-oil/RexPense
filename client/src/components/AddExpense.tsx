import { useEffect, useState } from 'react'

interface Category {
    id: string
    name: string
}

export default function AddExpense() {
    const [amount, setAmount] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [note, setNote] = useState('')
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/categories')
                const data = await res.json()
                setCategories(data)
            } catch (err) {
                console.error('Failed to fetch categories', err)
            }
        }

        fetchCategories()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    category_id: categoryId,
                    note,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                console.log('✅ Expense saved:', data)

                setAmount('')
                setCategoryId('')
                setNote('')
            } else {
                console.error('❌ Failed to save expense')
            }
        } catch (error) {
            console.error('❌ Error saving expense:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <h2 style={{ margin: 0 }}>Add Expense</h2>

            <input
                type="text"
                placeholder="Amount (e.g. 1234 = $12.34)"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                required
                style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '6px'
                }}
            />

            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '6px'
                }}
            >
                <option value="">Select Category</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <textarea
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    resize: 'vertical'
                }}
            />

            <button type="submit" style={{
                padding: '0.75rem',
                background: '#3b82f6',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
            }}>
                Add Expense
            </button>
        </form>
    )
}
