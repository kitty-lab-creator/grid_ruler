import React from 'react';
import { X, ArrowLeft, ExternalLink } from 'lucide-react';

interface DonateModalProps {
  onClose: () => void;
  onBackToInfo?: () => void;
}

const PAYPAL_DONATE_URL = "https://www.paypal.com/qrcodes/managed/16d4009f-428d-4b45-bcf6-bb7af15d9449?utm_source=consweb_more";

export const DonateModal: React.FC<DonateModalProps> = ({ onClose, onBackToInfo }) => {
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
          感謝您對「方格紙量尺」的喜愛！如果本工具為您帶來便利，歡迎透過 PayPal 自由贊助支持作者持續維護與優化：
        </p>

        {/* PayPal QR Code Display Container */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center">
          <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center w-[210px] h-[210px]">
            <img
              src="./assets/donate/paypal.jpg"
              alt="PayPal 贊助 QR Code"
              className="w-[195px] h-[195px] object-contain rounded-md block"
            />
          </div>
          <div className="mt-2.5 text-xs font-bold text-slate-800">PayPal 國際轉帳贊助</div>
          <div className="mt-0.5 text-[11px] text-slate-500 text-center">
            請使用手機相機或 PayPal App 掃描 QR Code
          </div>

          {/* Direct Link Button for mobile or direct click */}
          <a
            href={PAYPAL_DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0070ba] text-xs font-semibold rounded-lg border border-blue-200 transition-colors"
          >
            <span>直接開啟 PayPal 付款連結</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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
