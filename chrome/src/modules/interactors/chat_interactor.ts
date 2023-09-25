export interface ChatInteractor {
    isGenerating: boolean
    clear(): void
    paste(text: string): void
    send(): void
    stopGenerating(): void
}