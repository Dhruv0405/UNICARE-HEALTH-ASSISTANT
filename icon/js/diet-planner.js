// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const calculateBtn = document.getElementById('calculate-btn');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const resultContainer = document.getElementById('result-container');
    const dietPlanContainer = document.getElementById('diet-plan-container');

    // Event Listeners
    calculateBtn.addEventListener('click', calculateBMI);

    // Calculate BMI Function
    function calculateBMI() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        // Validate inputs
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert('Please enter valid height and weight values');
            return;
        }

        // Calculate BMI: weight (kg) / (height (m))²
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        const roundedBMI = bmi.toFixed(1);

        // Display BMI result
        bmiValue.textContent = roundedBMI;
        
        // Determine BMI category
        let category;
        if (bmi < 18.5) {
            category = 'Underweight';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal weight';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
        } else {
            category = 'Obese';
        }
        
        bmiCategory.textContent = category;
        resultContainer.style.display = 'block';
        
        // Generate diet plan based on BMI category
        generateDietPlan(category);
    }

    // Generate Diet Plan Function
    function generateDietPlan(category) {
        // Diet plans based on BMI category
        const dietPlans = {
            'Underweight': {
                title: 'Weight Gain Diet Plan',
                description: 'A nutrient-dense diet to help you gain healthy weight.',
                meals: [
                    { time: 'Breakfast', food: 'Oatmeal with nuts, seeds, and fruits + protein shake' },
                    { time: 'Mid-Morning', food: 'Smoothie with banana, peanut butter, and milk' },
                    { time: 'Lunch', food: 'Chicken/tofu with rice, vegetables, and avocado' },
                    { time: 'Afternoon Snack', food: 'Greek yogurt with honey and granola' },
                    { time: 'Dinner', food: 'Salmon/lentils with sweet potato and broccoli' },
                    { time: 'Before Bed', food: 'Protein shake or milk with nuts' }
                ],
                tips: [
                    'Eat larger portions and more frequent meals',
                    'Focus on nutrient and calorie-dense foods',
                    'Include healthy fats like avocados, nuts, and olive oil',
                    'Drink calories (smoothies, shakes) between meals',
                    'Strength training can help build muscle mass'
                ]
            },
            'Normal weight': {
                title: 'Balanced Maintenance Diet Plan',
                description: 'A balanced diet to maintain your healthy weight.',
                meals: [
                    { time: 'Breakfast', food: 'Whole grain toast with eggs and vegetables' },
                    { time: 'Mid-Morning', food: 'Apple with a small handful of almonds' },
                    { time: 'Lunch', food: 'Quinoa salad with mixed vegetables and lean protein' },
                    { time: 'Afternoon Snack', food: 'Greek yogurt with berries' },
                    { time: 'Dinner', food: 'Grilled fish/chicken with roasted vegetables' },
                    { time: 'Evening (optional)', food: 'Herbal tea or small fruit' }
                ],
                tips: [
                    'Maintain a balanced diet with plenty of fruits and vegetables',
                    'Stay hydrated with water throughout the day',
                    'Practice portion control',
                    'Regular physical activity is important for maintaining weight',
                    "Listen to your body's hunger and fullness cues"
                ]
            },
            'Overweight': {
                title: 'Weight Management Diet Plan',
                description: 'A balanced diet with calorie control to help you reach a healthy weight.',
                meals: [
                    { time: 'Breakfast', food: 'Vegetable omelet with one slice of whole grain toast' },
                    { time: 'Mid-Morning', food: 'Small apple or orange' },
                    { time: 'Lunch', food: 'Large salad with lean protein and light dressing' },
                    { time: 'Afternoon Snack', food: 'Carrot sticks with hummus' },
                    { time: 'Dinner', food: 'Grilled fish with steamed vegetables' },
                    { time: 'Evening (optional)', food: 'Herbal tea or small serving of berries' }
                ],
                tips: [
                    'Create a moderate calorie deficit (250-500 calories/day)',
                    'Increase protein intake to maintain muscle mass',
                    'Focus on fiber-rich foods for satiety',
                    'Limit processed foods, added sugars, and refined carbs',
                    'Combine diet with regular physical activity'
                ]
            },
            'Obese': {
                title: 'Healthy Weight Loss Diet Plan',
                description: 'A structured diet plan to help you lose weight gradually and sustainably.',
                meals: [
                    { time: 'Breakfast', food: 'Protein smoothie with spinach and berries (no added sugar)' },
                    { time: 'Mid-Morning', food: 'Small handful of nuts or seeds' },
                    { time: 'Lunch', food: 'Large vegetable soup with lean protein' },
                    { time: 'Afternoon Snack', food: 'Celery with small amount of nut butter' },
                    { time: 'Dinner', food: 'Lean protein with large portion of non-starchy vegetables' },
                    { time: 'Evening (optional)', food: 'Herbal tea (no sugar)' }
                ],
                tips: [
                    'Focus on whole, unprocessed foods',
                    'Prioritize protein and fiber in each meal',
                    'Stay well-hydrated with water',
                    'Consult with a healthcare provider',
                    'Incorporate both cardio and strength training',
                    'Practice mindful eating and stress management'
                ]
            }
        };

        // Get the appropriate diet plan
        const plan = dietPlans[category];
        
        // Clear previous diet plan
        dietPlanContainer.innerHTML = '';
        
        // Create diet plan elements
        const planHeader = document.createElement('div');
        planHeader.className = 'diet-plan-header';
        planHeader.innerHTML = `
            <h3>${plan.title}</h3>
            <p>${plan.description}</p>
        `;
        
        const mealsList = document.createElement('div');
        mealsList.className = 'meals-list';
        
        // Add each meal to the list
        plan.meals.forEach(meal => {
            const mealItem = document.createElement('div');
            mealItem.className = 'meal-item';
            mealItem.innerHTML = `
                <div class="meal-time">${meal.time}</div>
                <div class="meal-food">${meal.food}</div>
            `;
            mealsList.appendChild(mealItem);
        });
        
        const tipsList = document.createElement('div');
        tipsList.className = 'tips-list';
        tipsList.innerHTML = '<h4>Nutrition Tips</h4>';
        
        const tipsUl = document.createElement('ul');
        
        // Add each tip to the list
        plan.tips.forEach(tip => {
            const tipItem = document.createElement('li');
            tipItem.textContent = tip;
            tipsUl.appendChild(tipItem);
        });
        
        tipsList.appendChild(tipsUl);
        
        // Add all elements to the diet plan container
        dietPlanContainer.appendChild(planHeader);
        dietPlanContainer.appendChild(mealsList);
        dietPlanContainer.appendChild(tipsList);
        
        // Scroll to diet plan
        dietPlanContainer.scrollIntoView({ behavior: 'smooth' });
    }
});