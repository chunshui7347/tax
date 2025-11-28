export const TAX_BRACKETS_2025 = [
    { min: 0, max: 5000, rate: 0, baseTax: 0 },
    { min: 5001, max: 20000, rate: 0.01, baseTax: 0 },
    { min: 20001, max: 35000, rate: 0.03, baseTax: 150 },
    { min: 35001, max: 50000, rate: 0.06, baseTax: 600 },
    { min: 50001, max: 70000, rate: 0.11, baseTax: 1500 },
    { min: 70001, max: 100000, rate: 0.19, baseTax: 3700 },
    { min: 100001, max: 400000, rate: 0.25, baseTax: 9400 },
    { min: 400001, max: 600000, rate: 0.26, baseTax: 84400 },
    { min: 600001, max: 2000000, rate: 0.28, baseTax: 136400 },
    { min: 2000001, max: Infinity, rate: 0.30, baseTax: 528400 },
];

export const RELIEF_LIMITS_2025 = {
    INDIVIDUAL: 9000,
    DISABLED_INDIVIDUAL: 7000, // Additional
    SPOUSE: 4000,
    DISABLED_SPOUSE: 6000, // Additional
    CHILD_UNDER_18: 2000,
    CHILD_STUDYING: 2000, // 18+
    CHILD_HIGHER_EDU: 8000, // Diploma/Degree
    DISABLED_CHILD: 6000, // Additional
    DISABLED_CHILD_HIGHER_EDU: 8000, // Additional
    CHILDCARE: 3000,
    MEDICAL_SERIOUS_FERTILITY: 10000,
    MEDICAL_PARENTS: 8000,
    BASIC_SUPPORT_EQUIPMENT: 6000,
    LIFE_INSURANCE: 3000,
    EPF: 4000,
    EDU_MEDICAL_INSURANCE: 4000,
    SOCSO_EIS: 350,
    PRS: 3000,
    SSPN: 8000,
    LIFESTYLE: 2500,
    SPORTS: 1000,
    EV_CHARGING_COMPOST: 2500,
    BREASTFEEDING: 1000,
    EDUCATION_FEES_SELF: 7000,
};

export const REBATES = {
    LOW_INCOME_THRESHOLD: 35000,
    LOW_INCOME_AMOUNT: 400,
    ZAKAT: 'actual', // Capped at tax payable
};
