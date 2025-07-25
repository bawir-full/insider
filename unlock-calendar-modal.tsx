"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ChevronRight } from "lucide-react"

interface UnlockEvent {
  id: string
  date: Date
  token: string
  amount: number
  usdValue: number
  type: "cliff" | "linear"
  status: "PENDING" | "CONFIRMED"
}

interface UnlockCalendarModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UnlockCalendarModal({ isOpen, onClose }: UnlockCalendarModalProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedEvent, setSelectedEvent] = useState<UnlockEvent | undefined>(undefined)
  const [unlockEvents, setUnlockEvents] = useState<UnlockEvent[]>([])

  useEffect(() => {
    const fetchUnlockEvents = async () => {
      try {
        const response = await fetch("/api/unlocks/list?range=90") // Fetch unlocks for next 90 days
        const data = await response.json()
        // Convert unlockDate string back to Date objects
        const parsedData = data.map((event: any) => ({
          ...event,
          date: new Date(event.unlockDate),
        }))
        setUnlockEvents(parsedData)
      } catch (error) {
        console.error("Failed to fetch unlock events:", error)
      }
    }
    fetchUnlockEvents()
  }, [])

  const filteredEvents = selectedDate
    ? unlockEvents.filter((event) => format(event.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
    : unlockEvents

  const handlePreviewImpact = () => {
    if (selectedEvent) {
      router.push(`/strategy-intelligence?token=${selectedEvent.token}&eventId=${selectedEvent.id}`)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Token Unlocks Calendar</DialogTitle>
          <DialogDescription className="text-slate-500">
            Explore upcoming token unlock events on Sei blockchain with real-time status updates.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Calendar View */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 text-slate-900">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border bg-slate-50"
            />
          </div>

          {/* Event List */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-2 text-slate-900">Unlock Events</h3>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-slate-50">
              {unlockEvents.length === 0 && !selectedDate ? (
                <p className="text-center text-slate-500">Loading unlock events...</p>
              ) : filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedEvent?.id === event.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-slate-200 bg-white hover:bg-slate-100"
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">
                          {format(event.date, "MMM dd, yyyy")} - {event.token}
                        </span>
                        <div className="flex space-x-2">
                          <Badge className={`${event.type === "cliff" ? "bg-red-500" : "bg-blue-500"} text-white`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                          <Badge
                            className={`${event.status === "CONFIRMED" ? "bg-green-500" : "bg-yellow-500"} text-white`}
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700">
                        {event.amount.toLocaleString()} tokens (
                        {event.usdValue.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                        )
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500">No unlock events for this date.</p>
              )}
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
          >
            Close
          </Button>
          <Button onClick={handlePreviewImpact} disabled={!selectedEvent} className="bg-purple-600 hover:bg-purple-700">
            Preview Impact <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
