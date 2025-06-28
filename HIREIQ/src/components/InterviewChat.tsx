import React, { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { analyzeResponse, initializeAI, AnalysisResult } from '../lib/ai'
import { speechService } from '../lib/speech'
import { getRandomQuestion, JobRole, Question } from '../lib/questions'
import { Send, Mic, MicOff, ArrowLeft, BarChart3, Brain, Target, MessageCircle, CheckCircle, Circle } from 'lucide-react'

interface Message {
  id: string
  type: 'question' | 'answer' | 'analysis'
  content: string
  question?: Question
  analysis?: AnalysisResult
  timestamp: Date
}

interface InterviewChatProps {
  role: JobRole
  onBack: () => void
  onShowHistory: () => void
}

export default function InterviewChat({ role, onBack, onShowHistory }: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAIReady, setIsAIReady] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize AI model and start first session
    const initialize = async () => {
      try {
        await initializeAI()
        setIsAIReady(true)
        await startNewSession()
      } catch (error) {
        console.error('Failed to initialize:', error)
        setIsAIReady(true) // Continue even if AI fails
        await startNewSession()
      }
    }
    initialize()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startNewSession = async () => {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) return

      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          user_id: user.data.user.id,
          job_role: role.id,
        })
        .select()
        .single()

      if (error) throw error
      setSessionId(data.id)

      // Add first question
      const firstQuestion = getRandomQuestion(role.id)
      setCurrentQuestion(firstQuestion)
      const questionMessage: Message = {
        id: Date.now().toString(),
        type: 'question',
        content: firstQuestion.text,
        question: firstQuestion,
        timestamp: new Date(),
      }
      setMessages([questionMessage])
    } catch (error) {
      console.error('Failed to start session:', error)
      // Continue with local session if DB fails
      const firstQuestion = getRandomQuestion(role.id)
      setCurrentQuestion(firstQuestion)
      const questionMessage: Message = {
        id: Date.now().toString(),
        type: 'question',
        content: firstQuestion.text,
        question: firstQuestion,
        timestamp: new Date(),
      }
      setMessages([questionMessage])
    }
  }

  const handleSendAnswer = async () => {
    if (!currentAnswer.trim() || isAnalyzing || !currentQuestion) return

    const answerMessage: Message = {
      id: Date.now().toString(),
      type: 'answer',
      content: currentAnswer,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, answerMessage])
    setIsAnalyzing(true)

    try {
      // Analyze the response
      const analysis = await analyzeResponse(currentAnswer, currentQuestion)

      // Save to database if session exists
      if (sessionId) {
        try {
          await supabase.from('interview_qa').insert({
            session_id: sessionId,
            question: currentQuestion.text,
            answer: currentAnswer,
            clarity_score: analysis.clarityScore,
            confidence_score: analysis.confidenceScore,
            relevance_score: analysis.relevanceScore,
            feedback: analysis.feedback,
          })
        } catch (error) {
          console.error('Failed to save Q&A:', error)
        }
      }

      // Add analysis message
      const analysisMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'analysis',
        content: analysis.feedback,
        analysis,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, analysisMessage])

      // Add next question after a short delay
      setTimeout(() => {
        const askedQuestions = messages
          .filter(m => m.type === 'question')
          .map(m => m.content)
        const nextQuestion = getRandomQuestion(role.id, askedQuestions)
        setCurrentQuestion(nextQuestion)
        
        const nextQuestionMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'question',
          content: nextQuestion.text,
          question: nextQuestion,
          timestamp: new Date(),
        }

        setMessages(prev => [...prev, nextQuestionMessage])
      }, 1000)

    } catch (error) {
      console.error('Analysis failed:', error)
      // Add fallback message
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'analysis',
        content: 'Analysis temporarily unavailable. Keep practicing!',
        analysis: {
          clarityScore: 75,
          confidenceScore: 70,
          relevanceScore: 80,
          feedback: 'Keep practicing to improve your interview skills!'
        },
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsAnalyzing(false)
      setCurrentAnswer('')
    }
  }

  const handleVoiceInput = () => {
    if (!speechService.isAvailable()) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    if (isListening) {
      speechService.stopListening()
      setIsListening(false)
    } else {
      setIsListening(true)
      speechService.startListening(
        (text) => {
          setCurrentAnswer(prev => prev + (prev ? ' ' : '') + text)
          setIsListening(false)
        },
        (error) => {
          console.error('Speech recognition error:', error)
          setIsListening(false)
        }
      )
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'direct': return 'bg-blue-100 text-blue-800'
      case 'behavioral': return 'bg-purple-100 text-purple-800'
      case 'technical': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{role.title} Interview</h1>
                <p className="text-sm text-gray-600">
                  {isAIReady ? 'AI analysis ready' : 'Loading AI model...'}
                </p>
              </div>
            </div>
            <button
              onClick={onShowHistory}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium"
            >
              View History
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6 mb-24">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              {message.type === 'question' && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-md border border-gray-100 max-w-3xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(message.question?.type || 'behavioral')}`}>
                        {message.question?.type || 'behavioral'}
                      </span>
                    </div>
                    <p className="text-gray-900">{message.content}</p>
                  </div>
                </div>
              )}

              {message.type === 'answer' && (
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-blue-500 text-white rounded-2xl rounded-tr-md p-4 shadow-md max-w-3xl">
                    <p>{message.content}</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">You</span>
                  </div>
                </div>
              )}

              {message.type === 'analysis' && message.analysis && (
                <div className="mt-4 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <BarChart3 className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-700">Clarity</span>
                      </div>
                      <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(message.analysis.clarityScore)}`}>
                        {message.analysis.clarityScore}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Brain className="w-5 h-5 text-purple-500 mr-2" />
                        <span className="font-medium text-gray-700">Confidence</span>
                      </div>
                      <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(message.analysis.confidenceScore)}`}>
                        {message.analysis.confidenceScore}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-medium text-gray-700">Relevance</span>
                      </div>
                      <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getScoreColor(message.analysis.relevanceScore)}`}>
                        {message.analysis.relevanceScore}%
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
                    <p className="text-gray-700">{message.analysis.feedback}</p>
                  </div>

                  {/* Correct Answer for Direct Questions */}
                  {message.analysis.correctAnswer && (
                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Correct Answer
                      </h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-gray-800">{message.analysis.correctAnswer}</p>
                      </div>
                    </div>
                  )}

                  {/* Key Points Analysis for Behavioral/Technical Questions */}
                  {message.analysis.keyPointsAnalysis && message.analysis.keyPointsAnalysis.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Key Points to Address</h4>
                      <div className="space-y-2">
                        {message.analysis.keyPointsAnalysis.map((point, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            {point.startsWith('✓') ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${point.startsWith('✓') ? 'text-green-700' : 'text-gray-600'}`}>
                              {point.substring(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {isAnalyzing && (
            <div className="flex items-center space-x-3 justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-gray-600">Analyzing your response...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                rows={3}
                disabled={isAnalyzing}
              />
            </div>
            <div className="flex flex-col space-y-2">
              {speechService.isAvailable() && (
                <button
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  disabled={isAnalyzing}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
              <button
                onClick={handleSendAnswer}
                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!currentAnswer.trim() || isAnalyzing}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}