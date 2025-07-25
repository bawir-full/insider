import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "INSIDER - Sei Blockchain Analytics API",
      version: "1.0.0",
      description: "Comprehensive API for Sei blockchain wallet behavior analysis and monitoring",
      contact: {
        name: "INSIDER Team",
        url: "https://github.com/your-repo",
        email: "support@insider.dev",
      },
    },
    servers: [
      {
        url: "https://v0-sei-blockchain-analytics.vercel.app",
        description: "Production server",
      },
    ],
    paths: {
      "/api/ai/insight": {
        post: {
          summary: "Get AI-powered wallet insights",
          tags: ["AI"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    walletAddress: { type: "string", example: "0x1234567890abcdef..." },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "AI insights generated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "object",
                        properties: {
                          summary: { type: "string" },
                          riskScore: { type: "number" },
                          recommendation: { type: "string", enum: ["Hold", "Sell", "Hedge", "Buy More"] },
                          reasoning: { type: "string" },
                          confidence: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/insights/{wallet}": {
        get: {
          summary: "Get comprehensive wallet insights",
          tags: ["Analytics"],
          parameters: [
            {
              name: "wallet",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Wallet address",
            },
          ],
          responses: {
            200: {
              description: "Wallet insights retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      walletAddress: { type: "string" },
                      spendingPattern: { type: "object" },
                      topTokens: { type: "array" },
                      whaleTransfers: { type: "array" },
                      activityHeatmap: { type: "array" },
                      behaviorMetrics: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/alerts/anomalies": {
        get: {
          summary: "Get real-time anomaly alerts",
          tags: ["Alerts"],
          parameters: [
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
              description: "Number of alerts to return",
            },
            {
              name: "severity",
              in: "query",
              schema: { type: "string", enum: ["critical", "warning", "info"] },
              description: "Filter by severity level",
            },
          ],
          responses: {
            200: {
              description: "Anomaly alerts retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        type: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        time: { type: "string" },
                        category: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/unlocks/list": {
        get: {
          summary: "Get upcoming token unlocks",
          tags: ["Unlocks"],
          parameters: [
            {
              name: "range",
              in: "query",
              schema: { type: "string", default: "30d" },
              description: "Time range for unlocks (e.g., 7d, 30d, 90d)",
            },
          ],
          responses: {
            200: {
              description: "Token unlocks retrieved successfully",
            },
          },
        },
      },
      "/api/unlocks/impact": {
        get: {
          summary: "Get unlock impact analysis",
          tags: ["Unlocks"],
          parameters: [
            {
              name: "address",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: "Wallet address",
            },
            {
              name: "eventId",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: "Unlock event ID",
            },
          ],
          responses: {
            200: {
              description: "Impact analysis completed successfully",
            },
          },
        },
      },
      "/api/subscribe": {
        post: {
          summary: "Subscribe to alerts",
          tags: ["Alerts"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    walletAddress: { type: "string" },
                    alertType: { type: "string" },
                    channel: { type: "string" },
                    eventId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Subscription created successfully",
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
  }

  // Return Swagger UI HTML
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>INSIDER API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin:0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
  `

  res.setHeader("Content-Type", "text/html")
  res.status(200).send(html)
}
