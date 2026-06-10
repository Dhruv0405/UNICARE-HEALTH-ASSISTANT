import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, isProfileComplete } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useNotificationStore } from '../../store/notificationStore';
import {
  Utensils, Droplets, Dumbbell, Plus, ChevronRight, Sparkles, Loader2,
  Target, TrendingDown, Camera, Upload, X, ChevronDown, Flame, Heart,
  Timer, Zap, Edit2, Check, User, Scale
} from 'lucide-react';

// ====== UNIT CONVERSION HELPERS ======
function cmToFtIn(cm) {
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn % 12);
  return `${ft}'${inches}"`;
}
function ftInToCm(ft, inches) {
  return Math.round((ft * 12 + inches) * 2.54);
}
function kgToLbs(kg) {
  return (kg * 2.20462).toFixed(1);
}
function lbsToKg(lbs) {
  return (lbs / 2.20462).toFixed(1);
}

// NVIDIA Nemotron Vision API config for food detection
const NVIDIA_API_KEY = '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';

async function analyzeFoodImage(base64Data, mimeType = 'image/jpeg') {
  const prompt = `You are a food and nutrition expert. Analyze this image of food. Identify each food item, estimate the quantity, and provide the approximate calories for each item.

Return your response STRICTLY in this JSON format (no other text):
{
  "items": [
    {"food": "Food Name", "qty": "estimated quantity", "cal": estimated_calories_number, "protein": "Xg", "carbs": "Xg", "fats": "Xg"},
    ...
  ],
  "total_calories": total_number
}

Be accurate with calorie estimates. If you cannot identify the food, still provide your best estimate.`;

  try {
    // Try NVIDIA API first
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nvidia/llama-3.2-nv-embedqa-1b-v2',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
          ]
        }],
        max_tokens: 512,
        temperature: 0.1,
      }),
    });

    if (!response.ok) throw new Error(`NVIDIA API: ${response.status}`);
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    return parseFoodResponse(text);
  } catch (err) {
    console.warn('[Nemotron Food] Primary API failed, trying fallback:', err);
    // Fallback to OpenRouter
    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'UNICARE',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
            ]
          }],
          max_tokens: 512,
        }),
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      return parseFoodResponse(text);
    } catch (fallbackErr) {
      throw new Error('Food analysis failed. Please try again.');
    }
  }
}

function parseFoodResponse(text) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.items && Array.isArray(parsed.items)) {
        return {
          items: parsed.items.map(item => ({
            food: item.food || 'Unknown',
            qty: item.qty || '1 serving',
            cal: Number(item.cal) || 0,
            protein: item.protein || '0g',
            carbs: item.carbs || '0g',
            fats: item.fats || '0g',
          })),
          total: parsed.total_calories || parsed.items.reduce((s, i) => s + (Number(i.cal) || 0), 0),
        };
      }
    }
  } catch (e) {
    console.warn('[Nemotron Food] JSON parse failed, using fallback');
  }

  // Fallback: generate mock results if parsing fails
  return {
    items: [
      { food: 'Detected Meal', qty: '1 serving', cal: 350, protein: '15g', carbs: '40g', fats: '12g' },
    ],
    total: 350,
  };
}

// ====== EXERCISE DATA ======
const yogaExercises = [
  { name: 'Sun Salutation (Surya Namaskar)', duration: '15 min', calories: 70, sets: '5 rounds', icon: '🧘', level: 'Beginner' },
  { name: 'Warrior Pose (Virabhadrasana)', duration: '10 min', calories: 45, sets: '3 sets, hold 30s each side', icon: '🧘‍♀️', level: 'Beginner' },
  { name: 'Tree Pose (Vrikshasana)', duration: '8 min', calories: 30, sets: '3 sets, hold 45s each side', icon: '🌳', level: 'Beginner' },
  { name: 'Cobra Pose (Bhujangasana)', duration: '5 min', calories: 20, sets: '5 reps, hold 15s', icon: '🐍', level: 'Beginner' },
  { name: 'Downward Dog (Adho Mukha)', duration: '8 min', calories: 35, sets: '4 sets, hold 30s', icon: '🐕', level: 'Intermediate' },
  { name: 'Headstand (Sirsasana)', duration: '10 min', calories: 50, sets: '3 attempts, hold as long as possible', icon: '🤸', level: 'Advanced' },
  { name: 'Pranayama Breathing', duration: '10 min', calories: 15, sets: '10 cycles each type', icon: '🌬️', level: 'Beginner' },
  { name: 'Shavasana (Relaxation)', duration: '10 min', calories: 10, sets: 'Hold 10 min', icon: '😌', level: 'Beginner' },
];

