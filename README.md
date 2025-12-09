# Diabetes Prediction Web App

A Next.js frontend application for predicting diabetes risk using machine learning. Built with Next.js Pages Router and styled with Tailwind CSS.

## Features

- Clean, responsive UI for entering health metrics
- 8 input fields for diabetes prediction data
- Real-time form validation
- Loading states during API calls
- Clear prediction results with probability percentage
- Error handling and user-friendly error messages
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file from the example:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

4. Update `.env.local` with your backend API endpoint:
   \`\`\`
   NEXT_PUBLIC_API_URL=https://your-actual-api-endpoint
   \`\`\`

### Running Locally

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Form Fields

The app accepts the following health metrics:

- **Pregnancies**: Number of times pregnant
- **Glucose**: Plasma glucose concentration
- **Blood Pressure**: Diastolic blood pressure (mm Hg)
- **Skin Thickness**: Triceps skin fold thickness (mm)
- **Insulin**: 2-Hour serum insulin (mu U/ml)
- **BMI**: Body mass index (weight in kg / height in m²)
- **Diabetes Pedigree Function**: Diabetes pedigree function score
- **Age**: Age in years

## API Integration

The app sends a POST request to `${NEXT_PUBLIC_API_URL}/predict` with the following JSON payload:

\`\`\`json
{
  "pregnancies": 0,
  "glucose": 100,
  "bloodPressure": 70,
  "skinThickness": 20,
  "insulin": 50,
  "bmi": 25,
  "diabetesPedigreeFunction": 0.5,
  "age": 30
}
\`\`\`

Expected response:

\`\`\`json
{
  "prediction": 0,
  "probability": 0.75
}
\`\`\`

Where:
- `prediction`: 0 = Not Diabetic, 1 = Diabetic
- `probability`: Confidence score (0-1)

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment

This app can be easily deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the `NEXT_PUBLIC_API_URL` environment variable in Vercel project settings
4. Deploy!

## Disclaimer

This application is for educational purposes. Always consult a healthcare professional for medical advice. The predictions made by this app should not be used as a substitute for professional medical diagnosis.

## License

MIT
