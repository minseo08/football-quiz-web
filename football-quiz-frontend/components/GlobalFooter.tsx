'use client';

export function GlobalFooter() {
  return (
    <footer className="w-full bg-gray-900/90 backdrop-blur-sm border-t border-gray-800 py-6 px-8 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          
          <div className="text-gray-400">
            <p className="font-bold text-gray-300 mb-1">FOOT:AGE - Football Quiz</p>
            <p className="text-xs">© 2026 All rights reserved.</p>
          </div>

          <div className="text-gray-400 text-center">
            <p className="text-xs mb-1">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Icon Author</span>
            </p>
            <p className="text-xs">
              <a 
                href="https://www.flaticon.com/kr/free-icons/" 
                title="아이콘"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 underline-offset-4"
              >
                Futuer, Smashicons, kosonicon, Freepik - Flaticon
              </a>
            </p>
          </div>
          <div className="text-gray-400 text-right">
            <p className="text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Contact</p>
            <p className="text-xs">
              <a 
                href="mailto:your-email@example.com"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                superider00@gmail.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}