'use client';

import React, { useState, useEffect } from 'react';
import { calculateTax, Reliefs, TaxResult } from '../utils/calculateTax';
import { RELIEF_LIMITS_2025 } from '../utils/taxRules';
import {
    Calculator,
    ChevronDown,
    ChevronUp,
    User,
    Users,
    Heart,
    BookOpen,
    Wallet,
    Baby,
    Info,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const TaxCalculator = () => {
    const [annualIncome, setAnnualIncome] = useState<number>(0);
    const [reliefs, setReliefs] = useState<Reliefs>({
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
    });

    const [result, setResult] = useState<TaxResult | null>(null);
    const [activeSection, setActiveSection] = useState<string | null>('income');

    useEffect(() => {
        const res = calculateTax(annualIncome, reliefs);
        setResult(res);
    }, [annualIncome, reliefs]);

    const handleReliefChange = (key: keyof Reliefs, value: number | boolean) => {
        setReliefs((prev) => ({ ...prev, [key]: value }));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(amount);
    };

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <header className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
                    <Calculator className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Malaysia Tax Calculator 2025</h1>
                <p className="text-slate-500 text-lg">Estimate your income tax for the upcoming assessment year</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Income Section */}
                    <Card
                        title="Income Information"
                        icon={<Wallet className="w-5 h-5 text-emerald-500" />}
                        isOpen={activeSection === 'income'}
                        onToggle={() => toggleSection('income')}
                    >
                        <div className="p-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Annual Gross Income</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">RM</span>
                                <input
                                    type="number"
                                    value={annualIncome || ''}
                                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <p className="mt-3 text-sm text-slate-500 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Include all employment income, bonuses, and allowances.
                            </p>
                        </div>
                    </Card>

                    {/* Reliefs Sections */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">Tax Reliefs</h3>

                        {/* Individual & Family */}
                        <Card
                            title="Individual & Family"
                            icon={<User className="w-5 h-5 text-blue-500" />}
                            isOpen={activeSection === 'family'}
                            onToggle={() => toggleSection('family')}
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <span className="font-medium text-slate-700">Individual Relief (Automatic)</span>
                                    <span className="font-bold text-blue-700">{formatCurrency(RELIEF_LIMITS_2025.INDIVIDUAL)}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Checkbox
                                        label="Disabled Individual"
                                        checked={reliefs.disabledIndividual}
                                        onChange={(v) => handleReliefChange('disabledIndividual', v)}
                                        max={RELIEF_LIMITS_2025.DISABLED_INDIVIDUAL}
                                    />
                                    <Checkbox
                                        label="Spouse (No Income)"
                                        checked={reliefs.spouse}
                                        onChange={(v) => handleReliefChange('spouse', v)}
                                        max={RELIEF_LIMITS_2025.SPOUSE}
                                    />
                                    {reliefs.spouse && (
                                        <Checkbox
                                            label="Disabled Spouse"
                                            checked={reliefs.disabledSpouse}
                                            onChange={(v) => handleReliefChange('disabledSpouse', v)}
                                            max={RELIEF_LIMITS_2025.DISABLED_SPOUSE}
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Children */}
                        <Card
                            title="Children"
                            icon={<Baby className="w-5 h-5 text-pink-500" />}
                            isOpen={activeSection === 'children'}
                            onToggle={() => toggleSection('children')}
                        >
                            <div className="p-6 space-y-6">
                                <CounterInput
                                    label="Under 18 Years"
                                    value={reliefs.childrenUnder18}
                                    onChange={(v) => handleReliefChange('childrenUnder18', v)}
                                    perChild={RELIEF_LIMITS_2025.CHILD_UNDER_18}
                                />
                                <CounterInput
                                    label="Studying (18+)"
                                    value={reliefs.childrenStudying}
                                    onChange={(v) => handleReliefChange('childrenStudying', v)}
                                    perChild={RELIEF_LIMITS_2025.CHILD_STUDYING}
                                />
                                <CounterInput
                                    label="Higher Education (Diploma+)"
                                    value={reliefs.childrenHigherEdu}
                                    onChange={(v) => handleReliefChange('childrenHigherEdu', v)}
                                    perChild={RELIEF_LIMITS_2025.CHILD_HIGHER_EDU}
                                />
                                <div className="pt-4 border-t border-slate-100">
                                    <InputWithLimit
                                        label="Childcare Fees"
                                        value={reliefs.childcare}
                                        limit={RELIEF_LIMITS_2025.CHILDCARE}
                                        onChange={(v) => handleReliefChange('childcare', v)}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Lifestyle */}
                        <Card
                            title="Lifestyle & Sports"
                            icon={<BookOpen className="w-5 h-5 text-purple-500" />}
                            isOpen={activeSection === 'lifestyle'}
                            onToggle={() => toggleSection('lifestyle')}
                        >
                            <div className="p-6 space-y-5">
                                <InputWithLimit
                                    label="Lifestyle (Books, PC, Internet)"
                                    value={reliefs.lifestyle}
                                    limit={RELIEF_LIMITS_2025.LIFESTYLE}
                                    onChange={(v) => handleReliefChange('lifestyle', v)}
                                />
                                <InputWithLimit
                                    label="Sports Equipment / Gym"
                                    value={reliefs.sports}
                                    limit={RELIEF_LIMITS_2025.SPORTS}
                                    onChange={(v) => handleReliefChange('sports', v)}
                                />
                                <InputWithLimit
                                    label="EV Charging / Composting"
                                    value={reliefs.evChargingCompost}
                                    limit={RELIEF_LIMITS_2025.EV_CHARGING_COMPOST}
                                    onChange={(v) => handleReliefChange('evChargingCompost', v)}
                                />
                            </div>
                        </Card>

                        {/* Medical */}
                        <Card
                            title="Medical & Health"
                            icon={<Heart className="w-5 h-5 text-red-500" />}
                            isOpen={activeSection === 'medical'}
                            onToggle={() => toggleSection('medical')}
                        >
                            <div className="p-6 space-y-5">
                                <InputWithLimit
                                    label="Serious Diseases / Fertility"
                                    value={reliefs.medicalSeriousFertility}
                                    limit={RELIEF_LIMITS_2025.MEDICAL_SERIOUS_FERTILITY}
                                    onChange={(v) => handleReliefChange('medicalSeriousFertility', v)}
                                />
                                <InputWithLimit
                                    label="Medical for Parents"
                                    value={reliefs.medicalParents}
                                    limit={RELIEF_LIMITS_2025.MEDICAL_PARENTS}
                                    onChange={(v) => handleReliefChange('medicalParents', v)}
                                />
                                <InputWithLimit
                                    label="Edu & Medical Insurance"
                                    value={reliefs.eduMedicalInsurance}
                                    limit={RELIEF_LIMITS_2025.EDU_MEDICAL_INSURANCE}
                                    onChange={(v) => handleReliefChange('eduMedicalInsurance', v)}
                                />
                            </div>
                        </Card>

                        {/* Savings */}
                        <Card
                            title="Savings & Contributions"
                            icon={<Users className="w-5 h-5 text-orange-500" />}
                            isOpen={activeSection === 'savings'}
                            onToggle={() => toggleSection('savings')}
                        >
                            <div className="p-6 space-y-5">
                                <InputWithLimit
                                    label="EPF / KWSP"
                                    value={reliefs.epf}
                                    limit={RELIEF_LIMITS_2025.EPF}
                                    onChange={(v) => handleReliefChange('epf', v)}
                                />
                                <InputWithLimit
                                    label="Life Insurance"
                                    value={reliefs.lifeInsurance}
                                    limit={RELIEF_LIMITS_2025.LIFE_INSURANCE}
                                    onChange={(v) => handleReliefChange('lifeInsurance', v)}
                                />
                                <InputWithLimit
                                    label="SSPN (Education Savings)"
                                    value={reliefs.sspn}
                                    limit={RELIEF_LIMITS_2025.SSPN}
                                    onChange={(v) => handleReliefChange('sspn', v)}
                                />
                                <InputWithLimit
                                    label="PRS (Private Retirement)"
                                    value={reliefs.prs}
                                    limit={RELIEF_LIMITS_2025.PRS}
                                    onChange={(v) => handleReliefChange('prs', v)}
                                />
                                <InputWithLimit
                                    label="SOCSO / EIS"
                                    value={reliefs.socsoEis}
                                    limit={RELIEF_LIMITS_2025.SOCSO_EIS}
                                    onChange={(v) => handleReliefChange('socsoEis', v)}
                                />
                            </div>
                        </Card>

                        {/* Rebates */}
                        <Card
                            title="Rebates (Zakat)"
                            icon={<CheckCircle2 className="w-5 h-5 text-teal-500" />}
                            isOpen={activeSection === 'rebates'}
                            onToggle={() => toggleSection('rebates')}
                        >
                            <div className="p-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-slate-700 mb-2">Zakat / Fitrah Paid</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">RM</span>
                                        <input
                                            type="number"
                                            value={reliefs.zakat || ''}
                                            onChange={(e) => handleReliefChange('zakat', Number(e.target.value))}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">Directly deducted from tax payable.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-5">
                    <div className="sticky top-8 space-y-6">
                        {/* Main Result Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <h2 className="text-indigo-100 font-medium mb-2">Estimated Tax Payable</h2>
                            <div className="text-5xl font-bold mb-8 tracking-tight">
                                {result ? formatCurrency(result.finalTaxPayable) : 'RM 0'}
                            </div>

                            <div className="space-y-4">
                                <ResultRow label="Chargeable Income" value={result ? formatCurrency(result.chargeableIncome) : 'RM 0'} />
                                <ResultRow label="Total Reliefs" value={result ? formatCurrency(result.totalReliefs) : 'RM 0'} />
                                <ResultRow label="Total Rebates" value={result ? `-${formatCurrency(result.rebates)}` : 'RM 0'} isNegative />
                            </div>
                        </div>

                        {/* Breakdown Card */}
                        {result && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-indigo-500" />
                                    Calculation Breakdown
                                </h3>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span>Gross Income</span>
                                        <span className="font-medium text-slate-900">{formatCurrency(result.grossIncome)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-red-500">
                                        <span>Less: Reliefs</span>
                                        <span className="font-medium">-{formatCurrency(result.totalReliefs)}</span>
                                    </div>

                                    <div className="h-px bg-slate-100 my-2"></div>

                                    <div className="flex justify-between items-center font-semibold text-slate-800">
                                        <span>Chargeable Income</span>
                                        <span>{formatCurrency(result.chargeableIncome)}</span>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 mt-4 space-y-3">
                                        <div className="flex justify-between text-slate-600">
                                            <span>Base Tax</span>
                                            <span>{formatCurrency(result.taxBreakdown.baseTax)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600">
                                            <span>Tax on Balance ({(result.taxBreakdown.rate * 100).toFixed(0)}%)</span>
                                            <span>{formatCurrency(result.taxBreakdown.taxOnBalance)}</span>
                                        </div>
                                        {result.rebates > 0 && (
                                            <div className="flex justify-between text-emerald-600 font-medium">
                                                <span>Less: Rebates</span>
                                                <span>-{formatCurrency(result.rebates)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-slate-200 pt-3 mt-1">
                                            <div className="flex justify-between font-bold text-slate-900 text-lg">
                                                <span>Final Tax</span>
                                                <span>{formatCurrency(result.finalTaxPayable)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components

const Card = ({ title, icon, children, isOpen, onToggle }: { title: string, icon: React.ReactNode, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className={clsx("bg-white rounded-2xl border transition-all duration-200 overflow-hidden", isOpen ? "border-indigo-100 shadow-lg shadow-indigo-500/5" : "border-slate-100 shadow-sm hover:border-indigo-100")}>
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className={clsx("p-2 rounded-lg transition-colors", isOpen ? "bg-indigo-50" : "bg-slate-50")}>
                    {icon}
                </div>
                <span className={clsx("font-semibold transition-colors", isOpen ? "text-indigo-900" : "text-slate-700")}>{title}</span>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="border-t border-slate-100">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const ResultRow = ({ label, value, isNegative }: { label: string, value: string, isNegative?: boolean }) => (
    <div className="flex justify-between items-center text-indigo-100/80">
        <span className="text-sm">{label}</span>
        <span className={clsx("font-medium text-white", isNegative && "text-emerald-300")}>{value}</span>
    </div>
);

const InputWithLimit = ({ label, value, limit, onChange }: { label: string, value: number, limit: number, onChange: (v: number) => void }) => (
    <div className="flex flex-col group">
        <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{label}</label>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Max {new Intl.NumberFormat('en-MY').format(limit)}</span>
        </div>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">RM</span>
            <input
                type="number"
                value={value || ''}
                onChange={(e) => onChange(Number(e.target.value))}
                className={clsx(
                    "w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none",
                    value > limit ? "border-amber-300 bg-amber-50/30" : "border-slate-200"
                )}
                placeholder="0"
            />
        </div>
        {value > limit && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-600 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>Capped at {limit} for calculation</span>
            </div>
        )}
    </div>
);

const CounterInput = ({ label, value, onChange, perChild }: { label: string, value: number, onChange: (v: number) => void, perChild: number }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
        <div>
            <label className="text-sm font-medium text-slate-700 block">{label}</label>
            <span className="text-xs text-slate-400">{new Intl.NumberFormat('en-MY').format(perChild)} / child</span>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
            <button
                onClick={() => onChange(Math.max(0, value - 1))}
                className="w-8 h-8 rounded-md hover:bg-white hover:shadow-sm flex items-center justify-center text-slate-500 transition-all disabled:opacity-50"
                disabled={value <= 0}
            >
                -
            </button>
            <span className="w-6 text-center font-semibold text-slate-700">{value}</span>
            <button
                onClick={() => onChange(value + 1)}
                className="w-8 h-8 rounded-md hover:bg-white hover:shadow-sm flex items-center justify-center text-indigo-600 transition-all"
            >
                +
            </button>
        </div>
    </div>
);

const Checkbox = ({ label, checked, onChange, max }: { label: string, checked: boolean, onChange: (v: boolean) => void, max: number }) => (
    <label className={clsx(
        "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
        checked ? "bg-indigo-50 border-indigo-200 shadow-sm" : "bg-white border-slate-200 hover:border-indigo-200"
    )}>
        <div className="flex items-center gap-3">
            <div className={clsx(
                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                checked ? "bg-indigo-500 border-indigo-500" : "bg-white border-slate-300"
            )}>
                {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className={clsx("text-sm font-medium", checked ? "text-indigo-900" : "text-slate-700")}>{label}</span>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-white/50 px-2 py-1 rounded-md">Max {new Intl.NumberFormat('en-MY', { notation: 'compact' }).format(max)}</span>
        <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
);

export default TaxCalculator;
