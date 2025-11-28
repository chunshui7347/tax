import { TAX_BRACKETS_2025, RELIEF_LIMITS_2025, REBATES } from './taxRules';

export interface Reliefs {
    individual: boolean; // Always true effectively, but for completeness
    disabledIndividual: boolean;
    spouse: boolean;
    disabledSpouse: boolean;
    childrenUnder18: number;
    childrenStudying: number;
    childrenHigherEdu: number;
    disabledChildren: number;
    disabledChildrenHigherEdu: number;
    childcare: number;
    medicalSeriousFertility: number;
    medicalParents: number;
    basicSupportEquipment: number;
    lifeInsurance: number;
    epf: number;
    eduMedicalInsurance: number;
    socsoEis: number;
    prs: number;
    sspn: number;
    lifestyle: number;
    sports: number;
    evChargingCompost: number;
    breastfeeding: number;
    educationFeesSelf: number;
    zakat: number;
}

export interface TaxResult {
    grossIncome: number;
    totalReliefs: number;
    chargeableIncome: number;
    totalTax: number;
    taxBreakdown: {
        baseTax: number;
        rate: number;
        taxOnBalance: number;
    };
    rebates: number;
    finalTaxPayable: number;
}

export function calculateTax(annualIncome: number, reliefs: Reliefs): TaxResult {
    // 1. Calculate Total Reliefs
    let totalReliefs = 0;

    // Individual
    totalReliefs += RELIEF_LIMITS_2025.INDIVIDUAL;
    if (reliefs.disabledIndividual) totalReliefs += RELIEF_LIMITS_2025.DISABLED_INDIVIDUAL;

    // Spouse
    if (reliefs.spouse) totalReliefs += RELIEF_LIMITS_2025.SPOUSE;
    if (reliefs.disabledSpouse) totalReliefs += RELIEF_LIMITS_2025.DISABLED_SPOUSE;

    // Children
    totalReliefs += reliefs.childrenUnder18 * RELIEF_LIMITS_2025.CHILD_UNDER_18;
    totalReliefs += reliefs.childrenStudying * RELIEF_LIMITS_2025.CHILD_STUDYING;
    totalReliefs += reliefs.childrenHigherEdu * RELIEF_LIMITS_2025.CHILD_HIGHER_EDU;
    totalReliefs += reliefs.disabledChildren * RELIEF_LIMITS_2025.DISABLED_CHILD;
    totalReliefs += reliefs.disabledChildrenHigherEdu * (RELIEF_LIMITS_2025.DISABLED_CHILD + RELIEF_LIMITS_2025.DISABLED_CHILD_HIGHER_EDU);

    // Capped Reliefs
    totalReliefs += Math.min(reliefs.childcare, RELIEF_LIMITS_2025.CHILDCARE);
    totalReliefs += Math.min(reliefs.medicalSeriousFertility, RELIEF_LIMITS_2025.MEDICAL_SERIOUS_FERTILITY);
    totalReliefs += Math.min(reliefs.medicalParents, RELIEF_LIMITS_2025.MEDICAL_PARENTS);
    totalReliefs += Math.min(reliefs.basicSupportEquipment, RELIEF_LIMITS_2025.BASIC_SUPPORT_EQUIPMENT);
    totalReliefs += Math.min(reliefs.lifeInsurance, RELIEF_LIMITS_2025.LIFE_INSURANCE);
    totalReliefs += Math.min(reliefs.epf, RELIEF_LIMITS_2025.EPF);
    totalReliefs += Math.min(reliefs.eduMedicalInsurance, RELIEF_LIMITS_2025.EDU_MEDICAL_INSURANCE);
    totalReliefs += Math.min(reliefs.socsoEis, RELIEF_LIMITS_2025.SOCSO_EIS);
    totalReliefs += Math.min(reliefs.prs, RELIEF_LIMITS_2025.PRS);
    totalReliefs += Math.min(reliefs.sspn, RELIEF_LIMITS_2025.SSPN);
    totalReliefs += Math.min(reliefs.lifestyle, RELIEF_LIMITS_2025.LIFESTYLE);
    totalReliefs += Math.min(reliefs.sports, RELIEF_LIMITS_2025.SPORTS);
    totalReliefs += Math.min(reliefs.evChargingCompost, RELIEF_LIMITS_2025.EV_CHARGING_COMPOST);
    totalReliefs += Math.min(reliefs.breastfeeding, RELIEF_LIMITS_2025.BREASTFEEDING);
    totalReliefs += Math.min(reliefs.educationFeesSelf, RELIEF_LIMITS_2025.EDUCATION_FEES_SELF);

    // 2. Calculate Chargeable Income
    const chargeableIncome = Math.max(0, annualIncome - totalReliefs);

    // 3. Calculate Tax
    let totalTax = 0;
    let taxBreakdown = { baseTax: 0, rate: 0, taxOnBalance: 0 };

    for (const bracket of TAX_BRACKETS_2025) {
        if (chargeableIncome >= bracket.min) {
            if (chargeableIncome <= bracket.max) {
                // This is the final bracket
                const taxableAmount = chargeableIncome - (bracket.min - 1); // -1 because min is inclusive e.g. 5001
                const taxOnBalance = taxableAmount * bracket.rate;
                totalTax = bracket.baseTax + taxOnBalance;
                taxBreakdown = {
                    baseTax: bracket.baseTax,
                    rate: bracket.rate,
                    taxOnBalance: taxOnBalance,
                };
                break;
            } else if (bracket.max === Infinity) {
                // Handle highest bracket
                const taxableAmount = chargeableIncome - (bracket.min - 1);
                const taxOnBalance = taxableAmount * bracket.rate;
                totalTax = bracket.baseTax + taxOnBalance;
                taxBreakdown = {
                    baseTax: bracket.baseTax,
                    rate: bracket.rate,
                    taxOnBalance: taxOnBalance,
                };
                break;
            }
        }
    }

    // 4. Rebates
    let totalRebates = 0;
    if (chargeableIncome <= REBATES.LOW_INCOME_THRESHOLD) {
        totalRebates += REBATES.LOW_INCOME_AMOUNT;
    }

    // Zakat is a rebate, capped at total tax payable
    // But wait, standard rebates (like low income) are deducted first?
    // Usually: Tax Payable = (Tax Calculated - Tax Rebates) - Zakat
    // If (Tax Calculated - Tax Rebates) < 0, it's 0. Then Zakat reduces it further (but can't go below 0).
    // Actually Zakat is a tax rebate under S6A(3). Total rebates cannot exceed tax charged.

    let taxAfterRebates = Math.max(0, totalTax - totalRebates);
    const zakatClaimable = Math.min(reliefs.zakat, taxAfterRebates);
    totalRebates += zakatClaimable;

    const finalTaxPayable = Math.max(0, totalTax - totalRebates);

    return {
        grossIncome: annualIncome,
        totalReliefs,
        chargeableIncome,
        totalTax,
        taxBreakdown,
        rebates: totalRebates,
        finalTaxPayable,
    };
}
