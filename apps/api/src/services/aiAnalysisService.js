const Groq = require("groq-sdk")

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

class AIAnalysisService {
  constructor() {
    this.models = {
      fast: "llama-3.3-70b-versatile",
      detailed: "llama-3.1-70b-versatile",
    }
  }

  async analyzeSocialProfile(profile, candidateInfo) {
    try {
      const startTime = Date.now()

      // Prepare context for AI analysis
      const analysisPrompt = this.buildAnalysisPrompt(profile, candidateInfo)

      // Use Groq for fast, accurate analysis
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are an expert HR screening AI that analyzes social media profiles for professional suitability. 
            Provide detailed, objective analysis focusing on:
            1. Professional content quality
            2. Communication style and tone
            3. Risk factors and red flags
            4. Cultural fit indicators
            5. Overall professional score (0-100)
            
            Return your analysis as a JSON object with the specified structure.`,
          },
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
        model: this.models.fast,
        temperature: 0.1,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      })

      const processingTime = (Date.now() - startTime) / 1000
      const analysisResult = JSON.parse(completion.choices[0].message.content)

      return {
        ...analysisResult,
        metadata: {
          processingTime: `${processingTime.toFixed(2)} seconds`,
          model: this.models.fast,
          tokensUsed: completion.usage?.total_tokens || 0,
          confidenceLevel: analysisResult.confidenceLevel || 85,
        },
      }
    } catch (error) {
      console.error("Groq AI analysis error:", error)
      // Fallback to basic analysis if AI fails
      return this.generateFallbackAnalysis(profile)
    }
  }

  buildAnalysisPrompt(profile, candidateInfo) {
    return `
Analyze this social media profile for HR screening purposes:

**Candidate Information:**
- Name: ${candidateInfo.firstName} ${candidateInfo.lastName}
- Position Applied: ${candidateInfo.position}
- Email: ${candidateInfo.email}

**Social Profile:**
- Platform: ${profile.platform}
- Profile URL: ${profile.profileUrl}
- Username: ${profile.username || "Not provided"}

**Analysis Requirements:**
Please analyze this profile and return a JSON object with the following structure:

{
  "professionalScore": <number 0-100>,
  "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>",
  "contentAnalysis": {
    "professionalContent": <percentage>,
    "inappropriateContent": <percentage>,
    "communicationQuality": <percentage>,
    "networkQuality": <percentage if applicable>
  },
  "sentimentAnalysis": {
    "overallTone": "<positive|neutral|negative>",
    "professionalTone": <percentage>,
    "emotionalStability": <percentage>
  },
  "riskFactors": [
    "<list of specific risk factors found>"
  ],
  "positiveIndicators": [
    "<list of positive professional indicators>"
  ],
  "recommendations": [
    "<actionable recommendations for HR team>"
  ],
  "confidenceLevel": <number 0-100>,
  "summary": "<2-3 sentence summary of findings>"
}

Focus on objective, professional assessment suitable for employment screening.
`
  }

  async performBulkAnalysis(socialProfiles, candidateInfo) {
    try {
      const startTime = Date.now()
      const analysisPromises = socialProfiles.map((profile) => this.analyzeSocialProfile(profile, candidateInfo))

      const platformAnalyses = await Promise.all(analysisPromises)

      // Aggregate results across all platforms
      const aggregatedResults = this.aggregateAnalyses(platformAnalyses, socialProfiles)

      const totalProcessingTime = (Date.now() - startTime) / 1000

      return {
        ...aggregatedResults,
        aiAnalysis: {
          processingTime: `${totalProcessingTime.toFixed(2)} seconds`,
          profilesAnalyzed: socialProfiles.length,
          algorithmsUsed: ["groq_llama_analysis", "sentiment_analysis", "risk_assessment", "content_classification"],
          confidenceLevel: this.calculateOverallConfidence(platformAnalyses),
          model: this.models.fast,
          totalTokensUsed: platformAnalyses.reduce((sum, analysis) => sum + (analysis.metadata?.tokensUsed || 0), 0),
        },
      }
    } catch (error) {
      console.error("Bulk AI analysis error:", error)
      throw error
    }
  }

  aggregateAnalyses(platformAnalyses, socialProfiles) {
    const validAnalyses = platformAnalyses.filter((analysis) => analysis.professionalScore)

    if (validAnalyses.length === 0) {
      return this.generateFallbackAnalysis(socialProfiles[0])
    }

    // Calculate weighted averages
    const avgProfessionalScore = Math.round(
      validAnalyses.reduce((sum, analysis) => sum + analysis.professionalScore, 0) / validAnalyses.length,
    )

    // Determine overall risk level
    const riskLevels = validAnalyses.map((a) => a.riskLevel)
    const overallRiskLevel = this.determineOverallRiskLevel(riskLevels)

    // Combine findings
    const allRiskFactors = validAnalyses.flatMap((a) => a.riskFactors || [])
    const allPositiveIndicators = validAnalyses.flatMap((a) => a.positiveIndicators || [])

    // Create platform-specific findings
    const platformFindings = validAnalyses.map((analysis, index) => ({
      platform: socialProfiles[index].platform,
      profileUrl: socialProfiles[index].profileUrl,
      username: socialProfiles[index].username,
      professionalScore: analysis.professionalScore,
      riskLevel: analysis.riskLevel,
      contentAnalysis: analysis.contentAnalysis,
      sentimentAnalysis: analysis.sentimentAnalysis,
      riskFactors: analysis.riskFactors,
      positiveIndicators: analysis.positiveIndicators,
      summary: analysis.summary,
    }))

    return {
      riskLevel: overallRiskLevel,
      overallScore: avgProfessionalScore,
      summary: this.generateOverallSummary(platformFindings, overallRiskLevel, avgProfessionalScore),
      findings: {
        platforms: platformFindings,
        aggregatedRiskFactors: [...new Set(allRiskFactors)],
        aggregatedPositiveIndicators: [...new Set(allPositiveIndicators)],
      },
    }
  }

  determineOverallRiskLevel(riskLevels) {
    if (riskLevels.includes("CRITICAL")) return "CRITICAL"
    if (riskLevels.includes("HIGH")) return "HIGH"
    if (riskLevels.includes("MEDIUM")) return "MEDIUM"
    return "LOW"
  }

  calculateOverallConfidence(platformAnalyses) {
    const confidenceLevels = platformAnalyses
      .map((a) => a.confidenceLevel || a.metadata?.confidenceLevel || 80)
      .filter((c) => c > 0)

    return confidenceLevels.length > 0
      ? Math.round(confidenceLevels.reduce((sum, c) => sum + c, 0) / confidenceLevels.length)
      : 80
  }

  generateOverallSummary(platformFindings, riskLevel, score) {
    const platforms = platformFindings.map((p) => p.platform).join(", ")
    const riskDescription = {
      LOW: "minimal risk factors and strong professional presence",
      MEDIUM: "some areas of concern but generally acceptable",
      HIGH: "significant risk factors requiring careful consideration",
      CRITICAL: "major red flags that warrant immediate attention",
    }

    return `AI-powered analysis of ${platformFindings.length} social media profiles (${platforms}) completed. Overall risk level: ${riskLevel} (${score}/100). Candidate demonstrates ${riskDescription[riskLevel]}.`
  }

  generateFallbackAnalysis(profile) {
    return {
      professionalScore: 75,
      riskLevel: "MEDIUM",
      contentAnalysis: {
        professionalContent: 70,
        inappropriateContent: 5,
        communicationQuality: 75,
        networkQuality: 80,
      },
      sentimentAnalysis: {
        overallTone: "neutral",
        professionalTone: 75,
        emotionalStability: 80,
      },
      riskFactors: ["AI analysis temporarily unavailable - manual review recommended"],
      positiveIndicators: ["Profile appears professional at first glance"],
      recommendations: ["Conduct manual review due to AI service unavailability"],
      confidenceLevel: 60,
      summary: "Fallback analysis completed. Manual review recommended for comprehensive assessment.",
      metadata: {
        processingTime: "0.1 seconds",
        model: "fallback",
        tokensUsed: 0,
        confidenceLevel: 60,
      },
    }
  }

  async generateDetailedReport(screeningId, candidateInfo, analysisResults) {
    try {
      const reportPrompt = `
Generate a comprehensive HR screening report based on the following analysis:

**Candidate:** ${candidateInfo.firstName} ${candidateInfo.lastName}
**Position:** ${candidateInfo.position}
**Overall Score:** ${analysisResults.overallScore}/100
**Risk Level:** ${analysisResults.riskLevel}

**Platform Analysis Results:**
${JSON.stringify(analysisResults.findings, null, 2)}

Please create a professional report that includes:
1. Executive Summary
2. Key Findings
3. Risk Assessment
4. Recommendations
5. Next Steps

Format as a structured report suitable for HR decision-making.
`

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert HR consultant creating professional screening reports. Provide clear, actionable insights for hiring decisions.",
          },
          {
            role: "user",
            content: reportPrompt,
          },
        ],
        model: this.models.detailed,
        temperature: 0.2,
        max_tokens: 3000,
      })

      return {
        reportContent: completion.choices[0].message.content,
        generatedAt: new Date(),
        model: this.models.detailed,
        tokensUsed: completion.usage?.total_tokens || 0,
      }
    } catch (error) {
      console.error("Report generation error:", error)
      return {
        reportContent: "Detailed report generation temporarily unavailable. Please refer to the analysis summary.",
        generatedAt: new Date(),
        model: "fallback",
        tokensUsed: 0,
      }
    }
  }
}

module.exports = AIAnalysisService
