"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Wallet,
  Zap,
  Brain,
  Target,
  Bell,
  Users,
  TrendingUp,
  Shield,
  Database,
  Wifi,
  Clock,
  DollarSign,
  CalendarDays,
  ArrowRight,
  CheckCircle,
  Activity,
  BarChart3,
  Github,
  Twitter,
  FileText,
  Play,
  ExternalLink,
} from "lucide-react"

export default function LandingPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false)
      // Save wallet address to localStorage for persistence
      const mockWalletAddress = "0x1234567890abcdef1234567890abcdef12345678"
      localStorage.setItem("connectedWallet", mockWalletAddress)

      // Show success toast
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)

      // Redirect to dashboard after successful connection
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully connected to wallet 0x1234...5678
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">INSIDER</h1>
                <p className="text-slate-500">Sei Blockchain Analytics & Monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Advanced Wallet Behavior
            <span className="text-purple-600"> Analytics</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Monitor wallet behaviors, predict investment strategies, track token unlocks, and receive real-time alerts
            for anomalies on the Sei blockchain ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
            >
              {isConnecting ? "Connecting..." : "Get Started"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-slate-300 text-slate-700 bg-transparent"
              onClick={() => window.open("https://youtu.be/demo-video", "_blank")}
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Demo Preview Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">See INSIDER in Action</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Watch how our AI-powered platform analyzes wallet behaviors and provides actionable insights
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
              {/* Demo GIF Placeholder */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Interactive Demo</h3>
                <p className="text-slate-600 mb-4">3-minute walkthrough of key features</p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.open("https://youtu.be/demo-video", "_blank")}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white border-slate-200 shadow-sm text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900">2,847</div>
              <p className="text-slate-500">Active Wallets Monitored</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900">$1.2M</div>
              <p className="text-slate-500">Daily Volume Tracked</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm text-center">
            <CardContent className="pt-6">
              <Bell className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900">47</div>
              <p className="text-slate-500">Alerts Sent Today</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200 shadow-sm text-center">
            <CardContent className="pt-6">
              <CalendarDays className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-slate-900">12</div>
              <p className="text-slate-500">Upcoming Token Unlocks</p>
            </CardContent>
          </Card>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-slate-200 shadow-sm text-center p-6">
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-slate-900 text-xl">1. Connect & Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500">
                  Connect your wallet and start monitoring transaction patterns, DeFi interactions, and token movements
                  in real-time.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm text-center p-6">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-slate-900 text-xl">2. AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500">
                  Our AI engine analyzes behavior patterns, identifies trading strategies, and predicts future wallet
                  activities with 89% accuracy.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm text-center p-6">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-slate-900 text-xl">3. Smart Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500">
                  Get actionable insights on token unlocks, whale movements, and market opportunities based on wallet
                  behavior data.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm text-center p-6">
              <CardHeader>
                <Bell className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-slate-900 text-xl">4. Real-time Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500">
                  Receive instant notifications via Telegram, Discord, or email for critical events and anomalies.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Backend Architecture Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Backend Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-600 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Collection
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Sei RPC WebSocket</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">CryptoRank API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Messari API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Cron Jobs (6h interval)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Real-time Processing
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">WebSocket Listeners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">On-chain Event Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">MongoDB/Postgres</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Status Confirmation</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-600 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                API Endpoints
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">/api/unlocks/list</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">/api/unlocks/next</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">/api/unlocks/impact</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">/api/subscribe</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-600 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Alert System
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Telegram Bots</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Discord Webhooks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Email Notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Real-time Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Technical Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Detection Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Token Unlock Detection</span>
                    <span className="text-slate-700">98%</span>
                  </div>
                  <Progress value={98} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Whale Movement</span>
                    <span className="text-slate-700">94%</span>
                  </div>
                  <Progress value={94} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Anomaly Detection</span>
                    <span className="text-slate-700">89%</span>
                  </div>
                  <Progress value={89} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Real-time Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-slate-700">API Response: &lt;300ms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="text-slate-700">Alert Delivery: &lt;60s</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="text-slate-700">Data Points: 1.2M/hour</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Uptime: 99.9%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Data Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Off-chain Fetch (6h)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">On-chain Confirmation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Status Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Alert Routing</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Use Cases & Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-purple-50 border-purple-200 shadow-sm">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-purple-600 mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">Investors</h4>
                <p className="text-sm text-slate-700">
                  Track whale movements, understand investment strategies, and anticipate market movements before they
                  happen.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200 shadow-sm">
              <CardContent className="pt-6">
                <Brain className="h-8 w-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">Developers</h4>
                <p className="text-sm text-slate-700">
                  Build smarter AI agents and trading bots with precise wallet behavior data and real-time insights.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200 shadow-sm">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-green-600 mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">Traders</h4>
                <p className="text-sm text-slate-700">
                  React quickly to token unlock events, volume spikes, and whale activities with real-time alerts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200 shadow-sm">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-orange-600 mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">Auditors</h4>
                <p className="text-sm text-slate-700">
                  Monitor suspicious activities, compliance violations, and risk management for institutional clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-slate-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Start Monitoring?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect your wallet and get instant access to advanced analytics, real-time alerts, and AI-powered insights
            for the Sei blockchain.
          </p>
          <Button
            size="lg"
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet & Get Started"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </section>
      </div>

      {/* Enhanced Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-slate-900">INSIDER</span>
              </div>
              <p className="text-slate-500 text-sm">
                Advanced blockchain analytics and monitoring platform for the Sei ecosystem.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/api-docs" className="text-slate-500 hover:text-purple-600 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="/sdk" className="text-slate-500 hover:text-purple-600 flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    SDK Reference
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/your-repo"
                    className="text-slate-500 hover:text-purple-600 flex items-center"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-slate-500 hover:text-purple-600">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/about" className="text-slate-500 hover:text-purple-600">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/careers" className="text-slate-500 hover:text-purple-600">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-slate-500 hover:text-purple-600">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/press" className="text-slate-500 hover:text-purple-600">
                    Press Kit
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/terms" className="text-slate-500 hover:text-purple-600">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-slate-500 hover:text-purple-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-slate-500 hover:text-purple-600">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-slate-200">
            <p className="text-slate-500 text-sm">© 2025 Sei Blockchain Analytics. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="https://github.com/your-repo" className="text-slate-500 hover:text-purple-600">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/your-handle" className="text-slate-500 hover:text-purple-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://discord.gg/your-server" className="text-slate-500 hover:text-purple-600">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
