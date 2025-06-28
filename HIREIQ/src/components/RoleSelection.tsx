import React from 'react'
import { jobRoles, JobRole } from '../lib/questions'
import { Code, BarChart3, Brain, Megaphone, ArrowRight } from 'lucide-react'

interface RoleSelectionProps {
  onRoleSelect: (role: JobRole) => void
}

const roleIcons: { [key: string]: React.ComponentType<any> } = {
  'software-engineer': Code,
  'product-manager': BarChart3,
  'data-scientist': Brain,
  'marketing-manager': Megaphone,
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Interview Role</h1>
          <p className="text-xl text-gray-600">Select the position you'd like to practice for</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {jobRoles.map((role) => {
            const IconComponent = roleIcons[role.id]
            return (
              <div
                key={role.id}
                onClick={() => onRoleSelect(role)}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                    <p className="text-gray-600 mb-4">{role.description}</p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-200">
                      <span>Start practicing</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}