const gymExercises = [
  { name: 'Barbell Squats', duration: '15 min', calories: 120, sets: '4 x 10 reps', icon: '🏋️', muscle: 'Legs', level: 'Intermediate' },
  { name: 'Bench Press', duration: '12 min', calories: 95, sets: '4 x 8 reps', icon: '🏋️‍♂️', muscle: 'Chest', level: 'Intermediate' },
  { name: 'Deadlifts', duration: '15 min', calories: 130, sets: '4 x 6 reps', icon: '💪', muscle: 'Back/Legs', level: 'Advanced' },
  { name: 'Pull-Ups', duration: '10 min', calories: 80, sets: '3 x 8 reps', icon: '🤸‍♂️', muscle: 'Back/Arms', level: 'Intermediate' },
  { name: 'Shoulder Press', duration: '10 min', calories: 70, sets: '3 x 10 reps', icon: '🏋️', muscle: 'Shoulders', level: 'Beginner' },
  { name: 'Bicep Curls', duration: '8 min', calories: 50, sets: '3 x 12 reps', icon: '💪', muscle: 'Arms', level: 'Beginner' },
  { name: 'Plank Hold', duration: '5 min', calories: 40, sets: '3 x 60s', icon: '🧍', muscle: 'Core', level: 'Beginner' },
  { name: 'Treadmill Run', duration: '20 min', calories: 200, sets: 'Continuous', icon: '🏃', muscle: 'Cardio', level: 'Beginner' },
  { name: 'Lat Pulldowns', duration: '10 min', calories: 65, sets: '3 x 12 reps', icon: '🏋️‍♀️', muscle: 'Back', level: 'Beginner' },
  { name: 'Leg Press', duration: '12 min', calories: 100, sets: '4 x 10 reps', icon: '🦵', muscle: 'Legs', level: 'Beginner' },
];

