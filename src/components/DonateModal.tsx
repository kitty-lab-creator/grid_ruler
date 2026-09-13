import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface DonateModalProps {
  onClose: () => void;
  onBackToInfo?: () => void;
}

type DonateMethod = 'paypal' | 'payme' | 'alipayhk' | 'wechatpay';

interface MethodConfig {
  id: DonateMethod;
  name: string;
  title: string;
  desc: string;
  imgSrc: string;
  activeBorder: string;
  activeBg: string;
  activeText: string;
  renderIcon: () => React.ReactNode;
}

const PayPalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.006.404 5.43 0 5.932 0h7.678c3.272 0 5.767 1.34 6.326 4.707.382 2.302-.127 4.183-1.47 5.438-1.42 1.326-3.616 1.948-6.357 1.948h-1.92c-.524 0-.965.385-1.042.903l-1.07 6.78c-.04.256-.26.442-.519.442l-.482.019z"/>
    <path fill="#0079C1" d="M19.936 5.608c-.559 3.367-3.054 4.707-6.326 4.707H9.72c-.524 0-.965.385-1.042.903l-1.6 10.14c-.04.257.16.48.419.48h3.94c.433 0 .796-.316.86-.743l.8-5.07c.077-.488.498-.85.992-.85h1.228c3.31 0 5.908-1.345 6.663-5.263.316-1.637.108-3.003-.704-4.304z"/>
  </svg>
);

const PayMeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <rect width="24" height="24" rx="5" fill="#E60012"/>
    <path d="M13 5.5H8.2c-.4 0-.7.3-.7.7v11.6c0 .4.3.7.7.7h2.4c.4 0 .7-.3.7-.7v-3.6h1.7c3.1 0 5.2-1.9 5.2-4.3 0-2.5-2.1-4.4-5.2-4.4zm-.2 5.8h-2.2V8.2h2.2c1.3 0 2.2.8 2.2 1.5s-.9 1.6-2.2 1.6z" fill="#ffffff"/>
  </svg>
);

const AlipayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <rect width="24" height="24" rx="5" fill="#00A0E9"/>
    <path d="M18.8 14.5c-1.4-.6-3.2-1.4-4.8-2.1 1-1.3 1.7-2.9 2.1-4.7h-3.6V6.2h-1.8v1.5H7.2v1.5h6.6c-.3 1.2-.8 2.4-1.5 3.3-1.6-.7-3.2-1.2-4.6-1.2-2.3 0-3.8 1.4-3.8 3.3 0 1.9 1.6 3.3 4.1 3.3 2.5 0 4.7-1.3 6.3-3.2 1.8.8 3.8 1.7 5.5 2.3l1.1-1.4.1-.3-.9-.2zM7.9 16.3c-1.4 0-2.3-.7-2.3-1.8 0-1 .9-1.8 2.2-1.8 1 0 2.2.4 3.4.9-1 1.6-2.2 2.7-3.3 2.7z" fill="#ffffff"/>
  </svg>
);

const WeChatPayIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <rect width="24" height="24" rx="5" fill="#07C160"/>
    <path d="M9.8 4C5.5 4 2 6.9 2 10.5c0 2 1.1 3.8 2.8 5l-.7 2.2 2.6-1.3c.9.3 1.9.4 2.9.4.4 0 .7 0 1.1-.1-.3-.7-.4-1.4-.4-2.2 0-3.6 3.5-6.5 7.8-6.5.3 0 .7 0 1 .1C18.2 6.4 14.3 4 9.8 4zm-2.7 4.1c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1zm4.8 0c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1zm4.9 4.4c-3.6 0-6.5 2.4-6.5 5.4 0 1.7.9 3.2 2.3 4.2l-.6 1.8 2.2-1.1c.8.2 1.6.3 2.4.3 3.6 0 6.5-2.4 6.5-5.4s-2.9-5.2-6.3-5.2zm-2.3 3.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm4.6 0c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" fill="#ffffff"/>
  </svg>
);

