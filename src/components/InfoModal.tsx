import React from 'react';
import { Mail, Coffee, X, CheckCircle2, Smartphone } from 'lucide-react';

interface InfoModalProps {
  onClose: () => void;
  onOpenDonate?: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ onClose, onOpenDonate }) => {
  return (
    <div
      id="info-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto select-none touch-manipulation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="info-modal"
        className="w-full max-w-[360px] my-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-800 flex flex-col gap-3.5 max-h-[92dvh] overflow-y-auto border border-slate-200"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="方格紙量尺" className="w-7 h-7 rounded-lg shadow-sm" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              方格紙量尺
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Introduction */}
        <div className="text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            專為<strong className="text-slate-800 font-semibold">隨時測量物件</strong>設計。無需連網，支援全離線運作。
          </p>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>實體卡片校準：以身邊的信用卡/八達通/健保卡 1:1 高度吻合</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>精準實線十字游標：隨指拖曳，即時浮動顯示測量尺寸</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>4 種方格底色：白色、Tajima 捲尺黃、50% 中性灰、深黑</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>自動離線記憶：每台設備只需校準一次，隨開隨用</span>
            </div>
          </div>
        </div>

        {/* Add to Home Screen Tips */}
        <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
          <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">加到手機主畫面當作專屬 App：</p>
            <p className="text-blue-800 leading-normal">
              <strong>iPhone Safari</strong>：點擊下方「分享」按鈕 ➔ 選擇「加入主畫面」。
              <br />
              <strong>Android Chrome</strong>：點擊右上角三點選單 ➔ 選擇「安裝應用程式」或「加到主畫面」。
            </p>
          </div>
        </div>

        {/* Author & Action buttons */}
        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>作者：Kitty Ng</span>
            <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">v2.3 離線通用版</span>
          </div>

          {/* Email button */}
          <a
            href="mailto:kitty.waiying@gmail.com?subject=%E6%96%B9%E6%A0%BC%E7%B4%99%E9%87%8F%E5%B0%BA%20-%20%E5%95%8F%E9%A1%8C%E5%9B%9E%E5%A0%B1%E8%88%87%E8%81%AF%E7%B5%A1"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-slate-600" />
            <span>回報問題 / 聯絡作者</span>
          </a>

          {/* Support My Work button (Tajima yellow background with black text) */}
          <button
            onClick={() => {
              if (onOpenDonate) onOpenDonate();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#FFDD00] hover:bg-[#ffc800] active:scale-[0.98] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-xs border border-amber-400/60 transition-all cursor-pointer"
          >
            <span>💖 贊助支持作者 (Support My Work)</span>
          </button>
        </div>

        {/* Bottom dismiss */}
        <button
          onClick={onClose}
          className="mt-1 w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          關閉
        </button>
      </div>
    </div>
  );
};
