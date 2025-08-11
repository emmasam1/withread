'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LaptopOutlined, BulbOutlined, MoonOutlined } from '@ant-design/icons';
import { useApp } from '@/app/context/context';

const options = [
  { label: 'System', icon: <LaptopOutlined />, value: 'System' },
  { label: 'Light', icon: <BulbOutlined />, value: 'Light' },
  { label: 'Dark', icon: <MoonOutlined />, value: 'Dark' },
];

const DisplayThemeSelector = () => {
    const { theme, updateTheme, } = useApp();

  return (
    <div className="theme-selector">
      {options.map((opt) => {
        const isSelected = theme === opt.value;
        return (
          <button
            key={opt.value}
            className={`theme-button ${isSelected ? 'selected' : ''}`}
            onClick={() => updateTheme(opt.value)}
          >
            {opt.icon}
            <span>{opt.label}</span>
            {isSelected && (
              <motion.div
                layoutId="themeSelector"
                className="theme-highlight"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DisplayThemeSelector;
