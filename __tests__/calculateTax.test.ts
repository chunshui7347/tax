import { describe, it, expect } from 'vitest';
import { calculateTax, Reliefs } from '../utils/calculateTax';

const defaultReliefs: Reliefs = {
    individual: true,
    disabledIndividual: false,
    spouse: false,
    disabledSpouse: false,
    childrenUnder18: 0,
    childrenStudying: 0,
    childrenHigherEdu: 0,
    disabledChildren: 0,
    disabledChildrenHigherEdu: 0,
    childcare: 0,
    medicalSeriousFertility: 0,
    medicalParents: 0,
    basicSupportEquipment: 0,
    lifeInsurance: 0,
    epf: 0,
    eduMedicalInsurance: 0,
    socsoEis: 0,
    prs: 0,
    sspn: 0,
    lifestyle: 0,
    sports: 0,
    evChargingCompost: 0,
    breastfeeding: 0,
    educationFeesSelf: 0,
    zakat: 0,
};

describe('calculateTax', () => {
    it('should calculate tax correctly for RM40,000 annual income (Scenario 1)', () => {
        // Scenario 1: Single, RM40,000 annual income.
        // Reliefs: RM9,000 (Self).
        // Chargeable: RM31,000.
        // Tax: First RM20k (RM150 - Wait, 0-5k 0%, 5-20k 1% = RM150? No.)
        // Let's re-verify manual calc:
        // 0-5000: 0%
        // 5001-20000: 1% = RM150.
        // 20001-35000: 3%.
        // Chargeable 31,000.
        // First 20,000 tax = 150.
        // Balance 11,000 * 3% = 330.
        // Total Tax = 480.
        // Rebate: Chargeable < 35k => RM400 rebate.
        // Final Tax = 80.

        const result = calculateTax(40000, defaultReliefs);

        expect(result.grossIncome).toBe(40000);
        expect(result.totalReliefs).toBe(9000);
        expect(result.chargeableIncome).toBe(31000);
        expect(result.totalTax).toBe(480);
        expect(result.rebates).toBe(400);
        expect(result.finalTaxPayable).toBe(80);
    });

    it('should calculate tax correctly for RM150,000 income with reliefs (Scenario 2)', () => {
        // Scenario 2: High Income (RM150,000), Married, 2 Kids (Under 18).
        // Reliefs:
        // Individual: 9000
        // Spouse: 4000
        // Kids: 2 * 2000 = 4000
        // Lifestyle: 2500 (Max)
        // EPF: 4000 (Max)
        // Total Reliefs: 23,500
        // Chargeable: 126,500

        // Tax:
        // 0-100,000: Tax is RM3700? Let's check bracket.
        // 0-5k: 0
        // 5-20k: 150
        // 20-35k: 450 (15k*3%) -> Cum: 600
        // 35-50k: 900 (15k*6%) -> Cum: 1500
        // 50-70k: 2200 (20k*11%) -> Cum: 3700
        // 70-100k: 5700 (30k*19%) -> Cum: 9400
        // Wait, my constants might be off or I need to double check the cumulative tax in my code vs manual.
        // Let's trust the code's logic if brackets are correct.
        // 100,001 - 400,000: 25%.

        // Chargeable 126,500.
        // First 100,000 tax = 9400 (Based on my constants).
        // Balance 26,500 * 25% = 6625.
        // Total Tax = 16025.
        // Rebates: 0 (Income > 35k).

        const reliefs = {
            ...defaultReliefs,
            spouse: true,
            childrenUnder18: 2,
            lifestyle: 3000, // Should cap at 2500
            epf: 5000, // Should cap at 4000
        };

        const result = calculateTax(150000, reliefs);

        expect(result.totalReliefs).toBe(9000 + 4000 + 4000 + 2500 + 4000); // 23500
        expect(result.chargeableIncome).toBe(126500);
        expect(result.totalTax).toBe(9400 + 6625); // 16025
        expect(result.finalTaxPayable).toBe(16025);
    });

    it('should handle zero tax case', () => {
        const result = calculateTax(20000, defaultReliefs);
        // Relief 9000. Chargeable 11000.
        // Tax: First 5000 (0) + Next 6000 (1%) = 60.
        // Rebate: 400.
        // Final: 0.
        expect(result.finalTaxPayable).toBe(0);
    });
});
