"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, User, Loader2, X } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface AIChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  walletContext?: string
}

export function AIChatSidebar({ isOpen, onClose, walletContext }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm your AI assistant for wallet analysis. I can help you understand blockchain data, analyze wallet behavior, and provide insights about your connected wallet${
          walletContext ? ` (${walletContext.substring(0, 10)}...)` : ""
        }. What would you like to know?`,
        timestamp: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, walletContext])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          context: { walletAddress: walletContext },
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: data.timestamp,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to get AI response")
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 bg-white">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-600" />
              <SheetTitle className="text-slate-900">AI Assistant</SheetTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={clearChat} className="text-slate-500 hover:text-slate-700">
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500 hover:text-slate-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <SheetDescription className="text-slate-500">
            Ask questions about wallet analysis, blockchain data, and trading insights
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-900 border border-slate-200"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === "assistant" && <Bot className="h-4 w-4 mt-0.5 text-purple-600" />}
                      {message.role === "user" && <User className="h-4 w-4 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.role === "user" ? "text-purple-200" : "text-slate-500"}`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-900 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-slate-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-slate-200 pt-4 mt-4">
            {walletContext && (
              <div className="mb-3">
                <Badge variant="outline" className="text-purple-600 border-purple-600 text-xs">
                  Context: {walletContext.substring(0, 10)}...
                </Badge>
              </div>
            )}
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about wallet analysis, trading patterns..."
                className="flex-1 bg-slate-50 border-slate-300 text-slate-900"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
