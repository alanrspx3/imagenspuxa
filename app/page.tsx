'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

type Operator = '+' | '-' | '×' | '÷' | null;

// Reusable button component
const ActionButton = ({ onClick, children, variant = 'default', className = '' }: any) => {
  const baseStyles = 'border-r border-b border-[#262626] flex items-center justify-center cursor-pointer transition-colors touch-manipulation focus:outline-none';
  
  const variants = {
    default: 'hover:bg-white hover:text-black text-2xl font-serif italic text-[#e5e5e5]',
    action: 'group hover:bg-white hover:text-black text-xs uppercase tracking-widest font-semibold text-[#e5e5e5]',
    operator: 'bg-[#1a1a1a] hover:bg-[#d4af37] hover:text-black text-2xl font-serif italic text-[#e5e5e5]',
    equal: 'bg-[#d4af37] text-black hover:bg-white text-2xl font-serif italic !border-none',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const performOperation = (op: Operator, a: number, b: number): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const handleNum = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOp = (op: Operator) => {
    const inputValue = parseFloat(display);

    if (previous === null) {
      setPrevious(display);
    } else if (operator && !waitingForNewValue) {
      const currentValue = previous || '0';
      const result = performOperation(operator, parseFloat(currentValue), inputValue);
      
      const resultStr = String(Number((result).toPrecision(10)));
      setDisplay(resultStr);
      setPrevious(resultStr);
    }
    
    setWaitingForNewValue(true);
    setOperator(op);
  };

  const calculate = () => {
    if (!operator || previous === null || waitingForNewValue) return;

    const result = performOperation(operator, parseFloat(previous), parseFloat(display));
    const resultStr = String(Number((result).toPrecision(10)));
    
    setDisplay(resultStr);
    setPrevious(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevious(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const handleDot = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <main className="h-screen w-full bg-[#0a0a0a] text-[#e5e5e5] flex flex-col font-sans overflow-hidden items-center justify-center">
      <div className="w-full max-w-[1024px] h-full max-h-[768px] flex flex-col bg-[#0a0a0a] border border-[#262626]">
        
        {/* Display screen */}
        <div className="h-1/3 flex flex-col justify-end items-end p-8 md:p-16">
          <div className="text-sm font-mono opacity-30 mb-2 tracking-tighter uppercase">
            {previous ? `${previous} ${operator}` : 'CURRENT EXPRESSION'}
          </div>
          <div className="text-7xl md:text-9xl font-serif italic text-white truncate w-full text-right">
            {Number.isNaN(parseFloat(display)) ? "Erro" : display}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="flex-1 grid grid-cols-4 border-t border-[#262626]">
          <ActionButton onClick={handleClear} variant="action">AC</ActionButton>
          <ActionButton onClick={handleToggleSign} variant="action">±</ActionButton>
          <ActionButton onClick={handlePercent} variant="action">%</ActionButton>
          <ActionButton onClick={() => handleOp('÷')} variant="operator">÷</ActionButton>

          <ActionButton onClick={() => handleNum('7')}>7</ActionButton>
          <ActionButton onClick={() => handleNum('8')}>8</ActionButton>
          <ActionButton onClick={() => handleNum('9')}>9</ActionButton>
          <ActionButton onClick={() => handleOp('×')} variant="operator">×</ActionButton>

          <ActionButton onClick={() => handleNum('4')}>4</ActionButton>
          <ActionButton onClick={() => handleNum('5')}>5</ActionButton>
          <ActionButton onClick={() => handleNum('6')}>6</ActionButton>
          <ActionButton onClick={() => handleOp('-')} variant="operator">−</ActionButton>

          <ActionButton onClick={() => handleNum('1')}>1</ActionButton>
          <ActionButton onClick={() => handleNum('2')}>2</ActionButton>
          <ActionButton onClick={() => handleNum('3')}>3</ActionButton>
          <ActionButton onClick={() => handleOp('+')} variant="operator">+</ActionButton>

          <ActionButton onClick={() => handleNum('0')} className="col-span-2">0</ActionButton>
          <ActionButton onClick={handleDot}>.</ActionButton>
          <ActionButton onClick={calculate} variant="equal">=</ActionButton>
        </div>
      </div>
    </main>
  );
}
