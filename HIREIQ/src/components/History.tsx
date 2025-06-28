import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Calendar, BarChart3, Brain, Target, MessageCircle, CheckCircle, Circle } from 'lucide-react'

interface Session {
  id: string
  job_role: string
  created_at: string
  qa_pairs: {
    id: string
    question: string
    answer: string
    clarity_score: number
    confidence_score: number
    relevance_score: number
    feedback: string
    created_at: string
  }[]
}

interface HistoryProps {
  onBack: () => void
}

export default function History({ onBack }: HistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) return

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false })

      if (sessionsError) throw sessionsError

      const sessionsWithQA = await Promise.all(
        sessionsData.map(async (session) => {
          const { data: qaData, error: qaError } = await supabase
            .from('interview_qa')
            .select('*')
            .eq('session_id', session.id)
            .order('created_at', { ascending: true })

          if (qaError) throw qaError

          return {
            ...session,
            qa_pairs: qaData || []
          }
        })
      )

      setSessions(sessionsWithQA)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleTitle = (roleId: string) => {
    const roleTitles: { [key: string]: string } = {
      'software-engineer': 'Software Engineer',
      'product-manager': 'Product Manager',
      'data-scientist': 'Data Scientist',
      'marketing-manager': 'Marketing Manager'
    }
    return roleTitles[roleId] || roleId
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const calculateAverageScore = (qaPairs: Session['qa_pairs']) => {
    if (qaPairs.length === 0) return { clarity: 0, confidence: 0, relevance: 0 }
    
    const totals = qaPairs.reduce(
      (acc, qa) => ({
        clarity: acc.clarity + qa.clarity_score,
        confidence: acc.confidence + qa.confidence_score,
        relevance: acc.relevance + qa.relevance_score
      }),
      { clarity: 0, confidence: 0, relevance: 0 }
    )

    return {
      clarity: Math.round(totals.clarity / qaPairs.length),
      confidence: Math.round(totals.confidence / qaPairs.length),
      relevance: Math.round(totals.relevance / qaPairs.length)
    }
  }

  if (selectedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getRoleTitle(selectedSession.job_role)} Session
                </h1>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedSession.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {selectedSession.qa_pairs.map((qa) => (
              <div key={qa.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="mb-4">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 flex-1">
                      <p className="text-gray-900 font-medium">{qa.question}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">You</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex-1">
                      <p className="text-gray-900">{qa.answer}</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="font-medium text-gray-700 text-sm">Clarity</span>
                    </div>
                    <div className={`text-lg font-bold px-2 py-1 rounded-full ${getScoreColor(qa.clarity_score)}`}>
                      {qa.clarity_score}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Brain className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="font-medium text-gray-700 text-sm">Confidence</span>
                    </div>
                    <div className={`text-lg font-bold px-2 py-1 rounded-full ${getScoreColor(qa.confidence_score)}`}>
                      {qa.confidence_score}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="w-4 h-4 text-green-500 mr-2" />
                      <span className="font-medium text-gray-700 text-sm">Relevance</span>
                    </div>
                    <div className={`text-lg font-bold px-2 py-1 rounded-full ${getScoreColor(qa.relevance_score)}`}>
                      {qa.relevance_score}%
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                  <p className="text-gray-700 text-sm">{qa.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Interview History</h1>
              <p className="text-sm text-gray-600">Review your past interview sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
            <p className="text-gray-600">Start practicing to see your session history here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const averageScores = calculateAverageScore(session.qa_pairs)
              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getRoleTitle(session.job_role)}
                      </h3>
                      <p className="text-sm text-gray-600">{formatDate(session.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{session.qa_pairs.length} questions</p>
                    </div>
                  </div>

                  {session.qa_pairs.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Avg Clarity</p>
                        <div className={`text-sm font-bold px-2 py-1 rounded ${getScoreColor(averageScores.clarity)}`}>
                          {averageScores.clarity}%
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Avg Confidence</p>
                        <div className={`text-sm font-bold px-2 py-1 rounded ${getScoreColor(averageScores.confidence)}`}>
                          {averageScores.confidence}%
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Avg Relevance</p>
                        <div className={`text-sm font-bold px-2 py-1 rounded ${getScoreColor(averageScores.relevance)}`}>
                          {averageScores.relevance}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}