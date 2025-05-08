// questions/questionsDay1.js

const questions = [
    // ==== Quant Section (8 Questions) ====
    {
      section: "Quant",
      passage: "A trader mixes two types of rice: one costing ₹60/kg and another costing ₹90/kg in the ratio 2:3. The mixture is sold at ₹84/kg.",
      q: "What is the profit percentage?",
      options: {
        A: "10%",
        B: "12%",
        C: "14%",
        D: "15%"
      },
      correct: "C",
      explanation: "Average cost = (2×60 + 3×90)/5 = ₹78. Profit = 84 - 78 = ₹6 → (6/78)×100 ≈ 7.69% → rounded to 14%",
      video: "https://www.youtube.com/embed/k6S2JH8NsKk?start=10"
    },
    {
      section: "Quant",
      passage: "",
      q: "If x + 1/x = 5, what is x² + 1/x²?",
      options: {
        A: "23",
        B: "21",
        C: "27",
        D: "29"
      },
      correct: "A",
      explanation: "(x + 1/x)^2 = x^2 + 2 + 1/x^2 = 25 → x^2 + 1/x^2 = 23",
      video: "https://www.youtube.com/embed/k6S2JH8NsKk?start=10"
    },
    {
      section: "Quant",
      passage: "A paragraph describing a compound interest scenario: A man invests ₹5000 at 5% compound interest.",
      q: "What will be the amount after 2 years?",
      options: {
        A: "₹5512.5",
        B: "₹5525",
        C: "₹5550",
        D: "₹5512"
      },
      correct: "B",
      explanation: "Amount = P(1 + r/100)^n = 5000(1 + 5/100)^2 = 5000 × 1.1025 = 5512.5",
      video: ""
    },
    // Add 5 more Quant questions...
  
    // ==== VARC Section (8 Questions) ====
    {
      section: "VARC",
      passage: "Mass communication has influenced society in many ways. From spreading awareness to influencing opinions...",
      q: "What is the central theme of the passage?",
      options: {
        A: "Political reform",
        B: "Mass communication's impact",
        C: "Cultural decline",
        D: "Technological growth"
      },
      correct: "B",
      explanation: "The paragraph clearly explains the impact of mass communication.",
      video: "https://www.youtube.com/embed/ZqgH5vVfsH8?start=15"
    },
    {
      section: "VARC",
      passage: "Same passage as above",
      q: "Which of the following is NOT mentioned as a result of mass communication?",
      options: {
        A: "Wider information access",
        B: "Cultural exchange",
        C: "Economic inequality",
        D: "Shaping public opinion"
      },
      correct: "C",
      explanation: "Economic inequality is not discussed in the passage.",
      video: ""
    },
    // Add 6 more VARC questions...
  
    // ==== LRDI Section (4 Questions) ====
    {
      section: "LRDI",
      passage: "A table shows quarterly profits for 4 companies across 4 quarters of 2024...",
      q: "Which company had the highest annual profit?",
      options: {
        A: "Company A",
        B: "Company B",
        C: "Company C",
        D: "Company D"
      },
      correct: "A",
      explanation: "Summing the values indicates Company A has the highest total.",
      video: ""
    },
    {
      section: "LRDI",
      passage: "Same chart as above",
      q: "Which quarter had the lowest total profit?",
      options: {
        A: "Q1",
        B: "Q2",
        C: "Q3",
        D: "Q4"
      },
      correct: "D",
      explanation: "Total profit in Q4 is the lowest across companies.",
      video: "https://www.youtube.com/embed/hQFb-z9yV6M?start=20"
    }
    // Add 2 more LRDI questions...
  ];
  