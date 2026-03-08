import React, { useState, useEffect } from 'react';
import { Calculator, Info, Calendar, DollarSign, User } from 'lucide-react';
import { format, differenceInMonths, differenceInYears, differenceInDays, addMonths, subMonths, isAfter } from 'date-fns';

const App = () => {
    const [birthDate, setBirthDate] = useState('1990-01-01');
    const [startDate, setStartDate] = useState('2023-01-01');
    const [endDate, setEndDate] = useState('2025-12-31');
    const [salary1, setSalary1] = useState(3000000);
    const [salary2, setSalary2] = useState(3000000);
    const [salary3, setSalary3] = useState(3000000);
    const [result, setResult] = useState(null);

    const calculate = () => {
        const end = new Date(endDate);
        const start = new Date(startDate);
        const birth = new Date(birthDate);

        // 1. Insurance Duration (In years/months)
        // For unemployment benefit, usually total insured period. Assuming continuous here.
        const durationDays = differenceInDays(end, start) + 1;
        const durationYears = durationDays / 365.25;

        // 2. Age at Dismissal
        const age = differenceInYears(end, birth);

        // 3. Daily Average Wage
        const totalSalary = Number(salary1) + Number(salary2) + Number(salary3);
        const avgMonthly = totalSalary / 3;
        const dailyAvg = totalSalary / 90; // Approx 90 days for 3 months

        // 4. Daily Benefit
        // 2026 Standards (Assumed based on minimum wage/search)
        const UPPER_LIMIT = 68100;
        const LOWER_LIMIT = 66048; // 2026 Min wage 10,320 * 8h * 0.8

        let dailyBenefit = dailyAvg * 0.6;
        if (dailyBenefit > UPPER_LIMIT) dailyBenefit = UPPER_LIMIT;
        if (dailyBenefit < LOWER_LIMIT) dailyBenefit = LOWER_LIMIT;

        // 5. Sojo-Ilsu (Duration)
        let sojoIlsu = 0;
        if (age >= 50) {
            if (durationYears < 1) sojoIlsu = 120;
            else if (durationYears < 3) sojoIlsu = 180;
            else if (durationYears < 5) sojoIlsu = 210;
            else if (durationYears < 10) sojoIlsu = 240;
            else sojoIlsu = 270;
        } else {
            if (durationYears < 1) sojoIlsu = 120;
            else if (durationYears < 3) sojoIlsu = 150;
            else if (durationYears < 5) sojoIlsu = 180;
            else if (durationYears < 10) sojoIlsu = 210;
            else sojoIlsu = 240;
        }

        setResult({
            dailyBenefit: Math.floor(dailyBenefit),
            sojoIlsu,
            totalBenefit: Math.floor(dailyBenefit * sojoIlsu),
            age,
            durationYears: durationYears.toFixed(1)
        });
    };

    return (
        <div className="app-container">
            <div className="card">
                <h1 className="title">실업급여 계산기 (2026)</h1>
                <p className="subtitle">법적 근거에 기반한 2026년형 실업급여 모의 계산</p>

                <div className="form-grid">
                    <div className="form-group">
                        <label><User size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 생년월일</label>
                        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 고용 형태</label>
                        <select disabled>
                            <option>일반 근로자</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>고용보험 가입일 (입사일)</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>퇴사일 (예정일)</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>

                    <div className="salary-inputs">
                        <div className="form-group">
                            <label>직전 1개월 월급</label>
                            <input type="number" value={salary1} onChange={(e) => setSalary1(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>직전 2개월 월급</label>
                            <input type="number" value={salary2} onChange={(e) => setSalary2(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>직전 3개월 월급</label>
                            <input type="number" value={salary3} onChange={(e) => setSalary3(e.target.value)} />
                        </div>
                    </div>

                    <button className="btn" onClick={calculate}>
                        <Calculator size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                        모의계산 실행하기
                    </button>
                </div>
            </div>

            {result && (
                <div className="card result-card">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>계산 결과 예상</h2>
                    <div className="result-grid">
                        <div className="result-item">
                            <span className="result-label">1일 구직급여액</span>
                            <span className="result-value">{result.dailyBenefit.toLocaleString()}원</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">예상 지급일수</span>
                            <span className="result-value">{result.sojoIlsu}일</span>
                        </div>
                        <div className="result-item">
                            <span className="result-label">나이 / 가입기간</span>
                            <span className="result-value">만 {result.age}세 / {result.durationYears}년</span>
                        </div>
                        <div className="result-item" style={{ gridColumn: '1 / -1', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                            <span className="result-label" style={{ color: 'var(--primary)', fontWeight: 600 }}>총 예상 수급액</span>
                            <span className="result-value total">{result.totalBenefit.toLocaleString()}원</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="card law-info">
                <h3><Info size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> 2026년 실업급여 법적 근거 및 계산 기준</h3>
                <ul>
                    <li><strong>법적 근거:</strong> 고용보험법 제40조(수급 요건) 및 제45조(구직급여의 기초임금일액)</li>
                    <li><strong>1일 상한액:</strong> <span className="badge">68,100원</span> (이직일이 2026.01.01 이후인 경우)</li>
                    <li><strong>1일 하한액:</strong> <span className="badge">66,048원</span> (2026년 최저임금 10,320원 × 8시간 × 80%)</li>
                    <li><strong>지급 대상:</strong> 이직 전 18개월간 피보험 단위기간이 합산하여 180일 이상이어야 하며, 비자발적 이직 사유여야 합니다.</li>
                    <li><strong>지급 기간:</strong> 퇴직 당시 연령(만 50세 기준)과 고용보험 가입 기간에 따라 120일~270일까지 차등 지급됩니다.</li>
                </ul>
                <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.75rem' }}>* 본 계산기는 모의 계산용이며, 정확한 수급 자격 및 금액은 고용복지플러스센터 상담을 통해 확인하시기 바랍니다.</p>
            </div>
        </div>
    );
};

export default App;
