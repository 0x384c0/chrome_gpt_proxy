interface ChatInteractor {
    clear(): void
    paste(text: string): void
    send(text: string): void
    isGenerating: boolean
    stopGenerating(): void
}