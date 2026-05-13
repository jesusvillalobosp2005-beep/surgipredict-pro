/**
 * SurgiPredict Pro Backend Server
 * Node.js + Express + Anthropic API Integration
 * 
 * Run: node server.js
 * Default port: 5000
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

/**
 * ENDPOINT 1: Analyze Patient Image
 * POST /api/analyze-image
 * Analyzes facial features and returns metrics
 */
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Optimize image
    const optimizedPath = path.join(uploadsDir, `optimized_${req.file.filename}.jpg`);
    await sharp(req.file.path)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(optimizedPath);

    // Read optimized image
    const imageBuffer = await fs.readFile(optimizedPath);
    const base64Image = imageBuffer.toString('base64');

    // Analyze with Claude Vision
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `You are an expert in facial analysis for plastic surgery. Analyze this photo and provide:

1. Facial proportions assessment
2. Symmetry analysis
3. Key aesthetic features (nose, lips, jawline, cheekbones)
4. Skin quality assessment
5. Recommended areas for enhancement
6. Baseline measurements for comparison

Provide response in JSON format with these fields:
{
  "proportions": {"goldenRatio": number, "assessment": string},
  "symmetry": {"percentage": number, "areas": [string]},
  "features": {"nose": {}, "lips": {}, "jawline": {}, "cheekbones": {}},
  "skinQuality": {"elasticity": string, "thickness": string, "condition": string},
  "recommendations": [string],
  "baselineMeasurements": {}
}`,
            },
          ],
        },
      ],
    });

    // Clean up uploaded file
    await fs.unlink(req.file.path).catch(() => {});

    const analysisText = response.content[0]?.text || '';
    
    // Extract JSON from response
    let analysis = {};
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      analysis = { raw: analysisText };
    }

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

/**
 * ENDPOINT 2: Generate Surgical Recommendations
 * POST /api/recommendations
 * AI-powered surgical recommendations based on patient data
 */
