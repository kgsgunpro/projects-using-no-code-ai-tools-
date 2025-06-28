import { pipeline, env } from '@xenova/transformers'
import { Question } from './questions'

// Configure transformers to use a local cache
env.allowLocalModels = false
env.allowRemoteModels = true

let sentimentAnalyzer: any = null
let isLoading = false

export async function initializeAI() {
  if (sentimentAnalyzer || isLoading) return sentimentAnalyzer
  
  isLoading = true
  try {
    console.log('Loading DistilBERT sentiment analysis model...')
    sentimentAnalyzer = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english')
    console.log('AI model loaded successfully')
    return sentimentAnalyzer
  } catch (error) {
    console.error('Failed to load AI model:', error)
    throw new Error('Failed to initialize AI model')
  } finally {
    isLoading = false
  }
}

export interface AnalysisResult {
  clarityScore: number
  confidenceScore: number
  relevanceScore: number
  feedback: string
  correctAnswer?: string
  keyPointsAnalysis?: string[]
}

export async function analyzeResponse(answer: string, question: Question): Promise<AnalysisResult> {
  try {
    if (!sentimentAnalyzer) {
      await initializeAI()
    }

    // Analyze sentiment and confidence
    const sentiment = await sentimentAnalyzer(answer)
    const sentimentScore = sentiment[0].label === 'POSITIVE' ? sentiment[0].score : 1 - sentiment[0].score

    // Calculate scores based on answer characteristics
    const wordCount = answer.trim().split(/\s+/).length
    const clarityScore = Math.min(100, Math.max(20, (wordCount / 20) * 80 + 20))
    
    const confidenceScore = Math.min(100, Math.max(30, sentimentScore * 100))
    
    // Enhanced relevance check based on question type and content
    let relevanceScore = 40
    
    if (question.type === 'direct') {
      // For direct questions, check if answer contains key concepts
      const questionWords = question.text.toLowerCase().split(/\s+/)
      const answerWords = answer.toLowerCase().split(/\s+/)
      const commonWords = questionWords.filter(word => 
        answerWords.includes(word) && word.length > 3 && 
        !['what', 'how', 'why', 'when', 'where', 'which', 'that', 'this', 'with', 'from'].includes(word)
      )
      relevanceScore = Math.min(100, Math.max(40, (commonWords.length / Math.max(questionWords.length * 0.3, 1)) * 100))
    } else {
      // For behavioral/technical questions, check against key points
      if (question.keyPoints) {
        const answerLower = answer.toLowerCase()
        const keyPointMatches = question.keyPoints.filter(point => {
          const pointWords = point.toLowerCase().split(/\s+/)
          return pointWords.some(word => word.length > 4 && answerLower.includes(word))
        })
        relevanceScore = Math.min(100, Math.max(40, (keyPointMatches.length / question.keyPoints.length) * 100))
      }
    }

    // Generate feedback based on question type
    let feedback = generateFeedback(question, clarityScore, confidenceScore, relevanceScore, answer)
    
    const result: AnalysisResult = {
      clarityScore: Math.round(clarityScore),
      confidenceScore: Math.round(confidenceScore),
      relevanceScore: Math.round(relevanceScore),
      feedback: feedback.trim()
    }

    // Add correct answer for direct questions
    if (question.type === 'direct' && question.correctAnswer) {
      result.correctAnswer = question.correctAnswer
    }

    // Add key points analysis for behavioral/technical questions
    if (question.type !== 'direct' && question.keyPoints) {
      result.keyPointsAnalysis = analyzeKeyPoints(answer, question.keyPoints)
    }

    return result
  } catch (error) {
    console.error('Error analyzing response:', error)
    // Return fallback scores if AI analysis fails
    const result: AnalysisResult = {
      clarityScore: 75,
      confidenceScore: 70,
      relevanceScore: 80,
      feedback: 'Analysis temporarily unavailable. Keep practicing to improve your interview skills!'
    }

    if (question.type === 'direct' && question.correctAnswer) {
      result.correctAnswer = question.correctAnswer
    }

    return result
  }
}

function generateFeedback(
  question: Question, 
  clarityScore: number, 
  confidenceScore: number, 
  relevanceScore: number,
  answer: string
): string {
  let feedback = ''
  
  if (question.type === 'direct') {
    // Feedback for direct answer questions
    if (relevanceScore < 60) {
      feedback += 'Your answer doesn\'t fully address the technical concepts asked. Review the correct answer below to understand what was expected. '
    } else if (relevanceScore < 80) {
      feedback += 'You touched on some key points but could be more comprehensive. Check the correct answer for additional details. '
    } else {
      feedback += 'Good technical understanding! Your answer covers the main concepts well. '
    }
    
    if (clarityScore < 60) {
      feedback += 'Try to be more specific and detailed in your explanations. '
    }
    
    if (confidenceScore < 60) {
      feedback += 'Use more assertive language to demonstrate confidence in your technical knowledge. '
    }
  } else {
    // Feedback for behavioral/technical questions
    if (relevanceScore < 60) {
      feedback += 'Your answer could better address the key aspects of this question. Consider the key points listed below. '
    } else if (relevanceScore < 80) {
      feedback += 'You covered some important points but could expand on others. '
    } else {
      feedback += 'Excellent! You addressed the key aspects of this question well. '
    }
    
    if (clarityScore < 60) {
      feedback += 'Provide more specific examples and details to make your answer clearer. '
    }
    
    if (confidenceScore < 60) {
      feedback += 'Use more confident language and speak about your experiences with conviction. '
    }
    
    // Specific advice based on question type
    if (question.type === 'behavioral') {
      if (answer.length < 100) {
        feedback += 'For behavioral questions, use the STAR method (Situation, Task, Action, Result) to structure your response. '
      }
    }
  }
  
  if (!feedback) {
    feedback = 'Great response! You demonstrated good clarity, confidence, and relevance. Keep up the excellent work!'
  }
  
  return feedback
}

function analyzeKeyPoints(answer: string, keyPoints: string[]): string[] {
  const answerLower = answer.toLowerCase()
  const coveredPoints: string[] = []
  const missedPoints: string[] = []
  
  keyPoints.forEach(point => {
    const pointWords = point.toLowerCase().split(/\s+/)
    const hasMatch = pointWords.some(word => word.length > 4 && answerLower.includes(word))
    
    if (hasMatch) {
      coveredPoints.push(`✓ ${point}`)
    } else {
      missedPoints.push(`○ ${point}`)
    }
  })
  
  return [...coveredPoints, ...missedPoints]
}