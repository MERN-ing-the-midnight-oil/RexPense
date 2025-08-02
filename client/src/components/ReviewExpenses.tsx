import { useEffect, useState } from 'react'

interface Expense {
    id: string
    amount: number
    note: string
    created_at: string
    category_name: string
    category_id: string
}

export default function ReviewExpenses() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})

    const fetchExpenses = () => {
        fetch('http://localhost:3000/api/expenses')
            .then(res => res.json())
            .then(data => setExpenses(data))
    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    // Group by category name but preserve ID for delete
    const grouped = expenses.reduce((acc: {
        [key: string]: { id: string; items: Expense[] }
    }, expense) => {
        const cat = expense.category_name || 'Uncategorized'
        const catId = expense.category_id || 'uncategorized'

        if (!acc[cat]) {
            acc[cat] = { id: catId, items: [] }
        }

        acc[cat].items.push(expense)
        return acc
    }, {})

    const handleRename = async (oldName: string) => {
        const newName = prompt(`Rename category "${oldName}" to:`)
        console.log('Attempting rename:', { oldName, newName })

        if (newName && newName !== oldName) {
            const response = await fetch(`http://localhost:3000/api/categories/rename`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldName, newName })
            })
            const data = await response.json()
            console.log('Rename response:', response.status, data)
            fetchExpenses()
        }
    }

    const handleDelete = async (id: string, name: string) => {
        const confirmed = confirm(`Are you sure you want to delete "${name}"? Expenses will be moved to "Uncategorized".`)
        if (confirmed) {
            const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()
            console.log('Delete response:', response.status, data)
            fetchExpenses()
        }
    }

    return (
        <div style={{
            padding: '1rem',
            maxWidth: '600px',
            margin: '0 auto',
            fontFamily: 'sans-serif'
        }}>
            <h2>Review Expenses</h2>
            {Object.entries(grouped).map(([category, { id, items }]) => (
                <div key={category} style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button
                            onClick={() => setExpanded(prev => ({ ...prev, [category]: !prev[category] }))}
                            style={{
                                background: '#f0f0f0',
                                width: '100%',
                                padding: '0.75rem',
                                textAlign: 'left',
                                fontWeight: 'bold',
                                border: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            {category} {expanded[category] ? '▾' : '▸'}
                        </button>
                        {category !== 'Uncategorized' && (
                            <div style={{ display: 'flex', gap: '0.25rem', paddingRight: '0.5rem' }}>
                                <button onClick={() => handleRename(category)}>✏️</button>
                                <button onClick={() => handleDelete(id, category)}>🗑️</button>
                            </div>
                        )}
                    </div>
                    {expanded[category] && (
                        <ul style={{ listStyle: 'none', padding: '0.5rem 1rem' }}>
                            {items.map(exp => (
                                <li key={exp.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid #eee',
                                    padding: '0.5rem 0'
                                }}>
                                    <div>
                                        <div>${(exp.amount / 100).toFixed(2)}</div>
                                        <small>{exp.note}</small>
                                    </div>
                                    <div style={{ color: '#666', fontSize: '0.8rem' }}>
                                        {new Date(exp.created_at).toLocaleDateString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    )
}
