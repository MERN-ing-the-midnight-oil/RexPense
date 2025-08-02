// client/src/App.tsx
import { useState } from 'react'
import AddExpenseModal from './components/AddExpense'
import ReviewExpenses from './components/ReviewExpenses'

export default function App() {
  const [view, setView] = useState<'add' | 'review'>('add')
  const [isAddModalOpen, setIsAddModalOpen] = useState(true)

  const toggleView = (newView: 'add' | 'review') => {
    setView(newView)
    setIsAddModalOpen(newView === 'add')
  }

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      margin: 0,
    }}>
      <header style={{
        background: '#1f2937',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '0.5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        RexPense
      </header>

      <nav style={{
        display: 'flex',
        justifyContent: 'space-around',
        margin: '1rem auto',
        maxWidth: '500px',
        padding: '0.5rem',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        gap: '1rem',
      }}>
        <button
          onClick={() => toggleView('add')}
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '1rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            background: view === 'add' ? '#3b82f6' : '#e5e7eb',
            color: view === 'add' ? 'white' : '#374151',
            cursor: 'pointer',
            transition: '0.2s'
          }}
        >
          Add an Expense
        </button>
        <button
          onClick={() => toggleView('review')}
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '1rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            background: view === 'review' ? '#3b82f6' : '#e5e7eb',
            color: view === 'review' ? 'white' : '#374151',
            cursor: 'pointer',
            transition: '0.2s'
          }}
        >
          Records
        </button>
      </nav>

      <main style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
        {view === 'add' && (
          <AddExpenseModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}
        {view === 'review' && <ReviewExpenses />}
      </main>
    </div>
  )
}
