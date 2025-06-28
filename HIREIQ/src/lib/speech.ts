export class SpeechService {
  private recognition: SpeechRecognition | null = null
  private isSupported = false

  constructor() {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = 'en-US'
      this.isSupported = true
    }
  }

  isAvailable(): boolean {
    return this.isSupported
  }

  startListening(onResult: (text: string) => void, onError?: (error: string) => void): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported in this browser')
      return
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    this.recognition.onerror = (event) => {
      onError?.(`Speech recognition error: ${event.error}`)
    }

    try {
      this.recognition.start()
    } catch (error) {
      onError?.('Failed to start speech recognition')
    }
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop()
    }
  }
}

export const speechService = new SpeechService()