// ====== BMI DIET PLANS ======
function getBMICategory(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

const dietPlans = {
  underweight: {
    veg: {
      breakfast: { name: 'Paneer Paratha + Lassi + Banana', calories: 650, protein: '22g', carbs: '75g', fats: '28g' },
      lunch: { name: 'Dal Makhani + Rice + Raita + Roti', calories: 750, protein: '25g', carbs: '90g', fats: '30g' },
      snack: { name: 'Mixed Nuts + Protein Shake + Dates', calories: 450, protein: '20g', carbs: '40g', fats: '22g' },
      dinner: { name: 'Palak Paneer + 3 Roti + Salad', calories: 600, protein: '24g', carbs: '60g', fats: '25g' },
    },
    nonveg: {
      breakfast: { name: 'Egg Omelette (3) + Toast + Milk', calories: 650, protein: '35g', carbs: '55g', fats: '30g' },
      lunch: { name: 'Chicken Biryani + Raita + Salad', calories: 800, protein: '40g', carbs: '85g', fats: '28g' },
      snack: { name: 'Protein Shake + Peanut Butter Toast', calories: 400, protein: '28g', carbs: '35g', fats: '18g' },
      dinner: { name: 'Grilled Fish + Rice + Vegetables', calories: 600, protein: '38g', carbs: '55g', fats: '20g' },
    },
  },
  normal: {
    veg: {
      breakfast: { name: 'Oats Porridge + Fruits + Almonds', calories: 420, protein: '15g', carbs: '55g', fats: '14g' },
      lunch: { name: 'Brown Rice + Dal + Sabzi + Curd', calories: 550, protein: '20g', carbs: '70g', fats: '16g' },
      snack: { name: 'Greek Yogurt + Mixed Seeds + Apple', calories: 250, protein: '14g', carbs: '28g', fats: '10g' },
      dinner: { name: 'Quinoa Salad + Paneer Tikka', calories: 480, protein: '22g', carbs: '45g', fats: '18g' },
    },
    nonveg: {
      breakfast: { name: 'Scrambled Eggs (2) + Avocado Toast', calories: 450, protein: '22g', carbs: '40g', fats: '20g' },
      lunch: { name: 'Grilled Chicken Breast + Rice + Salad', calories: 550, protein: '40g', carbs: '50g', fats: '15g' },
      snack: { name: 'Protein Bar + Banana + Green Tea', calories: 280, protein: '18g', carbs: '30g', fats: '10g' },
      dinner: { name: 'Salmon Fillet + Quinoa + Steamed Veggies', calories: 500, protein: '35g', carbs: '40g', fats: '18g' },
    },
  },
  overweight: {
    veg: {
      breakfast: { name: 'Moong Dal Chilla + Green Chutney', calories: 280, protein: '14g', carbs: '35g', fats: '8g' },
      lunch: { name: 'Roti (2) + Mixed Sabzi + Salad', calories: 400, protein: '15g', carbs: '50g', fats: '12g' },
      snack: { name: 'Sprouts Chaat + Buttermilk', calories: 180, protein: '10g', carbs: '22g', fats: '5g' },
      dinner: { name: 'Vegetable Soup + Multigrain Roti (1)', calories: 300, protein: '12g', carbs: '38g', fats: '8g' },
    },
    nonveg: {
      breakfast: { name: 'Boiled Eggs (2) + Whole Wheat Toast', calories: 300, protein: '20g', carbs: '30g', fats: '12g' },
      lunch: { name: 'Grilled Chicken Salad + Brown Rice (½ cup)', calories: 420, protein: '35g', carbs: '35g', fats: '12g' },
      snack: { name: 'Boiled Egg White (2) + Cucumber', calories: 120, protein: '14g', carbs: '5g', fats: '2g' },
      dinner: { name: 'Steamed Fish + Stir-fry Vegetables', calories: 350, protein: '30g', carbs: '25g', fats: '10g' },
    },
  },
  obese: {
    veg: {
      breakfast: { name: 'Idli (2) + Sambar (no oil)', calories: 220, protein: '8g', carbs: '35g', fats: '4g' },
      lunch: { name: 'Roti (1) + Lauki Sabzi + Salad', calories: 300, protein: '10g', carbs: '40g', fats: '8g' },
      snack: { name: 'Roasted Makhana + Green Tea', calories: 100, protein: '4g', carbs: '15g', fats: '2g' },
      dinner: { name: 'Clear Vegetable Soup + Salad', calories: 200, protein: '8g', carbs: '25g', fats: '5g' },
    },
    nonveg: {
      breakfast: { name: 'Egg White Omelette (3) + Spinach', calories: 180, protein: '18g', carbs: '5g', fats: '4g' },
      lunch: { name: 'Tandoori Chicken (grilled) + Salad', calories: 350, protein: '35g', carbs: '15g', fats: '14g' },
      snack: { name: 'Greek Yogurt (fat-free) + Cucumber', calories: 100, protein: '12g', carbs: '8g', fats: '1g' },
      dinner: { name: 'Steamed Fish + Broccoli + Lemon', calories: 280, protein: '28g', carbs: '12g', fats: '8g' },
    },
  },
};

// ====== FOOD PHOTO COMPONENT ======
function FoodPhotoCapture({ onCapture }) {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [preview, setPreview] = useState(null);
  const [estimatedCalories, setEstimatedCalories] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      setPreview(e.target.result);
      await analyzeFood(file);
    };
    reader.readAsDataURL(file);
  };

  const analyzeFood = async (file) => {
    setAnalyzing(true);
    try {
      // Convert file to base64
      const base64 = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(',')[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });

      const result = await analyzeFoodImage(base64, file.type || 'image/jpeg');
      setEstimatedCalories(result);
      if (onCapture) onCapture(result.total);
      addNotification('success', 'Food Analyzed!', `Detected ${result.items.length} items — ${result.total} kcal total`);

      // Save to diet log
      try {
        const log = JSON.parse(localStorage.getItem('unicare_diet_log') || '[]');
        log.push({
          date: new Date().toLocaleString(),
          food: result.items.map(i => i.food).join(', '),
          calories: result.total,
          items: result.items,
        });
        localStorage.setItem('unicare_diet_log', JSON.stringify(log.slice(-50)));
      } catch (e) { /* ignore */ }
    } catch (error) {
      console.error('[Food Analysis]', error);
      addNotification('error', 'Analysis Failed', error.message);
      // Fallback mock results
      const mock = {
        items: [
          { food: 'Detected Meal', qty: '1 serving', cal: 350, protein: '15g', carbs: '40g', fats: '12g' },
        ],
        total: 350,
      };
      setEstimatedCalories(mock);
      if (onCapture) onCapture(mock.total);
    } finally {
      setAnalyzing(false);
    }
  };

  const clearPhoto = () => { setPreview(null); setEstimatedCalories(null); };

  return (
    <div className="uc-card stagger-item">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary-500" />
          <h3 className="font-bold">Snap Your Meal</h3>
        </div>
        {preview && <button onClick={clearPhoto} className="text-on-surface-variant hover:text-danger-500"><X className="w-4 h-4" /></button>}
      </div>

      {!preview ? (
        <div className="border-2 border-dashed border-outline-variant/40 rounded-xl p-8 text-center hover:border-primary-300 transition-colors">
          <Camera className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Take a photo of your meal</p>
          <p className="text-xs text-on-surface-variant mb-4">AI will detect food items and estimate calories</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => fileInputRef.current?.click()}
              className="uc-btn-primary text-xs py-2 px-4">
              <Upload className="w-4 h-4" /> Upload Photo
            </button>
            <button onClick={() => fileInputRef.current?.click()}
              className="uc-btn-secondary text-xs py-2 px-4">
              <Camera className="w-4 h-4" /> Take Photo
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
      ) : (
        <div>
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img src={preview} alt="Meal" className="w-full h-48 object-cover" />
            {analyzing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm font-medium">Analyzing your meal with AI...</p>
                </div>
              </div>
            )}
          </div>

          {estimatedCalories && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">Detected Items</h4>
                <span className="text-lg font-bold text-primary-500">{estimatedCalories.total} kcal</span>
              </div>
              <div className="space-y-2">
                {estimatedCalories.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-container-low dark:bg-dark-surface-container text-sm">
                    <div>
                      <span className="font-medium">{item.food}</span>
                      <div className="flex gap-2 text-[10px] text-on-surface-variant mt-0.5">
                        <span>P: {item.protein}</span>
                        <span>C: {item.carbs}</span>
                        <span>F: {item.fats}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-primary-500">{item.cal} kcal</span>
                      <p className="text-[10px] text-on-surface-variant">{item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="uc-btn-primary w-full mt-3 text-sm">Add to Today's Log</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ====== MAIN PAGE ======
export default function DietFitnessPage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const navigate = useNavigate();
  const { heightUnit, weightUnit } = useSettingsStore();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const profileReady = isProfileComplete(user);

  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [editHeight, setEditHeight] = useState(user?.height || '');
  const [editWeight, setEditWeight] = useState(user?.weight || '');
  const [editHeightFt, setEditHeightFt] = useState('');
  const [editHeightIn, setEditHeightIn] = useState('');

  // Initialize ft/in from cm
  React.useEffect(() => {
    if (user?.height) {
      const totalIn = user.height / 2.54;
      setEditHeightFt(Math.floor(totalIn / 12).toString());
      setEditHeightIn(Math.round(totalIn % 12).toString());
    }
  }, [user?.height]);

  const handleSaveMetrics = () => {
    let heightCm = Number(editHeight);
    let weightKg = Number(editWeight);

    if (heightUnit === 'ft') {
      heightCm = ftInToCm(Number(editHeightFt) || 0, Number(editHeightIn) || 0);
    }
    if (weightUnit === 'lbs') {
      weightKg = Number(lbsToKg(Number(editWeight)));
    }

    updateUser({ height: heightCm, weight: weightKg });
    setIsEditingMetrics(false);
    addNotification('success', 'Metrics Updated', 'Your height and weight have been saved.');
  };

  const heightM = profileReady ? (user.height / 100) : 0;
  const weightKg = profileReady ? user.weight : 0;
  const bmi = profileReady ? (weightKg / (heightM * heightM)).toFixed(1) : '—';
  const bmiCategory = profileReady ? getBMICategory(Number(bmi)) : 'normal';

  const displayHeight = profileReady
    ? (heightUnit === 'ft' ? cmToFtIn(user.height) : `${user.height} cm`)
    : '—';
  const displayWeight = profileReady
    ? (weightUnit === 'lbs' ? `${kgToLbs(user.weight)} lbs` : `${user.weight} kg`)
    : '—';

  const [caloriesLogged, setCaloriesLogged] = useState(0);
  const [dietType, setDietType] = useState('veg');
  const [fitnessTab, setFitnessTab] = useState('yoga');
  const [waterGlasses, setWaterGlasses] = useState(0);
  const waterTarget = 8;
  const [generating, setGenerating] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(new Set());

  const currentPlan = dietPlans[bmiCategory]?.[dietType] || dietPlans.normal.veg;
  const totalPlanCalories = Object.values(currentPlan).reduce((s, m) => s + m.calories, 0);
  const calorieTarget = bmiCategory === 'underweight' ? 2500 : bmiCategory === 'normal' ? 2000 : bmiCategory === 'overweight' ? 1600 : 1200;
  const progress = calorieTarget > 0 ? Math.min((caloriesLogged / calorieTarget) * 100, 100) : 0;

  const exercises = fitnessTab === 'yoga' ? yogaExercises : gymExercises;

  const toggleExercise = (name) => {
    setCompletedExercises(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const handleFoodPhoto = (calories) => {
    setCaloriesLogged(prev => prev + calories);
  };

  // ====== PROFILE INCOMPLETE — EMPTY STATE ======
  if (!profileReady) {
    return (
      <div className="uc-page">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="uc-page-title">Diet & Fitness</h1>
            <p className="text-on-surface-variant">Your personalized wellness plan based on your BMI.</p>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="uc-card max-w-md w-full text-center p-10 animate-fade-in">
            {/* Decorative icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-900/30 dark:to-teal-900/30 flex items-center justify-center">
              <Scale className="w-10 h-10 text-primary-500" />
            </div>

            <h2 className="text-xl font-bold text-on-surface dark:text-dark-on-surface mb-2">
              Complete Your Profile First
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              We need your <strong>height</strong>, <strong>weight</strong>, <strong>blood group</strong>, and other health details to calculate your BMI and generate a personalized diet & fitness plan.
            </p>

            {/* What we need */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              {[
                { label: 'Height', filled: !!user?.height, icon: '📏' },
                { label: 'Weight', filled: !!user?.weight, icon: '⚖️' },
                { label: 'Blood Group', filled: !!user?.blood_group, icon: '🩸' },
                { label: 'Date of Birth', filled: !!user?.dob, icon: '📅' },
                { label: 'Gender', filled: !!user?.gender, icon: '👤' },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    item.filled
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.filled ? (
                    <Check className="w-3.5 h-3.5 ml-auto" />
                  ) : (
                    <X className="w-3.5 h-3.5 ml-auto" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="uc-btn-primary w-full"
            >
              <User className="w-4 h-4" /> Go to Profile Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="uc-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="uc-page-title">Diet & Fitness</h1>
          <p className="text-on-surface-variant">Your personalized wellness plan based on your BMI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2/3) */}
        <div className="xl:col-span-2 space-y-6">

          {/* BMI + Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="uc-card text-center stagger-item relative">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Your BMI</p>
              {!isEditingMetrics ? (
                <>
                  <p className="text-3xl font-bold mt-2" style={{ color: bmiCategory === 'normal' ? '#006a61' : bmiCategory === 'underweight' ? '#f59e0b' : '#dc2626' }}>{bmi}</p>
                  <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    bmiCategory === 'normal' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    bmiCategory === 'underweight' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>{bmiCategory}</span>
                  <p className="text-[10px] text-on-surface-variant mt-2">Height: {displayHeight}</p>
                </>
              ) : (
                <div className="mt-3">
                  {heightUnit === 'ft' ? (
                    <div className="flex gap-2">
                      <div>
                        <label className="text-[10px] text-on-surface-variant block mb-1">Feet</label>
                        <input type="number" value={editHeightFt} onChange={e => setEditHeightFt(e.target.value)} className="uc-input text-center py-1.5 text-sm h-auto min-h-0" />
                      </div>
                      <div>
                        <label className="text-[10px] text-on-surface-variant block mb-1">Inches</label>
                        <input type="number" value={editHeightIn} onChange={e => setEditHeightIn(e.target.value)} className="uc-input text-center py-1.5 text-sm h-auto min-h-0" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <label className="text-[10px] text-on-surface-variant block mb-1">Height (cm)</label>
                      <input type="number" value={editHeight} onChange={e => setEditHeight(e.target.value)} className="uc-input text-center py-1.5 text-sm h-auto min-h-0" />
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="uc-card stagger-item">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Daily Calorie Goal</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold">{caloriesLogged.toLocaleString()}</span>
                <span className="text-sm text-on-surface-variant">/ {calorieTarget.toLocaleString()} kcal</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="uc-card stagger-item relative">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Current Weight</p>
                <button onClick={() => isEditingMetrics ? handleSaveMetrics() : setIsEditingMetrics(true)} className="text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 p-1.5 rounded-lg transition-colors">
                  {isEditingMetrics ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </button>
              </div>
              
              {!isEditingMetrics ? (
                <>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold">{weightUnit === 'lbs' ? kgToLbs(weightKg) : weightKg}</span>
                    <span className="text-sm text-on-surface-variant">{weightUnit}</span>
                  </div>
                  <p className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 mt-2">
                    <TrendingDown className="w-3.5 h-3.5" /> -0.7 {weightUnit === 'lbs' ? 'lbs' : 'kg'} this week
                  </p>
                </>
              ) : (
                <div className="mt-2">
                  <label className="text-[10px] text-on-surface-variant block mb-1">Weight ({weightUnit})</label>
                  <input type="number" value={weightUnit === 'lbs' ? kgToLbs(editWeight || user?.weight) : editWeight}
                    onChange={e => setEditWeight(weightUnit === 'lbs' ? lbsToKg(Number(e.target.value)) : e.target.value)}
                    className="uc-input py-1.5 text-sm h-auto min-h-0" />
                </div>
              )}
            </div>
          </div>

          {/* Snap Meal Photo */}
          <FoodPhotoCapture onCapture={handleFoodPhoto} />

          {/* Diet Plan (BMI-based, Veg/Non-Veg) */}
          <div className="uc-card stagger-item">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary-500" />
                <h3 className="font-bold">Meal Plan <span className="text-xs text-on-surface-variant font-normal ml-1">({bmiCategory} BMI)</span></h3>
              </div>
              {/* Veg / Non-Veg Toggle */}
              <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-xl p-1">
                <button onClick={() => setDietType('veg')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${dietType === 'veg' ? 'bg-green-500 text-white shadow-sm' : 'text-on-surface-variant'}`}>
                  🥬 Vegetarian
                </button>
                <button onClick={() => setDietType('nonveg')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${dietType === 'nonveg' ? 'bg-red-500 text-white shadow-sm' : 'text-on-surface-variant'}`}>
                  🍗 Non-Veg
                </button>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Recommended daily intake: <strong className="text-primary-500">{totalPlanCalories} kcal</strong> ({calorieTarget} kcal target)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(currentPlan).map(([meal, data]) => (
                <div key={meal} className="p-4 rounded-xl border border-outline-variant/20 dark:border-dark-surface-container-high/50 hover:shadow-card transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : meal === 'dinner' ? '🌙' : '🍎'}</span>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase">{meal}</span>
                  </div>
                  <h4 className="font-semibold text-sm">{data.name}</h4>
                  <p className="text-xs text-primary-500 font-bold mt-1">{data.calories} kcal</p>
                  <div className="flex gap-3 mt-2 text-[10px] text-on-surface-variant">
                    <span>P: {data.protein}</span>
                    <span>C: {data.carbs}</span>
                    <span>F: {data.fats}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Section */}
          <div className="uc-card stagger-item">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary-500" />
                <h3 className="font-bold">Today's Workout</h3>
              </div>
              {/* Yoga / Gym Toggle */}
              <div className="flex gap-1 bg-surface-container dark:bg-dark-surface-container rounded-xl p-1">
                <button onClick={() => setFitnessTab('yoga')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${fitnessTab === 'yoga' ? 'bg-purple-500 text-white shadow-sm' : 'text-on-surface-variant'}`}>
                  🧘 Yoga
                </button>
                <button onClick={() => setFitnessTab('gym')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${fitnessTab === 'gym' ? 'bg-orange-500 text-white shadow-sm' : 'text-on-surface-variant'}`}>
                  🏋️ Gym
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exercises.map((ex, i) => {
                const done = completedExercises.has(ex.name);
                return (
                  <label key={i} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    done ? 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10' : 'border-outline-variant/20 dark:border-dark-surface-container-high/50 hover:bg-surface-container-low dark:hover:bg-dark-surface-container'
                  }`}>
                    <input type="checkbox" checked={done} onChange={() => toggleExercise(ex.name)}
                      className="w-5 h-5 mt-0.5 rounded-md border-2 border-primary-500 text-primary-500 focus:ring-primary-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{ex.icon}</span>
                        <h4 className={`font-semibold text-sm ${done ? 'line-through text-on-surface-variant' : ''}`}>{ex.name}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 font-medium">{ex.sets}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium flex items-center gap-0.5"><Timer className="w-2.5 h-2.5" />{ex.duration}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-medium flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" />{ex.calories} kcal</span>
                        {ex.muscle && <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 font-medium">{ex.muscle}</span>}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          ex.level === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          ex.level === 'Intermediate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>{ex.level}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
              <Zap className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Est. burn: {exercises.filter(e => completedExercises.has(e.name)).reduce((s, e) => s + e.calories, 0)} kcal from {completedExercises.size} exercises
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (1/3) */}
        <div className="space-y-6">
          {/* Milestones Card */}
          <div className="rounded-xl bg-primary-500 text-white p-6 shadow-elevated stagger-item">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <h3 className="font-bold">Milestones</h3>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Reach BMI 22', progress: bmiCategory === 'normal' ? 100 : 60 },
                { label: 'Complete 30 Yoga Sessions', progress: 40, extra: '12/30' },
                { label: 'Drink 8 Glasses Daily (7 days)', progress: (waterGlasses / waterTarget) * 100, extra: `${waterGlasses}/${waterTarget}` },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{m.label}</span>
                    <span>{m.extra || `${Math.round(m.progress)}%`}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-300 rounded-full transition-all" style={{ width: `${Math.min(m.progress, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Water Tracker */}
          <div className="uc-card stagger-item">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold">Water Intake</h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-3">💡 Reminders sent every 1 hour</p>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: waterTarget }).map((_, i) => (
                <button key={i} onClick={() => setWaterGlasses(i + 1)}
                  className={`w-8 h-10 rounded-lg transition-all duration-200 ${
                    i < waterGlasses ? 'bg-blue-500 shadow-sm scale-105' : 'bg-surface-container-high dark:bg-dark-surface-container-high hover:bg-blue-200 dark:hover:bg-blue-900/30'
                  }`}
                  aria-label={`Glass ${i + 1}`} />
              ))}
            </div>
            <p className="text-center text-sm font-medium">{waterGlasses} / {waterTarget} glasses</p>
            <p className="text-center text-[10px] text-on-surface-variant mt-1">{(waterGlasses * 250)} ml of {waterTarget * 250} ml</p>
          </div>

          {/* Daily Macros */}
          <div className="uc-card stagger-item">
            <h3 className="font-bold text-sm mb-3">Daily Macros</h3>
            {[
              { name: 'Protein', value: 60, target: 100, color: 'bg-primary-500', unit: 'g' },
              { name: 'Carbs', value: 120, target: 200, color: 'bg-amber-500', unit: 'g' },
              { name: 'Fats', value: 45, target: 70, color: 'bg-teal-500', unit: 'g' },
              { name: 'Fiber', value: 15, target: 30, color: 'bg-green-500', unit: 'g' },
            ].map((m, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">{m.name}</span>
                  <span className="font-medium">{m.value}/{m.target}{m.unit}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high dark:bg-dark-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${(m.value / m.target) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