const METHODS: MethodConfig[] = [
  {
    id: 'paypal',
    name: 'PayPal',
    title: 'PayPal 國際轉帳贊助',
    desc: '請使用手機相機或 PayPal App 掃描 QR Code',
    imgSrc: './assets/donate/paypal.jpg',
    activeBorder: '#0070ba',
    activeBg: '#eff6ff',
    activeText: '#0070ba',
    renderIcon: PayPalIcon,
  },
  {
    id: 'payme',
    name: 'PayMe',
    title: 'PayMe (HSBC) 轉帳贊助',
    desc: '請打開 PayMe App 點擊掃描此付款碼',
    imgSrc: './assets/donate/payme.jpg',
    activeBorder: '#e60012',
    activeBg: '#fff1f2',
    activeText: '#e60012',
    renderIcon: PayMeIcon,
  },
  {
    id: 'alipayhk',
    name: 'AlipayHK',
    title: 'AlipayHK (香港支付寶) 贊助',
    desc: '請使用 AlipayHK App 掃描此收款 QR Code',
    imgSrc: './assets/donate/alipayhk.jpg',
    activeBorder: '#00a0e9',
    activeBg: '#f0f9ff',
    activeText: '#0284c7',
    renderIcon: AlipayIcon,
  },
  {
    id: 'wechatpay',
    name: '微信支付',
    title: '微信支付 (WeChat Pay) 贊助',
    desc: '請打開微信 App「掃一掃」進行轉帳贊助',
    imgSrc: './assets/donate/wechatpay.jpg',
    activeBorder: '#07c160',
    activeBg: '#f0fdf4',
    activeText: '#059669',
    renderIcon: WeChatPayIcon,
  },
];

export const DonateModal: React.FC<DonateModalProps> = ({ onClose, onBackToInfo }) => {
  const [activeMethod, setActiveMethod] = useState<DonateMethod>('paypal');

  const current = METHODS.find((m) => m.id === activeMethod) || METHODS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 relative flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
          <span className="text-xl">💖</span>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">贊助支持作者</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Support the creator & continuous development</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          感謝您對「方格紙量尺」的喜愛！如果本工具為您帶來便利，歡迎透過以下方式自由贊助支持：
        </p>

        {/* 4 Tabs with Official Logos */}
        <div className="grid grid-cols-4 gap-1.5">
          {METHODS.map((method) => {
            const isActive = method.id === activeMethod;
            const Icon = method.renderIcon;
            return (
              <button
                key={method.id}
                onClick={() => setActiveMethod(method.id)}
                style={{
                  borderColor: isActive ? method.activeBorder : '#e2e8f0',
                  backgroundColor: isActive ? method.activeBg : '#ffffff',
                  color: isActive ? method.activeText : '#64748b',
                }}
                className={`py-2 px-1 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isActive ? 'shadow-xs font-bold ring-1 ring-offset-0' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <Icon />
                </div>
                <span className="text-[11px] leading-tight whitespace-nowrap">{method.name}</span>
              </button>
            );
          })}
        </div>

        {/* QR Code Container */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center">
          <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center w-[210px] h-[210px]">
            <img
              src={current.imgSrc}
              alt={`${current.name} QR Code`}
              className="w-[195px] h-[195px] object-contain rounded-md block"
            />
          </div>
          <div className="mt-2.5 text-xs font-bold text-slate-800">{current.title}</div>
          <div className="mt-0.5 text-[11px] text-slate-500 text-center">{current.desc}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          {onBackToInfo ? (
            <button
              onClick={onBackToInfo}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-sm flex items-center justify-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回說明</span>
            </button>
          ) : (
            <div />
          )}

          {/* Blue Primary Button in the exact format of credit card sync */}
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
          >
            完成關閉
          </button>
        </div>
      </div>
    </div>
  );
};
