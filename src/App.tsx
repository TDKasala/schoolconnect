import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SchoolConnect
          </h1>
          <p className="text-lg text-gray-600">
            School Management System for DRC
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome to SchoolConnect
            </h2>
            <p className="text-gray-600 mb-4">
              A comprehensive school management system designed for schools in the Democratic Republic of Congo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-800">POSP</h3>
                <p className="text-sm text-gray-600">Pedagogical Management</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-800">UBank</h3>
                <p className="text-sm text-gray-600">Financial Management</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-800">Portal</h3>
                <p className="text-sm text-gray-600">Parent & Student Access</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
