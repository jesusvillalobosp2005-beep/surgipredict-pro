import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Zap, Settings, Eye, EyeOff, Save, Copy } from 'lucide-react';

export default function SurgiPredictPro() {
  const [activeTab, setActiveTab] = useState('patient');
  const [patientData, setPatientData] = useState({
    name: 'Dr. Paciente',
    age: 35,
    gender: 'Femenino',
    skinType: 'Tipo III',
    ethnicity: 'Latino',
    diagnosis: 'Rinoplastia + Aumento de labios',
  });

  const [parameters, setParameters] = useState({
    noseBridge: 0,
    noseWidth: 0,
    lipsVolume: 0,
    jawline: 0,
    cheekbones: 0,
    skinTightness: 0,
    asymmetryCorrection: 0,
  });

  const [showAI, setShowAI] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [technique, setTechnique] = useState('traditional');
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const canvasRef = useRef(null);

  // Simulación de canvas para visualización 3D
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      // Gradient background luxury
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Grid luxury
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Face outline with modifications
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const centerX = width / 2;
      const centerY = height / 2;
      const scale = 60 + parameters.jawline;

      // Cara elipse modificada
      ctx.ellipse(centerX, centerY, scale + parameters.noseWidth / 20, scale + parameters.jawline / 15, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Nariz
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 20);
      ctx.lineTo(centerX + 5 + parameters.noseBridge / 20, centerY + 10);
      ctx.lineTo(centerX - 5 + parameters.noseBridge / 20, centerY + 10);
      ctx.closePath();
      ctx.stroke();

      // Labios
      ctx.strokeStyle = '#ff6b9d';
      ctx.lineWidth = 3 + parameters.lipsVolume / 30;
      ctx.beginPath();
      ctx.quadraticCurveTo(centerX, centerY + 35 + parameters.lipsVolume / 20, centerX + 20, centerY + 40);
      ctx.stroke();
      ctx.beginPath();
      ctx.quadraticCurveTo(centerX, centerY + 35 + parameters.lipsVolume / 20, centerX - 20, centerY + 40);
      ctx.stroke();

      // Pómulos
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX - 25, centerY, 8 + parameters.cheekbones / 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX + 25, centerY, 8 + parameters.cheekbones / 30, 0, Math.PI * 2);
      ctx.stroke();

      // Ojos
      ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
      ctx.beginPath();
      ctx.arc(centerX - 15, centerY - 15, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 15, centerY - 15, 3, 0, Math.PI * 2);
      ctx.fill();

      // Indicator de skin condition
      ctx.strokeStyle = `rgba(144, 238, 144, ${0.3 + parameters.skinTightness / 300})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, scale + parameters.noseWidth / 20 - 5, scale + parameters.jawline / 15 - 5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [parameters]);

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'before') setBeforeImage(event.target.result);
        else setAfterImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchAIRecommendations = async () => {
    setLoading(true);
    try {
      const prompt = `Eres un cirujano plástico experto. Analiza estos parámetros del paciente y proporciona recomendaciones quirúrgicas personalizadas:

Datos del paciente:
- Nombre: ${patientData.name}
- Edad: ${patientData.age}
- Sexo: ${patientData.gender}
- Tipo de piel: ${patientData.skinType}
- Etnicidad: ${patientData.ethnicity}
- Diagnóstico: ${patientData.diagnosis}

Parámetros de modificación:
- Puente nasal: ${parameters.noseBridge}
- Ancho nasal: ${parameters.noseWidth}
- Volumen de labios: ${parameters.lipsVolume}
- Línea mandibular: ${parameters.jawline}
- Pómulos: ${parameters.cheekbones}
- Elasticidad de piel: ${parameters.skinTightness}
- Corrección de asimetría: ${parameters.asymmetryCorrection}

Técnica quirúrgica seleccionada: ${technique}

Por favor proporciona:
1. Análisis de factores fisiognómicos clave
2. Viabilidad de los objetivos estéticos propuestos
3. Consideraciones sobre cicatrización y recuperación
4. Riesgos y limitaciones específicas
5. Alternativas de técnicas quirúrgicas
6. Estimación de recuperación y resultados a corto/largo plazo`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content[0]?.text || 'No recommendations available';
      setAiRecommendations(text);
    } catch (error) {
      setAiRecommendations('Error fetching recommendations. Please try again.');
    }
    setLoading(false);
  };

  const generateReport = () => {
    const reportContent = `
