"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Clock, DollarSign, Percent, Bell, ArrowLeft } from "lucide-react"
import { formatDistanceToNowStrict, isPast, isToday } from "date-fns"

interface UnlockEventDetail {
  id: string
  unlockDate: string // Changed from Date to string (ISO format from backend)
  token: string
  amount: number
  usdValue: number
  type: "cliff" | "linear"
  status: "PENDING" | "CONFIRMED"
  // These will come from /api/unlocks/impact
  holdingPercentage: number
  volumeDEX_5m: number
  priceChange30m: number
}

export default function StrategyIntelligencePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const eventId = searchParams.get("eventId")
  const [eventDetail, setEventDetail] = useState<UnlockEventDetail | undefined>(undefined)
  const [countdown, setCountdown] = useState<string>("")
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(false)
  const [unlockStatus, setUnlockStatus] = useState<"upcoming" | "live" | "past">("upcoming")
  const [priceData, setPriceData] = useState<any[]>([])

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | undefined

    const fetchEventDetails = async () => {
      if (!eventId) return
      try {
        // Fetch event details
        const eventResponse = await fetch(`/api/unlocks/list?range=365`) // Fetch all unlocks to find by ID
        const allEvents = await eventResponse.json()
        const detail = allEvents.find((e: any) => e.id === eventId)

        if (detail) {
          // Convert unlockDate string to Date object for countdown logic
          const parsedDetail = { ...detail, date: new Date(detail.unlockDate) }
          setEventDetail(parsedDetail)

          // Fetch impact data
          const impactResponse = await fetch(`/api/unlocks/impact?address=0xDummyWallet&eventId=${eventId}`)
          const impactData = await impactResponse.json()
          setEventDetail((prev) => (prev ? { ...prev, ...impactData } : { ...parsedDetail, ...impactData }))

          // Simulate price data based on impact
          const initialPrice = 0.7
          const simulatedPriceData = Array.from({ length: 7 }).map((_, i) => {
            const time = `${String(Math.floor((i * 5) / 60)).padStart(2, "0")}:${String((i * 5) % 60).padStart(2, "0")}`
            const price = initialPrice * (1 + impactData.priceChange30m * (i / 6)) // Distribute change over time
            return { time, price: Number.parseFloat(price.toFixed(3)) }
          })
          setPriceData(simulatedPriceData)

          // Start countdown
          countdownInterval = setInterval(() => {
            const now = new Date()
            if (isPast(parsedDetail.date) && !isToday(parsedDetail.date)) {
              setCountdown("Event has passed")
              setUnlockStatus("past")
              clearInterval(countdownInterval!)
            } else if (
              isToday(parsedDetail.date) &&
              now.getHours() >= parsedDetail.date.getHours() &&
              now.getMinutes() >= parsedDetail.date.getMinutes()
            ) {
              setCountdown("LIVE")
              setUnlockStatus("live")
              clearInterval(countdownInterval!)
            } else {
              setCountdown(formatDistanceToNowStrict(parsedDetail.date, { addSuffix: true }))
              setUnlockStatus("upcoming")
            }
          }, 1000)
        } else {
          console.error("Event not found for ID:", eventId)
        }
      } catch (error) {
        console.error("Failed to fetch event details or impact data:", error)
      }
    }

    fetchEventDetails()

    return () => {
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [eventId])

  if (!eventDetail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-900">
        <p>Loading event details or event not found...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Strategy Intelligence: {eventDetail.token} Unlock Impact
          </h1>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Countdown Card */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">Countdown to Unlock</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{countdown}</div>
              <p className="text-xs text-slate-500">{format(new Date(eventDetail.unlockDate), "MMM dd, yyyy HH:mm")}</p>
              <Badge
                className={`mt-2 ${
                  unlockStatus === "live"
                    ? "bg-green-600 text-white"
                    : unlockStatus === "upcoming"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-500 text-white"
                }`}
              >
                {unlockStatus.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          {/* Unlock Details Card */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">Unlock Details</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {eventDetail.amount.toLocaleString()} {eventDetail.token}
              </div>
              <p className="text-xs text-slate-500">
                Value:{" "}
                {eventDetail.usdValue.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
              <div className="flex space-x-2 mt-2">
                <Badge className={`${eventDetail.type === "cliff" ? "bg-red-600" : "bg-blue-600"} text-white`}>
                  {eventDetail.type.charAt(0).toUpperCase() + eventDetail.type.slice(1)} Unlock
                </Badge>
                <Badge
                  className={`${eventDetail.status === "CONFIRMED" ? "bg-green-600" : "bg-yellow-600"} text-white`}
                >
                  {eventDetail.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Holdings Card */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-900">Your Wallet Holdings</CardTitle>
              <Percent className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{eventDetail.holdingPercentage}%</div>
              <p className="text-xs text-slate-500">of total {eventDetail.token} supply</p>
              <Progress value={eventDetail.holdingPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Price Impact Chart */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Price Impact (30 mins post-unlock)</CardTitle>
              <CardDescription className="text-slate-500">
                Simulated price movement after {eventDetail.token} unlock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="time" stroke="#64748B" />
                    <YAxis stroke="#64748B" domain={["dataMin - 0.02", "dataMax + 0.02"]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        color: "#1E293B",
                      }}
                      itemStyle={{ color: "#1E293B" }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* DEX Trading Volume */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">DEX Trading Volume (5 mins post-unlock)</CardTitle>
              <CardDescription className="text-slate-500">
                Volume on decentralized exchanges immediately after unlock
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <div className="text-5xl font-bold text-green-600">
                ${(eventDetail.volumeDEX_5m / 1000000).toFixed(1)}M
              </div>
              <p className="text-lg text-slate-700 mt-2">in {eventDetail.token} trading volume</p>
              <p className="text-sm text-slate-500">(Data from /api/unlocks/impact)</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscribe Alert Toggle */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Subscribe to Real-time Alerts</CardTitle>
            <CardDescription className="text-slate-500">
              Receive instant notifications for this {eventDetail.token} unlock event via our alert engine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-purple-600" />
                <Label htmlFor="alert-toggle" className="text-slate-700">
                  Enable real-time alerts for {eventDetail.token} unlock
                </Label>
              </div>
              <Switch
                id="alert-toggle"
                checked={isAlertSubscribed}
                onCheckedChange={async (checked) => {
                  setIsAlertSubscribed(checked)
                  if (checked) {
                    try {
                      const response = await fetch("/api/subscribe", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          walletAddress: "0x1234...5678", // Dummy wallet address
                          alertType: "unlock",
                          channel: "telegram,email", // Example channels
                          eventId: eventDetail?.id,
                          token: eventDetail?.token,
                        }),
                      })
                      const data = await response.json()
                      if (data.success) {
                        console.log("Subscription successful:", data.subscription)
                      } else {
                        console.error("Subscription failed:", data.error)
                        setIsAlertSubscribed(false) // Revert if failed
                      }
                    } catch (error) {
                      console.error("Error subscribing to alerts:", error)
                      setIsAlertSubscribed(false) // Revert if failed
                    }
                  }
                }}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
            {isAlertSubscribed && (
              <p className="text-sm text-green-600 mt-4">
                ✅ Alerts enabled! You will receive notifications via Telegram/Discord/Email when this unlock occurs.
                Backend will call /api/subscribe endpoint.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
