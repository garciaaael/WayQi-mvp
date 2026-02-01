import React, { useState } from 'react';
import { Calendar, Upload, MessageCircle, TrendingUp, Target, Plane, Car, ArrowRight, ArrowLeft, Check, Sparkles, ChevronDown, ChevronUp, LogOut, User, Loader2, DollarSign, X } from 'lucide-react';

export default function WayQiOnboarding() {
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('travel');
  const [goalAmountUSD, setGoalAmountUSD] = useState(5517); // Objetivo en USD (~8M ARS)
  const [goalMonths, setGoalMonths] = useState(12);
  const [whatsappLinked, setWhatsappLinked] = useState(false);
  const [userName] = useState('Elias Garcia');
  const [userEmail, setUserEmail] = useState('');
  const [userGoogleData, setUserGoogleData] = useState(null); // Datos obtenidos de Google OAuth
  const [compoundExpanded, setCompoundExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSavingsUSD, setCurrentSavingsUSD] = useState(0);
  const [showAddSavingsModal, setShowAddSavingsModal] = useState(false);
  const [savingsAmountUSD, setSavingsAmountUSD] = useState('');
  const [showActionAppliedModal, setShowActionAppliedModal] = useState(false);
  const [actionApplied, setActionApplied] = useState(false);
  const [actionAppliedDate, setActionAppliedDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmountUSD, setWithdrawAmountUSD] = useState('');
  const [investorProfile, setInvestorProfile] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [selectedFund, setSelectedFund] = useState(null); // Fondo seleccionado por el usuario
  const [showChangeFundModal, setShowChangeFundModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [calcInitialAmount, setCalcInitialAmount] = useState('1000');
  const [calcMonthlyContribution, setCalcMonthlyContribution] = useState('100');
  const [calcMonths, setCalcMonths] = useState('12');
  const [calcRate, setCalcRate] = useState(0.08); // Inicializar con valor por defecto
  
  // Estados KYC
  const [kycCompleted, setKycCompleted] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showPreKycModal, setShowPreKycModal] = useState(false);
  const [kycData, setKycData] = useState({
    fullName: userName, // Pre-llenar con nombre de Google
    dni: '',
    birthDate: '',
    address: '',
    city: '',
    postalCode: '',
    occupation: '',
    monthlyIncome: '',
    isPEP: false,
    acceptTerms: false
  });

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const exchangeRate = 1450;
  
  const investorProfiles = {
    'conservative': { 
      name: 'Conservador', 
      rate: 0.06, 
      risk: 'Bajo', 
      description: 'Para quienes prefieren estabilidad y protección del capital',
      fund: 'Conservador',
      composition: '80% Bonos, 20% Acciones'
    },
    'moderate': { 
      name: 'Moderado', 
      rate: 0.08, 
      risk: 'Medio', 
      description: 'Balance perfecto entre riesgo y retorno',
      fund: 'Moderado',
      composition: '50% Bonos, 50% Acciones'
    },
    'risky': { 
      name: 'Arriesgado', 
      rate: 0.10, 
      risk: 'Alto', 
      description: 'Para quienes buscan mayor rentabilidad con más volatilidad',
      fund: 'Arriesgado',
      composition: '20% Bonos, 80% Acciones'
    }
  };
  
  const annualRateUSD = selectedFund ? investorProfiles[selectedFund].rate : 0.08; // 8% anual por defecto
  const monthlyRateUSD = Math.pow(1 + annualRateUSD, 1/12) - 1; // Conversión correcta a tasa mensual

  const expense = { category: 'Delivery', monthly: 45000, frequency: '12 veces/mes' };
  const saving = 3;
  const suggestedCut = Math.round(expense.monthly * 0.65);
  const suggestedCutUSD = Math.round(suggestedCut / exchangeRate);

  const goalAmountARS = Math.round(goalAmountUSD * exchangeRate);
  const monthlyNoInterestUSD = Math.round(goalAmountUSD / goalMonths);
  const monthlyNoInterestARS = Math.round(monthlyNoInterestUSD * exchangeRate);

  const calculateMonthsWithCompound = (paymentUSD) => {
    const numerator = Math.log(1 + (goalAmountUSD * monthlyRateUSD / paymentUSD));
    const denominator = Math.log(1 + monthlyRateUSD);
    return numerator / denominator;
  };

  const monthsCompound = calculateMonthsWithCompound(monthlyNoInterestUSD);
  
  const monthlyWithCutUSD = monthlyNoInterestUSD + suggestedCutUSD;
  const monthlyWithCutARS = Math.round(monthlyWithCutUSD * exchangeRate);
  const monthsWithCut = calculateMonthsWithCompound(monthlyWithCutUSD);

  const getEtaDate = (months) => {
    const date = new Date();
    const totalDays = Math.round(months * 30.44); // Promedio de días por mes
    date.setDate(date.getDate() + totalDays);
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getEtaMonthsDisplay = (months) => {
    const years = Math.floor(months / 12);
    const remainingMonths = Math.floor(months % 12);
    const days = Math.round((months % 1) * 30.44);
    
    let display = '';
    if (years > 0) display += `${years} ${years === 1 ? 'año' : 'años'}`;
    if (remainingMonths > 0) display += `${display ? ', ' : ''}${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`;
    if (days > 0 && years === 0) display += `${display ? ', ' : ''}${days} ${days === 1 ? 'día' : 'días'}`;
    
    return display || '0 días';
  };

  const etaNoInterest = getEtaDate(goalMonths);
  const etaCompound = getEtaDate(monthsCompound);
  const etaWithCut = getEtaDate(monthsWithCut);

  const currentSavingsARS = Math.round(currentSavingsUSD * exchangeRate);
  const progressPercentage = Math.min(Math.round((currentSavingsUSD / goalAmountUSD) * 100), 100);

  const recommendedAction = {
    type: 'reasignacion',
    title: 'Reasigná tu ahorro de Delivery',
    description: `Detectamos que gastás $${formatNumber(expense.monthly)}/mes en ${expense.category}. Si redirigís la mitad a tu meta:`,
    amountUSD: suggestedCutUSD,
    amountARS: suggestedCut,
    impact: Math.round((goalMonths - monthsWithCut) * 30.44), // días
    impactDisplay: getEtaMonthsDisplay(goalMonths - monthsWithCut),
    newETA: etaWithCut
  };

  const goBack = () => {
    const order = ['login', 'selectGoal', 'defineGoal', 'investorProfile', 'profileResult', 'buildProfile', 'ahaInsight', 'dashboard'];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\./g, '').replace(/,/g, '');
    const numValue = parseInt(value) || 0;
    setGoalAmountUSD(numValue);
  };

  const handleSavingsAmountChange = (e) => {
    const value = e.target.value.replace(/\./g, '').replace(/,/g, '');
    setSavingsAmountUSD(value);
  };

  const savingsAmountARS = savingsAmountUSD ? Math.round(parseInt(savingsAmountUSD) * exchangeRate) : 0;

  const handleAddSavings = () => {
    if (!kycCompleted) {
      setShowAddSavingsModal(false);
      setShowPreKycModal(true);
      return;
    }
    
    if (savingsAmountUSD) {
      const amountUSD = parseInt(savingsAmountUSD);
      const amountARS = Math.round(amountUSD * exchangeRate);
      setCurrentSavingsUSD(currentSavingsUSD + amountUSD);
      
      // Registrar transacción
      const newTransaction = {
        id: Date.now(),
        type: 'aporte',
        amountUSD: amountUSD,
        amountARS: amountARS,
        date: new Date(),
        description: 'Aporte manual'
      };
      setTransactions([newTransaction, ...transactions]);
      
      setSavingsAmountUSD('');
      setShowAddSavingsModal(false);
    }
  };

  const handleApplyAction = () => {
    if (!kycCompleted) {
      setShowPreKycModal(true);
      return;
    }
    
    // Aplicar la acción: sumar el recorte mensual y marcar como aplicada
    setCurrentSavingsUSD(currentSavingsUSD + suggestedCutUSD);
    setActionApplied(true);
    setActionAppliedDate(new Date());
    
    // Registrar transacción
    const newTransaction = {
      id: Date.now(),
      type: 'aporte',
      amountUSD: suggestedCutUSD,
      amountARS: suggestedCut,
      date: new Date(),
      description: `Recorte de ${expense.category}`
    };
    setTransactions([newTransaction, ...transactions]);
    
    setShowActionAppliedModal(true);
  };

  const handleWithdrawAmountChange = (e) => {
    const value = e.target.value.replace(/\./g, '').replace(/,/g, '');
    setWithdrawAmountUSD(value);
  };

  const withdrawAmountARS = withdrawAmountUSD ? Math.round(parseInt(withdrawAmountUSD) * exchangeRate) : 0;

  const handleWithdraw = () => {
    if (withdrawAmountUSD) {
      const amountUSD = parseInt(withdrawAmountUSD);
      const amountARS = Math.round(amountUSD * exchangeRate);
      if (amountUSD <= currentSavingsUSD) {
        setCurrentSavingsUSD(currentSavingsUSD - amountUSD);
        
        // Registrar transacción
        const newTransaction = {
          id: Date.now(),
          type: 'egreso',
          amountUSD: amountUSD,
          amountARS: amountARS,
          date: new Date(),
          description: 'Retiro'
        };
        setTransactions([newTransaction, ...transactions]);
        
        setWithdrawAmountUSD('');
        setShowWithdrawModal(false);
      }
    }
  };

  const calculateCompoundInterest = () => {
    const initial = parseFloat(calcInitialAmount) || 0;
    const monthly = parseFloat(calcMonthlyContribution) || 0;
    const months = parseInt(calcMonths) || 1;
    const rate = calcRate;
    const monthlyRate = Math.pow(1 + rate, 1/12) - 1;

    let balance = initial;
    let totalContributed = initial;

    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthly;
      if (i < months - 1) totalContributed += monthly;
    }
    
    // Agregar la última contribución
    totalContributed += monthly;

    const totalInterest = balance - totalContributed;

    return {
      finalBalance: balance,
      totalContributed: totalContributed,
      totalInterest: totalInterest
    };
  };

  const calcResults = calculateCompoundInterest();

  const simulateLoading = (nextStep, duration = 2000) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(nextStep);
    }, duration);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 max-w-md w-full">
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Procesando...</h2>
            <p className="text-gray-500">Estamos preparando todo para vos</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-600 text-white text-3xl font-bold px-8 py-4 rounded-2xl mb-6">WayQi</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">Todo sueño tiene un componente financiero</h1>
            <p className="text-gray-500 text-base">Convertí tus decisiones diarias en progreso real hacia tus objetivos</p>
          </div>
          <div className="space-y-3">
            <button onClick={() => {
              // Simular datos obtenidos de Google OAuth
              const googleData = {
                name: 'Elias Garcia',
                email: 'elias.garcia@gmail.com',
                picture: null
              };
              setUserGoogleData(googleData);
              setUserEmail(googleData.email);
              simulateLoading('selectGoal');
            }} className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors text-gray-800 font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
            <button onClick={() => simulateLoading('selectGoal')} className="w-full bg-black text-white rounded-2xl py-4 px-4 flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continuar con Apple
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-400">o</span></div>
            </div>
            <button onClick={() => simulateLoading('selectGoal')} className="w-full bg-blue-600 text-white rounded-2xl py-4 px-4 hover:bg-blue-700 transition-colors font-semibold">Continuar con Email</button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-8">Al continuar, aceptás nuestros Términos y Condiciones</p>
        </div>
      </div>
    );
  }

  if (step === 'selectGoal') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <button onClick={goBack} className="mb-8 p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="bg-white rounded-3xl border border-gray-100 p-10 mb-6">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Hola, {userName} 👋</h1>
            <h2 className="text-xl font-medium text-gray-700 mb-2">¿Qué querés lograr?</h2>
            <p className="text-gray-500">Elegí tu objetivo para ver cuándo podrías alcanzarlo</p>
          </div>
          <div className="space-y-4">
            <button onClick={() => { setSelectedGoal('travel'); setStep('defineGoal'); }} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-3xl p-8 hover:shadow-lg transition-all transform hover:scale-[1.01]">
              <div className="flex items-center gap-5">
                <Plane className="w-14 h-14" />
                <div className="text-left">
                  <h3 className="text-2xl font-semibold">Viaje</h3>
                  <p className="text-blue-100">Tu próxima aventura</p>
                </div>
              </div>
            </button>
            <button onClick={() => { setSelectedGoal('car'); setStep('defineGoal'); }} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl p-8 hover:shadow-lg transition-all transform hover:scale-[1.01]">
              <div className="flex items-center gap-5">
                <Car className="w-14 h-14" />
                <div className="text-left">
                  <h3 className="text-2xl font-semibold">Auto</h3>
                  <p className="text-purple-100">Tu próximo vehículo</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'defineGoal') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <button onClick={goBack} className="mb-8 p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="bg-white rounded-3xl border border-gray-100 p-10">
            <div className="text-center mb-10">
              <div className="inline-block bg-gradient-to-br from-blue-500 to-cyan-500 p-5 rounded-3xl mb-6">
                {selectedGoal === 'travel' ? <Plane className="w-14 h-14 text-white" /> : <Car className="w-14 h-14 text-white" />}
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                {selectedGoal === 'travel' ? '¿A dónde querés viajar?' : '¿Qué auto querés?'}
              </h1>
              <p className="text-gray-500">Definí tu meta y descubrí cuándo podrías alcanzarla</p>
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">¿Cuánto necesitás?</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-400 text-lg">USD</span>
                  <input type="text" value={formatNumber(goalAmountUSD)} onChange={handleAmountChange} className="w-full pl-16 pr-5 py-4 border border-gray-200 rounded-2xl text-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedGoal === 'travel' ? 'Costo promedio: USD 5,500' : 'Costo promedio: USD 17,200'} 
                  <span className="text-gray-400 ml-2">(≈ ${formatNumber(goalAmountARS)})</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">¿En cuánto tiempo querés lograrlo?</label>
                <div className="flex items-center gap-3">
                  <input type="number" value={goalMonths} onChange={(e) => setGoalMonths(parseInt(e.target.value) || 1)} className="flex-1 px-5 py-4 border border-gray-200 rounded-2xl text-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" />
                  <span className="text-gray-600 font-medium">meses</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 space-y-4 border border-blue-100">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Sin invertir (ahorro tradicional):</p>
                  <p className="text-3xl font-bold text-gray-900">USD {formatNumber(monthlyNoInterestUSD)}</p>
                  <p className="text-sm text-gray-400 mt-1">≈ ${formatNumber(monthlyNoInterestARS)}/mes</p>
                </div>
                <div className="border-t border-blue-200 pt-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Invirtiendo con WayQi{selectedFund ? ` (${investorProfiles[selectedFund].fund})` : ''} (tasa {(annualRateUSD * 100).toFixed(0)}% anual en USD):</p>
                      <p className="text-blue-700 mb-2">Mismo aporte: <span className="font-bold text-2xl">USD {formatNumber(monthlyNoInterestUSD)}</span></p>
                      <p className="text-blue-600 font-bold text-lg">Llegás {Math.round((goalMonths - monthsCompound) * 30.44)} días antes</p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 bg-white rounded-xl p-3 border border-blue-100">💡 Invertimos en USD con rendimiento mensual. Tu dinero trabaja para vos.</div>
              </div>
            </div>
            <button onClick={() => setStep('investorProfile')} className="w-full mt-8 bg-blue-600 text-white rounded-2xl py-4 font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'investorProfile') {
    const questions = [
      {
        id: 'q1',
        question: '¿Cómo reaccionarías si tu inversión baja un 20% en un mes?',
        options: [
          { value: 'conservative', text: 'Vendería todo inmediatamente', points: 1 },
          { value: 'moderate', text: 'Me preocuparía pero esperaría', points: 2 },
          { value: 'risky', text: 'Compraría más, es una oportunidad', points: 3 }
        ]
      },
      {
        id: 'q2',
        question: '¿Cuál es tu objetivo principal al invertir?',
        options: [
          { value: 'conservative', text: 'Proteger mi capital sin perder', points: 1 },
          { value: 'moderate', text: 'Balance entre seguridad y ganancia', points: 2 },
          { value: 'risky', text: 'Maximizar ganancias aunque arriesgue', points: 3 }
        ]
      },
      {
        id: 'q3',
        question: '¿Cuánta experiencia tenés invirtiendo?',
        options: [
          { value: 'conservative', text: 'Ninguna, es mi primera vez', points: 1 },
          { value: 'moderate', text: 'Algo, hice algunas inversiones', points: 2 },
          { value: 'risky', text: 'Bastante, invierto regularmente', points: 3 }
        ]
      }
    ];

    const calculateProfile = () => {
      const totalPoints = Object.values(quizAnswers).reduce((sum, val) => sum + val, 0);
      const avgPoints = totalPoints / Object.keys(quizAnswers).length;
      
      if (avgPoints <= 1.5) return 'conservative';
      if (avgPoints <= 2.5) return 'moderate';
      return 'risky';
    };

    const allAnswered = Object.keys(quizAnswers).length === questions.length;

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <button onClick={goBack} className="mb-8 p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="bg-white rounded-3xl border border-gray-100 p-10">
            <div className="text-center mb-10">
              <div className="inline-block bg-gradient-to-br from-purple-500 to-pink-500 p-5 rounded-3xl mb-6">
                <TrendingUp className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">¿Qué tipo de inversor sos?</h1>
              <p className="text-gray-500">Respondé estas preguntas para personalizar tu experiencia</p>
            </div>

            <div className="space-y-8">
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-4">
                  <p className="font-medium text-gray-900">{idx + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setQuizAnswers({...quizAnswers, [q.id]: option.points})}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                          quizAnswers[q.id] === option.points
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            quizAnswers[q.id] === option.points
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300'
                          }`}>
                            {quizAnswers[q.id] === option.points && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-gray-700">{option.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const profile = calculateProfile();
                setInvestorProfile(profile);
                setStep('profileResult');
              }}
              disabled={!allAnswered}
              className="w-full mt-10 bg-blue-600 text-white rounded-2xl py-4 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Ver mi perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'profileResult') {
    const recommendedProfile = investorProfiles[investorProfile];
    
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <button onClick={goBack} className="mb-8 p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="bg-white rounded-3xl border border-gray-100 p-10">
            <div className="text-center mb-10">
              <div className="inline-block bg-gradient-to-br from-blue-500 to-purple-500 p-5 rounded-3xl mb-6">
                <TrendingUp className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-3">Elegí tu fondo</h1>
              <p className="text-gray-500">Según tu perfil, te recomendamos <span className="font-semibold text-blue-600">{recommendedProfile.name}</span></p>
              <p className="text-gray-400 text-sm mt-2">Pero podés elegir cualquiera de nuestros fondos</p>
            </div>

            <div className="space-y-4 mb-8">
              {Object.entries(investorProfiles).map(([key, profile]) => {
                const isRecommended = key === investorProfile;
                const isSelected = selectedFund === key;
                
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedFund(key)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg">{profile.name}</h3>
                            {isRecommended && (
                              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                Recomendado
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{profile.description}</p>
                          <p className="text-xs text-gray-500">{profile.composition}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <div className="flex-1 bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-600 mb-1">Riesgo</p>
                        <p className="font-bold text-gray-900">{profile.risk}</p>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-600 mb-1">Retorno anual</p>
                        <p className="font-bold text-blue-600">{(profile.rate * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedFund && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Con {investorProfiles[selectedFund].name}:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">Retorno anual del <span className="font-bold">{(investorProfiles[selectedFund].rate * 100).toFixed(0)}%</span> en USD</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">Llegarías aproximadamente <span className="font-bold">{Math.round((goalMonths - monthsCompound) * 30.44)} días antes</span> vs ahorro tradicional</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">Podés cambiar tu fondo en cualquier momento</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep('buildProfile')}
              disabled={!selectedFund}
              className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar con {selectedFund ? investorProfiles[selectedFund].name : 'este fondo'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'buildProfile') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <button onClick={goBack} className="mb-8 p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="bg-white rounded-3xl border border-gray-100 p-10">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">¿Cómo querés registrar tus gastos?</h1>
            <p className="text-gray-500 mb-10">Elegí la forma más cómoda para que WayQi entienda tus hábitos y te ayude a alcanzar tu meta</p>
            
            <div className="space-y-3 mb-8">
              <button 
                onClick={() => simulateLoading('ahaInsight', 2500)} 
                className="w-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-600 hover:shadow-sm transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                    <Upload className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Importar extracto bancario</h3>
                    <p className="text-gray-500 text-sm">Subí tu PDF o Excel y descubrí tus gastos automáticamente</p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <button 
                onClick={() => { 
                  setWhatsappLinked(true); 
                  simulateLoading('ahaInsight', 1500); 
                }} 
                className="w-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-green-600 hover:shadow-sm transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                    <MessageCircle className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Vincular WhatsApp</h3>
                    <p className="text-gray-500 text-sm">Registrá gastos con mensajes, audios o fotos de tickets</p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </button>

              <button 
                onClick={() => setStep('ahaInsight')} 
                className="w-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-400 hover:shadow-sm transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gray-300 transition-colors">
                    <svg className="w-7 h-7 text-gray-600 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Registrar manualmente</h3>
                    <p className="text-gray-500 text-sm">Empezá a cargar tus gastos uno por uno</p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p className="text-sm text-blue-900">
                  No te preocupes, con información parcial ya podemos ayudarte. Cuanto más datos tengas, mejores serán nuestras recomendaciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'ahaInsight') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <button onClick={goBack} className="mb-8 p-2 hover:bg-white rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="bg-white rounded-3xl border border-gray-100 p-10">
            <div className="text-center mb-10">
              <div className="inline-block bg-gradient-to-br from-amber-400 to-orange-400 p-5 rounded-3xl mb-6">
                <Sparkles className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">{userName.split(' ')[0]}, descubrimos algo importante</h1>
            </div>
            
            <div className="space-y-6 mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-3">Tu gasto más frecuente:</p>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-7 border border-orange-100">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{expense.category}</h3>
                  <p className="text-xl text-gray-700">${formatNumber(expense.monthly)}/mes • {expense.frequency}</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-7 h-7 text-amber-600" />
                  <p className="font-semibold text-amber-900 text-lg">Este hábito te retrasa:</p>
                </div>
                <p className="text-4xl font-bold text-amber-900 mb-4">{getEtaMonthsDisplay(goalMonths - monthsWithCut)}</p>
                <p className="text-amber-800">Si reducís este gasto en <span className="font-bold">USD {suggestedCutUSD}/mes</span> <span className="text-sm">(≈ ${formatNumber(suggestedCut)})</span>, podrías llegar antes</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mb-8">
              <div className="text-center mb-6">
                <div className="inline-block bg-gradient-to-br from-blue-500 to-green-500 p-4 rounded-2xl mb-4">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tu primer micro-cambio</h2>
                <p className="text-gray-500">Una acción simple que podés empezar hoy</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-7 border border-blue-200 mb-6">
                <p className="text-gray-800 text-lg leading-relaxed">
                  Si evitás {expense.category.toLowerCase()} <span className="font-bold">2 veces por semana</span>, ahorrarías <span className="font-bold text-blue-600 text-xl">USD {suggestedCutUSD}/mes</span> <span className="text-sm text-gray-500">(≈ ${formatNumber(suggestedCut)})</span> y podrías adelantar tu meta <span className="font-bold text-blue-600 text-xl">{getEtaMonthsDisplay(goalMonths - monthsWithCut)}</span>
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-600 font-medium">Sin cambios:</span>
                  <span className="font-bold text-gray-900 text-lg">{etaNoInterest}</span>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border-2 border-blue-600">
                  <span className="text-blue-700 font-semibold">Con este cambio:</span>
                  <span className="font-bold text-blue-700 text-lg">{etaCompound}</span>
                </div>
              </div>
            </div>

            <button onClick={() => setStep('dashboard')} className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              Empezar este cambio
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => setStep('dashboard')} className="w-full text-gray-500 py-3 hover:text-gray-700 transition-colors font-medium mt-2">Ver otras opciones</button>
            <p className="text-sm text-gray-500 text-center mt-4">No es un compromiso, es un experimento. Podés ajustarlo cuando quieras.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">WayQi</div>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName.split(' ').map(n => n[0]).join('')}
              </div>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{userName}</p>
                  <p className="text-sm text-gray-500">{userEmail || 'usuario@wayqi.com'}</p>
                </div>
                <button className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Mi perfil</span>
                </button>
                <button 
                  onClick={() => {
                    // Sincronizar tasa con fondo seleccionado
                    if (selectedFund) {
                      setCalcRate(investorProfiles[selectedFund].rate);
                    }
                    setShowCalculatorModal(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                  <span className="text-gray-700">Calculadora</span>
                </button>
                <button className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <Target className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Metas activas</span>
                </button>
                <div className="border-t border-gray-100 my-2"></div>
                <button onClick={() => setStep('login')} className="w-full px-5 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="text-red-600">Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {selectedFund && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 mb-6 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tu fondo actual</p>
                <p className="font-semibold text-gray-900">{investorProfiles[selectedFund].name}</p>
                <p className="text-xs text-gray-500">{(investorProfiles[selectedFund].rate * 100).toFixed(0)}% anual en USD</p>
              </div>
            </div>
            <button onClick={() => setShowChangeFundModal(true)} className="text-blue-600 text-sm font-medium hover:text-blue-700">Cambiar</button>
          </div>
        )}

        {kycCompleted && (
          <div className="bg-green-50 rounded-2xl p-4 mb-6 border border-green-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Identidad verificada</p>
              <p className="text-sm text-green-700">Ya podés realizar inversiones</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-3xl border border-gray-100 p-10 mb-6 text-center">
          <p className="text-gray-500 text-sm mb-2 flex items-center justify-center gap-2">
            Tu ahorro en {selectedGoal === 'travel' ? 'Viaje' : 'Auto'}
            <button className="hover:text-gray-700"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></button>
          </p>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">USD {formatNumber(currentSavingsUSD)}</h1>
          <p className="text-gray-400 text-lg">≈ ${formatNumber(currentSavingsARS)}</p>
          
          <div className="flex justify-center gap-6 mb-8">
            <button onClick={() => setShowAddSavingsModal(true)} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-blue-600/30">
                <ArrowRight className="w-7 h-7 text-white transform -rotate-90" />
              </div>
              <span className="text-sm font-medium text-gray-700">Invertir</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-blue-600/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Crear</span>
            </button>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Inversiones</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Ver resumen</button>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedGoal === 'travel' ? (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{selectedGoal === 'travel' ? 'Viaje' : 'Auto'}</p>
                  <p className="text-sm text-gray-500">Corto plazo</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">USD {formatNumber(goalAmountUSD)}</p>
                <p className="text-sm text-gray-500">{progressPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[60%_40%] gap-6 mb-6">
          {/* Meta detallada - 60% */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              {selectedGoal === 'travel' ? (
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Plane className="w-7 h-7 text-white" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Car className="w-7 h-7 text-white" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{selectedGoal === 'travel' ? 'Viaje' : 'Auto'}</h2>
                <p className="text-gray-500 text-sm">Objetivo: USD {formatNumber(goalAmountUSD)} <span className="text-gray-400">(≈ ${formatNumber(goalAmountARS)})</span></p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Fecha estimada</span>
                <p className="text-lg font-semibold text-blue-600">{etaNoInterest}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-3xl font-bold text-gray-900">{progressPercentage}%</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">USD {formatNumber(currentSavingsUSD)}</span>
                  <p className="text-xs text-gray-400">≈ ${formatNumber(currentSavingsARS)}</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAddSavingsModal(true)} className="flex-1 bg-blue-600 text-white rounded-2xl py-3 font-semibold hover:bg-blue-700 transition-colors text-sm">
                Agregar ahorro
              </button>
              <button onClick={() => setShowWithdrawModal(true)} className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium">
                Retirar
              </button>
            </div>
          </div>

          {/* Acción recomendada - 40% */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Acción recomendada</h3>
                  {actionApplied && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">ACTIVA</span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{recommendedAction.description}</p>
            
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Aporte sugerido:</span>
                <div className="text-right">
                  <span className="font-bold text-gray-900">USD {recommendedAction.amountUSD}</span>
                  <p className="text-xs text-gray-400">≈ ${formatNumber(recommendedAction.amountARS)}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Llegarías en:</span>
                <span className="font-semibold text-blue-600 text-sm">{recommendedAction.newETA}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-blue-600 font-semibold text-center text-sm">Adelantás {recommendedAction.impactDisplay}</p>
              </div>
            </div>
            
            {actionApplied ? (
              <button disabled className="w-full bg-gray-100 text-gray-500 rounded-2xl py-3 font-semibold cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                <Check className="w-4 h-4" />
                Acción aplicada
              </button>
            ) : (
              <button onClick={handleApplyAction} className="w-full bg-blue-600 text-white rounded-2xl py-3 font-semibold hover:bg-blue-700 transition-colors text-sm">
                Aplicar esta acción
              </button>
            )}
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Movimientos</h3>
            <div className="space-y-2">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'aporte' ? 'bg-blue-50' : 'bg-red-50'
                    }`}>
                      {transaction.type === 'aporte' ? (
                        <ArrowRight className="w-5 h-5 text-blue-600 transform -rotate-90" />
                      ) : (
                        <ArrowRight className="w-5 h-5 text-red-600 transform rotate-90" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.date.toLocaleDateString('es-AR', { 
                          day: 'numeric', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'aporte' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'aporte' ? '+' : '-'}USD {formatNumber(transaction.amountUSD)}
                    </p>
                    <p className="text-xs text-gray-400">≈ ${formatNumber(transaction.amountARS)}</p>
                  </div>
                </div>
              ))}
            </div>
            {transactions.length > 5 && (
              <button className="w-full mt-4 text-blue-600 text-sm font-medium py-2 hover:text-blue-700 transition-colors">
                Ver todos ({transactions.length})
              </button>
            )}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-6">
          <button onClick={() => setCompoundExpanded(!compoundExpanded)} className="w-full flex items-center justify-between text-left">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">¿Y si además reinvertís lo que ganás?</h3>
              <p className="text-sm text-gray-500">Simulación educativa · sin promesas</p>
            </div>
            {compoundExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
          </button>
          {compoundExpanded && (
            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-3">Escenario 1: Sin inversión</p>
                  <p className="text-sm text-gray-600 mb-2">Ahorro mensual constante</p>
                  <p className="text-lg font-bold text-gray-900 mb-1">USD {formatNumber(monthlyNoInterestUSD)}</p>
                  <p className="text-xs text-gray-400">≈ ${formatNumber(monthlyNoInterestARS)}</p>
                  <div className="pt-4 mt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Llegada estimada:</p>
                    <p className="text-sm font-semibold text-gray-900">{etaNoInterest}</p>
                    <p className="text-xs text-gray-500 mt-1">({getEtaMonthsDisplay(goalMonths)})</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <p className="text-xs text-blue-700 mb-3 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    Escenario 2: Con reinversión
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Mismo esfuerzo mensual</p>
                  <p className="text-lg font-bold text-blue-600 mb-1">USD {formatNumber(monthlyNoInterestUSD)}</p>
                  <p className="text-xs text-gray-400">≈ ${formatNumber(monthlyNoInterestARS)}</p>
                  <div className="pt-4 mt-3 border-t border-blue-200">
                    <p className="text-xs text-gray-500 mb-1">Llegada estimada:</p>
                    <p className="text-sm font-semibold text-blue-600">{etaCompound}</p>
                    <p className="text-xs text-blue-600 mt-1">({getEtaMonthsDisplay(monthsCompound)})</p>
                    <p className="text-xs text-blue-600 font-semibold mt-2">⚡ {Math.round((goalMonths - monthsCompound) * 30.44)} días antes</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200">
                  <p className="text-xs text-blue-700 mb-3 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3" />
                    Escenario 3: Reinversión + recorte
                  </p>
                  <p className="text-sm text-gray-600 mb-2">USD {formatNumber(monthlyNoInterestUSD)} + USD {suggestedCutUSD}</p>
                  <p className="text-lg font-bold text-blue-600 mb-1">USD {formatNumber(monthlyWithCutUSD)}</p>
                  <p className="text-xs text-gray-400">≈ ${formatNumber(monthlyWithCutARS)}</p>
                  <div className="pt-4 mt-3 border-t border-blue-200">
                    <p className="text-xs text-gray-500 mb-1">Llegada estimada:</p>
                    <p className="text-sm font-semibold text-blue-600">{etaWithCut}</p>
                    <p className="text-xs text-blue-600 mt-1">({getEtaMonthsDisplay(monthsWithCut)})</p>
                    <p className="text-xs text-blue-600 font-semibold mt-2">⚡⚡ {Math.round((goalMonths - monthsWithCut) * 30.44)} días antes</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="text-sm text-gray-700 mb-2">
                  {selectedFund ? (
                    <>Invirtiendo en <span className="font-semibold">{investorProfiles[selectedFund].fund}</span> con tasa del {(annualRateUSD * 100).toFixed(0)}% anual. Si además recortás USD {suggestedCutUSD}/mes de {expense.category.toLowerCase()}, adelantás aún más tu meta.</>
                  ) : (
                    <>Invertimos en USD con una tasa del {(annualRateUSD * 100).toFixed(0)}% anual. Si además recortás USD {suggestedCutUSD}/mes de {expense.category.toLowerCase()}, adelantás aún más tu meta.</>
                  )}
                </p>
                <p className="text-xs text-gray-500">Simulación educativa. Los aportes se realizan en dólares (USD) al tipo de cambio vigente (${formatNumber(exchangeRate)}).</p>
              </div>
              <button className="w-full bg-gray-100 text-gray-700 rounded-2xl py-3 font-medium hover:bg-gray-200 transition-colors">Entender cómo funciona</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-600 hover:shadow-md transition-all text-left group">
            <Upload className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-gray-900 mb-1">Importar extracto</p>
            <p className="text-sm text-gray-500">Subí tu PDF o Excel</p>
          </button>
          <button className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-purple-600 hover:shadow-md transition-all text-left group">
            <svg className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="font-semibold text-gray-900 mb-1">Centro de ayuda</p>
            <p className="text-sm text-gray-500">Tutoriales y FAQs</p>
          </button>
        </div>
      </div>

      {showAddSavingsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Agregar ahorro</h2>
              <button onClick={() => setShowAddSavingsModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Monto en dólares (USD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-400 text-lg">USD</span>
                  <input 
                    type="text" 
                    value={savingsAmountUSD ? formatNumber(parseInt(savingsAmountUSD)) : ''} 
                    onChange={handleSavingsAmountChange} 
                    placeholder="0"
                    className="w-full pl-16 pr-5 py-4 border border-gray-200 rounded-2xl text-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Tipo de cambio:</span>
                  <span className="font-semibold text-gray-900">${formatNumber(exchangeRate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Equivalente en ARS:</span>
                  <span className="text-xl font-bold text-gray-700">${formatNumber(savingsAmountARS)}</span>
                </div>
              </div>

              <button 
                onClick={handleAddSavings}
                disabled={!savingsAmountUSD}
                className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar aporte
              </button>
            </div>
          </div>
        </div>
      )}

      {showActionAppliedModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6">
                <Check className="w-9 h-9 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">¡Acción aplicada!</h2>
              <p className="text-gray-600 mb-2">Empezaste tu compromiso de reducir gastos en {expense.category}</p>
              <div className="bg-blue-50 rounded-2xl p-6 my-8 border border-blue-100">
                <p className="text-sm text-gray-600 mb-2">Ahorro mensual automático:</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">USD {recommendedAction.amountUSD}</p>
                <p className="text-sm text-gray-400 mb-4">≈ ${formatNumber(recommendedAction.amountARS)}</p>
                <p className="text-sm text-gray-600 mb-1">Nueva fecha estimada:</p>
                <p className="text-xl font-semibold text-gray-900">{recommendedAction.newETA}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
                <p className="text-sm text-gray-700">
                  ✓ Primer aporte sumado: <span className="font-semibold">USD {recommendedAction.amountUSD}</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Los próximos meses se sumarán automáticamente
                </p>
              </div>
              <button 
                onClick={() => setShowActionAppliedModal(false)}
                className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold hover:bg-blue-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Retirar ahorro</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6">
              <p className="text-sm text-amber-900 flex items-start gap-2">
                <span className="text-amber-600 font-bold flex-shrink-0">⚠️</span>
                <span>Retirar dinero retrasará tu meta. Te recomendamos mantener tus ahorros para alcanzar tu objetivo más rápido.</span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Monto a retirar (USD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-400 text-lg">USD</span>
                  <input 
                    type="text" 
                    value={withdrawAmountUSD ? formatNumber(parseInt(withdrawAmountUSD)) : ''} 
                    onChange={handleWithdrawAmountChange} 
                    placeholder="0"
                    className="w-full pl-16 pr-5 py-4 border border-gray-200 rounded-2xl text-lg focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none transition-colors" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Disponible: USD {formatNumber(currentSavingsUSD)}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Tipo de cambio:</span>
                  <span className="font-semibold text-gray-900">${formatNumber(exchangeRate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Equivalente en ARS:</span>
                  <span className="text-xl font-bold text-gray-900">${formatNumber(withdrawAmountARS)}</span>
                </div>
              </div>

              <button 
                onClick={handleWithdraw}
                disabled={!withdrawAmountUSD || parseInt(withdrawAmountUSD) > currentSavingsUSD}
                className="w-full bg-gray-700 text-white rounded-2xl py-4 font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar retiro
              </button>
              
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="w-full bg-white border border-gray-200 text-gray-700 rounded-2xl py-4 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangeFundModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Cambiar de fondo</h2>
              <button onClick={() => setShowChangeFundModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {Object.entries(investorProfiles).map(([key, profile]) => {
                const isSelected = selectedFund === key;
                const isRecommended = key === investorProfile;
                
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedFund(key);
                      setShowChangeFundModal(false);
                    }}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{profile.name}</h3>
                          {isRecommended && (
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                              Tu perfil
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{profile.description}</p>
                        <p className="text-xs text-gray-500">{profile.composition}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-1 bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-600 mb-1">Riesgo</p>
                        <p className="font-bold text-gray-900">{profile.risk}</p>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-600 mb-1">Retorno anual</p>
                        <p className="font-bold text-blue-600">{(profile.rate * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-sm text-amber-900">
                💡 Al cambiar de fondo, tus proyecciones se actualizarán según la nueva tasa de retorno.
              </p>
            </div>
          </div>
        </div>
      )}

      {showCalculatorModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Calculadora de Interés Compuesto</h2>
                <p className="text-gray-500 text-sm mt-1">Simulá cómo crecen tus inversiones</p>
              </div>
              <button onClick={() => setShowCalculatorModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Inversión inicial (USD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-400">USD</span>
                  <input 
                    type="text" 
                    value={calcInitialAmount}
                    onChange={(e) => setCalcInitialAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-16 pr-5 py-4 border border-gray-200 rounded-2xl text-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Aporte mensual (USD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-400">USD</span>
                  <input 
                    type="text" 
                    value={calcMonthlyContribution}
                    onChange={(e) => setCalcMonthlyContribution(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full pl-16 pr-5 py-4 border border-gray-200 rounded-2xl text-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Plazo (meses)</label>
                <input 
                  type="number" 
                  value={calcMonths}
                  onChange={(e) => setCalcMonths(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tasa de retorno</label>
                <select
                  value={calcRate}
                  onChange={(e) => setCalcRate(parseFloat(e.target.value))}
                  className="w-full px-5 py-4 border border-gray-200 rounded-2xl text-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors bg-white"
                >
                  <option value="0.06">6% anual (Conservative)</option>
                  <option value="0.08">8% anual (Moderate)</option>
                  <option value="0.10">10% anual (Risky)</option>
                  <option value="0.05">5% anual</option>
                  <option value="0.12">12% anual</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">Tendrías al final</p>
                <p className="text-5xl font-bold text-gray-900 mb-2">USD {formatNumber(Math.round(calcResults.finalBalance))}</p>
                <p className="text-gray-500">≈ ${formatNumber(Math.round(calcResults.finalBalance * exchangeRate))}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5">
                  <p className="text-xs text-gray-600 mb-2">Capital aportado</p>
                  <p className="text-2xl font-bold text-gray-900">USD {formatNumber(Math.round(calcResults.totalContributed))}</p>
                </div>
                <div className="bg-white rounded-2xl p-5">
                  <p className="text-xs text-gray-600 mb-2">Intereses ganados</p>
                  <p className="text-2xl font-bold text-blue-600">USD {formatNumber(Math.round(calcResults.totalInterest))}</p>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Rendimiento total</span>
                  <span className="text-lg font-bold text-blue-600">
                    {calcResults.totalContributed > 0 ? ((calcResults.totalInterest / calcResults.totalContributed) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-500" 
                    style={{ 
                      width: `${calcResults.totalContributed > 0 ? Math.min((calcResults.totalInterest / calcResults.finalBalance) * 100, 100) : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-gray-500">Capital</span>
                  <span className="text-blue-600">Intereses</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-xs text-gray-600">
                💡 Esta es una simulación educativa. Los resultados reales pueden variar según las condiciones del mercado.
              </p>
            </div>
          </div>
        </div>
      )}

      {showPreKycModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Oops, falta un paso</h2>
              <p className="text-gray-600 leading-relaxed">
                Para poder realizar inversiones, necesitamos verificar tu identidad. Es un requerimiento legal que nos permite protegerte.
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mb-8">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Proceso 100% seguro</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Solo toma 2 minutos</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">Requerido por regulaciones financieras</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  // Pre-llenar datos del KYC con datos de Google si están disponibles
                  if (userGoogleData) {
                    setKycData({
                      ...kycData,
                      fullName: userGoogleData.name || kycData.fullName,
                    });
                  }
                  setShowPreKycModal(false);
                  setShowKycModal(true);
                }}
                className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold hover:bg-blue-700 transition-colors"
              >
                Verificar mi identidad
              </button>
              <button
                onClick={() => setShowPreKycModal(false)}
                className="w-full bg-white border border-gray-200 text-gray-700 rounded-2xl py-4 font-medium hover:bg-gray-50 transition-colors"
              >
                Lo haré más tarde
              </button>
            </div>
          </div>
        </div>
      )}

      {showKycModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-8">
            <div className="p-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Verificá tu identidad</h2>
                  <p className="text-sm text-gray-500 mt-1">Requerido para realizar transacciones</p>
                </div>
              </div>
              <button onClick={() => setShowKycModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {userGoogleData && (
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mb-6">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <div>
                      <p className="text-sm text-blue-900 font-medium mb-1">
                        Ya completamos algunos datos desde tu cuenta de Google
                      </p>
                      <p className="text-sm text-blue-800">
                        Podés editarlos si es necesario. Completá el resto para comenzar a invertir.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Nombre completo *</label>
                    {userGoogleData && kycData.fullName === userGoogleData.name && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Google
                      </span>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={kycData.fullName}
                    onChange={(e) => setKycData({...kycData, fullName: e.target.value})}
                    placeholder="Juan Pérez"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                  />
                  {userGoogleData && kycData.fullName === userGoogleData.name && (
                    <p className="text-xs text-gray-500 mt-1">Podés editarlo si es necesario</p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    {userGoogleData && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Google
                      </span>
                    )}
                  </div>
                  <input 
                    type="email" 
                    value={userEmail}
                    readOnly={userGoogleData !== null}
                    onChange={(e) => !userGoogleData && setUserEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-3 border border-gray-200 rounded-2xl transition-colors ${userGoogleData ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none'}`}
                  />
                  {userGoogleData && (
                    <p className="text-xs text-gray-500 mt-1">Este email no se puede modificar</p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DNI *</label>
                  <input 
                    type="text" 
                    value={kycData.dni}
                    onChange={(e) => setKycData({...kycData, dni: e.target.value.replace(/[^0-9]/g, '')})}
                    placeholder="12345678"
                    maxLength="8"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de nacimiento *</label>
                <input 
                  type="date" 
                  value={kycData.birthDate}
                  onChange={(e) => setKycData({...kycData, birthDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                />
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Domicilio</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                    <input 
                      type="text" 
                      value={kycData.address}
                      onChange={(e) => setKycData({...kycData, address: e.target.value})}
                      placeholder="Av. Corrientes 1234"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                      <input 
                        type="text" 
                        value={kycData.city}
                        onChange={(e) => setKycData({...kycData, city: e.target.value})}
                        placeholder="Buenos Aires"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                      <input 
                        type="text" 
                        value={kycData.postalCode}
                        onChange={(e) => setKycData({...kycData, postalCode: e.target.value.replace(/[^0-9]/g, '')})}
                        placeholder="1234"
                        maxLength="4"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Información laboral</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ocupación *</label>
                    <input 
                      type="text" 
                      value={kycData.occupation}
                      onChange={(e) => setKycData({...kycData, occupation: e.target.value})}
                      placeholder="Desarrollador"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ingresos mensuales *</label>
                    <select
                      value={kycData.monthlyIncome}
                      onChange={(e) => setKycData({...kycData, monthlyIncome: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors bg-white"
                    >
                      <option value="">Seleccioná</option>
                      <option value="0-500000">Menos de $500.000</option>
                      <option value="500000-1000000">$500.000 - $1.000.000</option>
                      <option value="1000000-2000000">$1.000.000 - $2.000.000</option>
                      <option value="2000000+">Más de $2.000.000</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Persona Expuesta Políticamente (PEP)</h3>
                  <p className="text-sm text-gray-600 mb-4">¿Vos o un familiar directo ejercen o han ejercido cargos públicos en los últimos 2 años?</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setKycData({...kycData, isPEP: false})}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        kycData.isPEP === false 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      No
                    </button>
                    <button
                      onClick={() => setKycData({...kycData, isPEP: true})}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        kycData.isPEP === true 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Sí
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={kycData.acceptTerms}
                    onChange={(e) => setKycData({...kycData, acceptTerms: e.target.checked})}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto los <a href="#" className="text-blue-600 hover:underline">Términos y Condiciones</a> y confirmo que la información proporcionada es correcta y veraz.
                  </span>
                </label>
              </div>

              <button
                onClick={() => {
                  const isFormValid = 
                    kycData.fullName && 
                    userEmail &&
                    kycData.dni && 
                    kycData.birthDate && 
                    kycData.address && 
                    kycData.city && 
                    kycData.occupation && 
                    kycData.monthlyIncome && 
                    kycData.acceptTerms;
                  
                  if (isFormValid) {
                    setKycCompleted(true);
                    setShowKycModal(false);
                  }
                }}
                disabled={!(
                  kycData.fullName && 
                  userEmail &&
                  kycData.dni && 
                  kycData.birthDate && 
                  kycData.address && 
                  kycData.city && 
                  kycData.occupation && 
                  kycData.monthlyIncome && 
                  kycData.acceptTerms
                )}
                className="w-full bg-blue-600 text-white rounded-2xl py-4 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Verificar identidad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