╔════════════════════════════════════════════════════════════════╗
║        SURGIPREDICT PRO - SURGICAL PREDICTION REPORT           ║
║              Advanced Aesthetic Consultation                    ║
╚════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PATIENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${patientData.name}
Age: ${patientData.age} years old
Gender: ${patientData.gender}
Skin Type: ${patientData.skinType}
Ethnicity: ${patientData.ethnicity}
Diagnosis: ${patientData.diagnosis}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SURGICAL MODIFICATION PARAMETERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nasal Bridge: ${parameters.noseBridge > 0 ? '+' : ''}${parameters.noseBridge}
Nasal Width: ${parameters.noseWidth > 0 ? '+' : ''}${parameters.noseWidth}
Lip Volume: ${parameters.lipsVolume > 0 ? '+' : ''}${parameters.lipsVolume}
Jawline Definition: ${parameters.jawline > 0 ? '+' : ''}${parameters.jawline}
Cheekbone Projection: ${parameters.cheekbones > 0 ? '+' : ''}${parameters.cheekbones}
Skin Tightness: ${parameters.skinTightness > 0 ? '+' : ''}${parameters.skinTightness}
Asymmetry Correction: ${parameters.asymmetryCorrection > 0 ? '+' : ''}${parameters.asymmetryCorrection}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SURGICAL TECHNIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Selected Approach: ${technique === 'traditional' ? 'Traditional Open Rhinoplasty' : technique === 'closed' ? 'Closed Endonasal' : 'Ultrasonic Assisted'}
Recovery Time: ${technique === 'traditional' ? '2-3 weeks' : '7-10 days'}
Scarring: ${technique === 'traditional' ? 'Minimal external' : 'None external'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI CLINICAL RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${aiRecommendations || 'Generate recommendations to view clinical insights'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHYSIOGNOMIC ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Skin Quality Assessment:
• Thickness: ${patientData.skinType.includes('III') ? 'Medium' : 'Thin'}
• Elasticity: ${parameters.skinTightness > 0 ? 'Good' : 'Fair'}
• Scarring Potential: ${Math.abs(parameters.noseWidth) > 30 ? 'Moderate' : 'Low'}

Symmetry Analysis:
• Baseline asymmetry: Analyzed
• Correction target: ${parameters.asymmetryCorrection}%
• Post-operative symmetry goal: >95%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOVERY TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 1: Initial healing, edema management
Week 2-3: Suture removal, edema reduction
Week 4-6: Return to light activities
Week 8-12: Near-final results visible
Month 6-12: Final aesthetic result stabilization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATED: ${new Date().toLocaleString()}
SYSTEM: SurgiPredict Pro v1.0 - AI-Assisted Surgical Planning
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', `SurgiReport_${patientData.name.replace(' ', '_')}_${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const luxuryColors = {
    gold: '#d4af37',
    darkBg: '#0f0f1e',
    lightBg: '#1a1a2e',
    accentBlue: '#00d4ff',
    accentPink: '#ff6b9d',
  };

  return (
    <div style={{ background: '#0f0f1e', color: '#e0e0e0', minHeight: '100vh', fontFamily: "'Playfair Display', serif" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${luxuryColors.lightBg} 0%, ${luxuryColors.darkBg} 100%)`,
        borderBottom: `2px solid ${luxuryColors.gold}`,
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem', color: luxuryColors.gold, fontWeight: 'normal', letterSpacing: '2px' }}>
          SURGIPREDICT PRO
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: luxuryColors.accentBlue, letterSpacing: '1px', textTransform: 'uppercase' }}>
          Advanced AI-Powered Surgical Prediction System
        </p>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '1rem 2rem',
        borderBottom: `1px solid ${luxuryColors.gold}20`,
        overflowX: 'auto',
        background: luxuryColors.lightBg,
      }}>
        {['patient', 'prediction', 'ai', 'report'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab ? luxuryColors.gold : 'transparent',
              color: activeTab === tab ? '#000' : luxuryColors.gold,
              border: `1px solid ${luxuryColors.gold}`,
              cursor: 'pointer',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* PATIENT TAB */}
        {activeTab === 'patient' && (
          <div style={{
            background: luxuryColors.lightBg,
            padding: '2rem',
            borderRadius: '8px',
            border: `1px solid ${luxuryColors.gold}40`,
          }}>
            <h2 style={{ color: luxuryColors.gold, fontSize: '1.8rem', marginBottom: '1.5rem' }}>Patient Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(patientData).map(([key, value]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: luxuryColors.accentBlue, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type={key === 'age' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => setPatientData({ ...patientData, [key]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: '#0f0f1e',
                      color: luxuryColors.gold,
                      border: `1px solid ${luxuryColors.gold}60`,
                      borderRadius: '4px',
                      fontSize: '1rem',
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: `1px solid ${luxuryColors.gold}30` }}>
              <h3 style={{ color: luxuryColors.accentBlue, marginBottom: '1rem' }}>Upload Images</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{
                  padding: '1.5rem',
                  border: `2px dashed ${luxuryColors.gold}60`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}>
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <Upload size={24} style={{ margin: '0 auto 0.5rem', color: luxuryColors.accentBlue }} />
                    <span style={{ fontSize: '0.9rem', color: luxuryColors.accentBlue }}>Before Photo</span>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'before')} accept="image/*" style={{ display: 'none' }} />
                  </label>
                </div>
                <div style={{
                  padding: '1.5rem',
                  border: `2px dashed ${luxuryColors.gold}60`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}>
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <Upload size={24} style={{ margin: '0 auto 0.5rem', color: luxuryColors.accentPink }} />
                    <span style={{ fontSize: '0.9rem', color: luxuryColors.accentPink }}>After Photo (Prediction)</span>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'after')} accept="image/*" style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {(beforeImage || afterImage) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  {beforeImage && <img src={beforeImage} alt="Before" style={{ maxWidth: '100%', borderRadius: '8px', border: `1px solid ${luxuryColors.gold}40` }} />}
                  {afterImage && <img src={afterImage} alt="After" style={{ maxWidth: '100%', borderRadius: '8px', border: `1px solid ${luxuryColors.gold}40` }} />}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PREDICTION TAB */}
        {activeTab === 'prediction' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Parameters */}
            <div style={{
              background: luxuryColors.lightBg,
              padding: '2rem',
              borderRadius: '8px',
              border: `1px solid ${luxuryColors.gold}40`,
              height: 'fit-content',
            }}>
              <h2 style={{ color: luxuryColors.gold, fontSize: '1.6rem', marginBottom: '1.5rem' }}>Surgical Parameters</h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', color: luxuryColors.accentBlue, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'block' }}>
                  Surgical Technique
                </label>
                <select
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#0f0f1e',
                    color: luxuryColors.gold,
                    border: `1px solid ${luxuryColors.gold}60`,
                    borderRadius: '4px',
                  }}
                >
                  <option value="traditional">Traditional Open Rhinoplasty</option>
                  <option value="closed">Closed Endonasal</option>
                  <option value="ultrasonic">Ultrasonic Assisted</option>
                </select>
              </div>

              {Object.entries(parameters).map(([param, value]) => (
                <div key={param} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: luxuryColors.accentBlue, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {param.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <span style={{ fontSize: '1rem', color: luxuryColors.gold, fontWeight: 'bold' }}>{value > 0 ? '+' : ''}{value}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={value}
                    onChange={(e) => setParameters({ ...parameters, [param]: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      accentColor: luxuryColors.gold,
                    }}
                  />
                </div>
              ))}

              <button
                onClick={fetchAIRecommendations}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: loading ? 'rgba(212, 175, 55, 0.3)' : luxuryColors.gold,
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginTop: '1rem',
                  transition: 'all 0.3s',
                }}
              >
                {loading ? 'Generating AI Analysis...' : '⚡ Get AI Recommendations'}
              </button>
            </div>

            {/* 3D Visualization */}
            <div style={{
              background: luxuryColors.lightBg,
              padding: '2rem',
              borderRadius: '8px',
              border: `1px solid ${luxuryColors.gold}40`,
            }}>
              <h2 style={{ color: luxuryColors.gold, fontSize: '1.6rem', marginBottom: '1.5rem' }}>3D Prediction Model</h2>
              <canvas
                ref={canvasRef}
                width={400}
                height={500}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: `1px solid ${luxuryColors.gold}40`,
                }}
              />
              <p style={{ fontSize: '0.8rem', color: luxuryColors.accentBlue, marginTop: '1rem', textAlign: 'center' }}>
                Real-time 3D visualization with parameter adjustments
              </p>
            </div>
          </div>
        )}

        {/* AI RECOMMENDATIONS TAB */}
        {activeTab === 'ai' && (
          <div style={{
            background: luxuryColors.lightBg,
            padding: '2rem',
            borderRadius: '8px',
            border: `1px solid ${luxuryColors.gold}40`,
          }}>
            <h2 style={{ color: luxuryColors.gold, fontSize: '1.8rem', marginBottom: '1.5rem' }}>AI Clinical Analysis</h2>
            {aiRecommendations ? (
              <div style={{
                background: '#0f0f1e',
                padding: '1.5rem',
                borderRadius: '8px',
                border: `1px solid ${luxuryColors.gold}30`,
                lineHeight: '1.8',
                fontSize: '0.95rem',
                maxHeight: '600px',
                overflowY: 'auto',
              }}>
                {aiRecommendations}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: luxuryColors.accentBlue,
              }}>
                <Zap size={48} style={{ margin: '0 auto 1rem', color: luxuryColors.gold }} />
                <p>Generate AI recommendations from the Prediction tab to view clinical analysis</p>
              </div>
            )}
          </div>
        )}

        {/* REPORT TAB */}
        {activeTab === 'report' && (
          <div style={{
            background: luxuryColors.lightBg,
            padding: '2rem',
            borderRadius: '8px',
            border: `1px solid ${luxuryColors.gold}40`,
          }}>
            <h2 style={{ color: luxuryColors.gold, fontSize: '1.8rem', marginBottom: '1.5rem' }}>Generate Report</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{
                padding: '1.5rem',
                background: '#0f0f1e',
                borderRadius: '8px',
                border: `1px solid ${luxuryColors.gold}40`,
              }}>
                <h3 style={{ color: luxuryColors.accentBlue, marginBottom: '1rem' }}>Patient Data</h3>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                  <p><strong style={{ color: luxuryColors.gold }}>Name:</strong> {patientData.name}</p>
                  <p><strong style={{ color: luxuryColors.gold }}>Age:</strong> {patientData.age}</p>
                  <p><strong style={{ color: luxuryColors.gold }}>Skin Type:</strong> {patientData.skinType}</p>
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                background: '#0f0f1e',
                borderRadius: '8px',
                border: `1px solid ${luxuryColors.gold}40`,
              }}>
                <h3 style={{ color: luxuryColors.accentPink, marginBottom: '1rem' }}>Modifications</h3>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                  <p><strong style={{ color: luxuryColors.gold }}>Nose:</strong> {parameters.noseBridge + parameters.noseWidth}%</p>
                  <p><strong style={{ color: luxuryColors.gold }}>Lips:</strong> {parameters.lipsVolume}%</p>
                  <p><strong style={{ color: luxuryColors.gold }}>Jawline:</strong> {parameters.jawline}%</p>
                </div>
              </div>
            </div>

            <button
              onClick={generateReport}
              style={{
                width: '100%',
                padding: '1rem',
                background: luxuryColors.gold,
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s',
              }}
            >
              <Download size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Download Luxury Report
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        borderTop: `2px solid ${luxuryColors.gold}`,
        textAlign: 'center',
        color: luxuryColors.accentBlue,
        fontSize: '0.85rem',
      }}>
        <p>SurgiPredict Pro™ | AI-Assisted Surgical Planning System | Medical-Grade Prediction Engine</p>
        <p style={{ marginTop: '0.5rem', color: luxuryColors.gold }}>Powered by Advanced AI &amp; 3D Visualization Technology</p>
      </div>
    </div>
  );
}
