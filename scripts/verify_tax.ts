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

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        process.exit(1);
    } else {
        console.log(`✅ PASS: ${message}`);
    }
}

console.log('Running Tax Calculation Tests...');

// Scenario 1
const result1 = calculateTax(40000, defaultReliefs);
assert(result1.chargeableIncome === 31000, 'Scenario 1: Chargeable Income should be 31000');
assert(result1.totalTax === 480, `Scenario 1: Total Tax should be 480, got ${result1.totalTax}`);
assert(result1.rebates === 400, 'Scenario 1: Rebates should be 400');
assert(result1.finalTaxPayable === 80, 'Scenario 1: Final Tax should be 80');

// Scenario 2
const reliefs2 = {
    ...defaultReliefs,
    spouse: true,
    childrenUnder18: 2,
    lifestyle: 3000,
    epf: 5000,
};
const result2 = calculateTax(150000, reliefs2);
// Reliefs: 9000 + 4000 + 4000 + 2500 + 4000 = 23500
// Chargeable: 126500
// Tax: 9400 + (26500 * 0.25) = 9400 + 6625 = 16025
assert(result2.totalReliefs === 23500, `Scenario 2: Total Reliefs should be 23500, got ${result2.totalReliefs}`);
assert(result2.chargeableIncome === 126500, 'Scenario 2: Chargeable Income should be 126500');
assert(result2.finalTaxPayable === 16025, `Scenario 2: Final Tax should be 16025, got ${result2.finalTaxPayable}`);

console.log('All tests passed!');