app.post('/api/recommendations', async (req, res) => {
  try {
    const {
      patientData,
      parameters,
      technique,
      analysisResults,
    } = req.body;

    if (!patientData || !parameters) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `You are an expert plastic surgeon with 20+ years of experience. Analyze the following case and provide comprehensive surgical recommendations.

PATIENT INFORMATION:
- Name: ${patientData.name}
- Age: ${patientData.age}
- Gender: ${patientData.gender}
- Skin Type (Fitzpatrick): ${patientData.skinType}
- Ethnicity: ${patientData.ethnicity}
- Medical History: ${patientData.medicalHistory?.join(', ') || 'None'}
- Allergies: ${patientData.allergies?.join(', ') || 'None'}
- Current Medications: ${patientData.medications?.join(', ') || 'None'}

SURGICAL GOALS & PARAMETERS:
- Nasal Bridge Modification: ${parameters.noseBridge}
- Nasal Width Modification: ${parameters.noseWidth}
- Lip Volume Enhancement: ${parameters.lipsVolume}
- Jawline Enhancement: ${parameters.jawline}
- Cheekbone Projection: ${parameters.cheekbones}
- Skin Tightness/Support: ${parameters.skinTightness}
- Asymmetry Correction: ${parameters.asymmetryCorrection}

FACIAL ANALYSIS RESULTS:
${JSON.stringify(analysisResults, null, 2)}

PREFERRED SURGICAL TECHNIQUE: ${technique || 'Open to recommendations'}

Please provide a detailed surgical recommendation covering:

1. FEASIBILITY ASSESSMENT
   - Is this combination of procedures realistic and safe?
   - What are the limitations based on patient anatomy?
   - Expected outcomes timeline

2. SURGICAL PLAN
   - Recommended techniques for each modification
   - Incision locations and approach
   - Key surgical steps
   - Special considerations for this patient's ethnicity and skin type
   - Anticipated challenges

3. PHYSIOGNOMIC CONSIDERATIONS
   - Impact on facial balance and harmony
   - Ethnic aesthetic preservation
   - Natural appearance criteria
   - Gender-specific considerations

4. HEALING & SCARRING ANALYSIS
   - Expected healing timeline by procedure
   - Scar maturation timeline
   - Scarring risk factors (based on skin type)
   - Scar minimization techniques
   - When final results will be visible

5. RECOVERY PROTOCOL
   - Week-by-week recovery expectations
   - Activity restrictions
   - Medication protocol
   - Follow-up schedule
   - Signs of complications to watch

6. RISKS & COMPLICATIONS
   - Procedure-specific risks
   - Infection prevention
   - Revision rates
   - Patient-specific risk factors
   - Mitigation strategies

7. ALTERNATIVE APPROACHES
   - Less invasive alternatives
   - Combination techniques
   - Staged procedures
   - Non-surgical alternatives

8. REALISTIC EXPECTATIONS
   - What patient will look like at 1 week
   - What patient will look like at 1 month
   - What patient will look like at 6 months
   - Final result timeline
   - Range of acceptable outcomes

9. PATIENT COUNSELING POINTS
   - Key points to discuss with patient
   - Consent form considerations
   - Troubleshooting common patient concerns
   - Managing expectations

10. COMPARATIVE ANALYSIS
    - How results differ if using alternative techniques
    - Pro/con comparison
    - Cost-benefit analysis`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const recommendations = response.content[0]?.text || '';

    res.json({
      success: true,
      recommendations,
      generatedAt: new Date().toISOString(),
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

/**
 * ENDPOINT 3: Compare Surgical Techniques
 * POST /api/compare-techniques
 * Compares different surgical approaches
 */
app.post('/api/compare-techniques', async (req, res) => {
  try {
    const { patientData, parameters, techniques } = req.body;

    if (!techniques || techniques.length < 2) {
      return res.status(400).json({ error: 'At least 2 techniques required for comparison' });
    }

    const techniquesList = techniques.map(t => `- ${t.name}: ${t.description}`).join('\n');

    const prompt = `Compare these surgical techniques for a plastic surgery case:

PATIENT:
- Age: ${patientData.age}
- Skin Type: ${patientData.skinType}
- Ethnicity: ${patientData.ethnicity}

SURGICAL GOALS:
${JSON.stringify(parameters, null, 2)}

TECHNIQUES TO COMPARE:
${techniquesList}

Please provide a detailed comparison including:
1. Recovery time
2. Final results timeline
3. Scar characteristics
4. Risk profile
5. Cost implications
6. Learning curve for surgeon
7. Patient satisfaction rates
8. Best suited for this patient's anatomy
9. Pros and cons summary

Format as JSON with technique names as keys.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const comparison = response.content[0]?.text || '';

    res.json({
      success: true,
      comparison,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Technique comparison error:', error);
    res.status(500).json({ error: 'Failed to compare techniques' });
  }
});

/**
 * ENDPOINT 4: Generate Medical Report
 * POST /api/generate-report
 * Creates a formatted medical report
 */
app.post('/api/generate-report', async (req, res) => {
  try {
    const {
      patientData,
      parameters,
      analysisResults,
      recommendations,
      technique,
      beforeImage,
      afterImage,
    } = req.body;

    const report = {
      title: 'SURGICAL PREDICTION REPORT',
      generatedDate: new Date().toLocaleDateString('es-ES'),
      patientInfo: patientData,
      surgicalParameters: parameters,
      facialAnalysis: analysisResults,
      recommendedTechnique: technique,
      clinicalRecommendations: recommendations,
      beforeImage: beforeImage ? 'Included' : 'Not provided',
      afterImage: afterImage ? 'Included' : 'Not provided',
      disclaimers: [
        'This report is generated with AI assistance and should be reviewed by a qualified plastic surgeon.',
        'Patient outcomes depend on multiple factors including surgical skill, post-operative care, and individual healing response.',
        'All recommendations are based on provided information and may change upon in-person consultation.',
        'This is not a substitute for professional medical advice.',
      ],
    };

    res.json({
      success: true,
      report,
      format: 'JSON',
      recommendation: 'Convert to PDF for medical records',
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

/**
 * ENDPOINT 5: Health Check
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    apiKey: process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing',
  });
});

/**
 * ENDPOINT 6: Rate Limiting Check
 * GET /api/rate-limit
 */
app.get('/api/rate-limit', (req, res) => {
  res.json({
    rateLimit: {
      requestsPerMinute: 50,
      tokensPerMinute: 50000,
      currentUsage: 0,
    },
    recommendation: 'Monitor token usage for optimal performance',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           SurgiPredict Pro Backend Server                  ║
║           Running on http://localhost:${PORT}                   ║
╚═══════════════════════════════════════════════════════════╝

Available Endpoints:
- POST   /api/analyze-image         (Image analysis)
- POST   /api/recommendations       (AI recommendations)
- POST   /api/compare-techniques    (Technique comparison)
- POST   /api/generate-report       (Report generation)
- GET    /api/health                (Health check)
- GET    /api/rate-limit            (Rate limit info)

Make sure ANTHROPIC_API_KEY is set in .env file
  `);
});

module.exports = app;
