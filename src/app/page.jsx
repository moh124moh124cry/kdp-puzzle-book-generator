"use client";

import { useState, useEffect } from "react";
import { generateWordSearch } from "../lib/algorithms/wordSearch";
import { generateSudoku } from "../lib/algorithms/sudoku";
import { generateMaze } from "../lib/algorithms/maze";
import { generateMandalaElements } from "../lib/algorithms/mandala";
import { exportSinglePuzzlePDF, exportFullBookPDF } from "../lib/pdfExporter";
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  Eye, 
  EyeOff, 
  Layers, 
  RefreshCw, 
  FileText, 
  Settings, 
  Grid, 
  Compass, 
  Palette 
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("wordsearch");
  const [title, setTitle] = useState("My Awesome Puzzle Book");
  const [showSolution, setShowSolution] = useState(false);
  const [bookPagesCount, setBookPagesCount] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  // Word Search State
  const [wsWords, setWsWords] = useState("EAGLE, FALCON, HAWK, OWL, PARROT, PENGUIN, ROBIN, SPARROW, TOUCAN, SWAN");
  const [wsSize, setWsSize] = useState(12);
  const [wsData, setWsData] = useState(null);

  // Sudoku State
  const [sudokuDifficulty, setSudokuDifficulty] = useState("medium");
  const [sudokuData, setSudokuData] = useState(null);

  // Maze State
  const [mazeSize, setMazeSize] = useState(15);
  const [mazeData, setMazeData] = useState(null);

  // Mandala State
  const [mandalaFolds, setMandalaFolds] = useState(8);
  const [mandalaComplexity, setMandalaComplexity] = useState(4);
  const [mandalaSeed, setMandalaSeed] = useState(1);
  const [mandalaData, setMandalaData] = useState(null);

  // Generate Current Puzzle
  const handleGenerate = () => {
    if (activeTab === "wordsearch") {
      const wordsArr = wsWords.split(/[,\n]+/).map(w => w.trim()).filter(Boolean);
      setWsData(generateWordSearch(wordsArr, wsSize, true));
    } else if (activeTab === "sudoku") {
      setSudokuData(generateSudoku(sudokuDifficulty));
    } else if (activeTab === "maze") {
      setMazeData(generateMaze(mazeSize, mazeSize));
    } else if (activeTab === "mandala") {
      setMandalaData(generateMandalaElements(mandalaFolds, mandalaComplexity, mandalaSeed));
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [activeTab]);

  // Export Single Page
  const handleExportSingle = () => {
    let currentData = null;
    if (activeTab === "wordsearch") currentData = wsData;
    if (activeTab === "sudoku") currentData = sudokuData;
    if (activeTab === "maze") currentData = mazeData;
    if (activeTab === "mandala") currentData = mandalaData;

    if (!currentData) return;
    exportSinglePuzzlePDF({
      title: title || "Puzzle Page",
      type: activeTab,
      data: currentData,
      showSolution,
      pageNumber: 1,
    });
  };

  // Export Complete Multi-Page Book
  const handleExportBook = () => {
    setIsExporting(true);
    setTimeout(() => {
      const puzzles = [];
      const solutions = [];

      for (let i = 0; i < bookPagesCount; i++) {
        let pData = null;
        let pType = activeTab;

        if (activeTab === "wordsearch") {
          const sampleLists = [
            ["LION", "TIGER", "BEAR", "ZEBRA", "GIRAFFE", "ELEPHANT", "MONKEY", "WOLF"],
            ["APPLE", "BANANA", "ORANGE", "MANGO", "PEACH", "GRAPES", "BERRY", "LEMON"],
            ["MARS", "VENUS", "JUPITER", "SATURN", "URANUS", "NEPTUNE", "EARTH", "PLUTO"],
            ["PARIS", "TOKYO", "LONDON", "CAIRO", "ROME", "BERLIN", "MADRID", "OTTAWA"],
          ];
          const chosenWords = sampleLists[i % sampleLists.length];
          pData = generateWordSearch(chosenWords, wsSize, true);
        } else if (activeTab === "sudoku") {
          pData = generateSudoku(sudokuDifficulty);
        } else if (activeTab === "maze") {
          pData = generateMaze(mazeSize, mazeSize);
        } else if (activeTab === "mandala") {
          pData = generateMandalaElements(mandalaFolds, mandalaComplexity, i + 1);
        }

        puzzles.push({ title: `${title} - Page ${i + 1}`, type: pType, data: pData });
        if (pType !== "mandala") {
          solutions.push({ type: pType, data: pData });
        }
      }

      exportFullBookPDF({
        title: title || "Amazon KDP Activity Book",
        puzzles,
        solutions,
      });
      setIsExporting(false);
    }, 100);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              KDP Puzzle & Coloring Book Creator
            </h1>
            <p className="text-xs text-slate-400">مولد كتب الألغاز والتلوين الجاهزة للطباعة على أمازون</p>
          </div>
        </div>

        {/* Global Book Title */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full md:w-72 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            placeholder="عنوان الكتاب / الصفحة..."
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab("wordsearch")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition ${
                activeTab === "wordsearch" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
              Word Search
            </button>
            <button
              onClick={() => setActiveTab("sudoku")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition ${
                activeTab === "sudoku" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              Sudoku
            </button>
            <button
              onClick={() => setActiveTab("maze")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition ${
                activeTab === "maze" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4" />
              Maze (متاهة)
            </button>
            <button
              onClick={() => setActiveTab("mandala")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition ${
                activeTab === "mandala" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Palette className="w-4 h-4" />
              Coloring Mandala
            </button>
          </div>

          {/* Config Box */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              إعدادات النوع المحدد
            </h2>

            {/* Word Search Config */}
            {activeTab === "wordsearch" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">الكلمات (مفصولة بفاصلة):</label>
                  <textarea
                    rows={4}
                    value={wsWords}
                    onChange={(e) => setWsWords(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">حجم الشبكة ({wsSize}x{wsSize}):</label>
                  <input
                    type="range"
                    min="10"
                    max="18"
                    value={wsSize}
                    onChange={(e) => setWsSize(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Sudoku Config */}
            {activeTab === "sudoku" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">مستوى الصعوبة:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["easy", "medium", "hard"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSudokuDifficulty(lvl)}
                        className={`py-2 text-xs font-medium rounded-lg border capitalize ${
                          sudokuDifficulty === lvl
                            ? "bg-indigo-600/30 border-indigo-500 text-indigo-300"
                            : "border-slate-700 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        {lvl === "easy" ? "سهل" : lvl === "medium" ? "متوسط" : "صعب"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Maze Config */}
            {activeTab === "maze" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">تعقيد المتاهة ({mazeSize}x{mazeSize}):</label>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    value={mazeSize}
                    onChange={(e) => setMazeSize(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Mandala Config */}
            {activeTab === "mandala" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">عدد التناظرات (Folds: {mandalaFolds}):</label>
                  <input
                    type="range"
                    min="4"
                    max="16"
                    step="2"
                    value={mandalaFolds}
                    onChange={(e) => setMandalaFolds(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">مستوى التفاصيل والتعقيد ({mandalaComplexity}):</label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={mandalaComplexity}
                    onChange={(e) => setMandalaComplexity(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setMandalaSeed(prev => prev + 1)}
                  className="w-full py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-medium text-slate-300 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  شكل عشوائي جديد
                </button>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              توليد محتوى جديد الآن
            </button>
          </div>

          {/* Export Book Options */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              تصدير كتاب كامل لـ KDP
            </h2>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">عدد الصفحات الإجمالي للكتاب:</label>
              <select
                value={bookPagesCount}
                onChange={(e) => setBookPagesCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value={5}>5 صفحات تجريبية + الحلول</option>
                <option value={10}>10 صفحات + الحلول</option>
                <option value={25}>25 صفحة + الحلول</option>
                <option value={50}>50 صفحة + الحلول</option>
                <option value={100}>100 صفحة + الحلول</option>
              </select>
            </div>
            <button
              onClick={handleExportBook}
              disabled={isExporting}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "جاري تجهيز الكتاب..." : "تحميل الكتاب الكامل (PDF Book)"}
            </button>
          </div>
        </div>

        {/* Live Canvas / Preview Section */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">معاينة واقعية بمقاس الطباعة KDP (8.5 × 11 بوصة):</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                {showSolution ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                {showSolution ? "إخفاء الحل" : "إظهار الحل"}
              </button>
              <button
                onClick={handleExportSingle}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 shadow"
              >
                <FileText className="w-3.5 h-3.5" />
                تصدير هذه الصفحة (PDF)
              </button>
            </div>
          </div>

          {/* Printable Page Simulation */}
          <div className="bg-slate-950 p-4 md:p-8 rounded-2xl border border-slate-800 flex justify-center">
            <div 
              className="w-full max-w-[540px] aspect-[8.5/11] bg-white text-black p-8 rounded-sm shadow-2xl flex flex-col justify-between select-none relative"
              style={{ minHeight: '620px' }}
            >
              {/* Header */}
              <div className="text-center pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold tracking-wider uppercase">{title}</h3>
                <span className="text-xs font-medium text-gray-500 capitalize">{activeTab} Activity</span>
              </div>

              {/* Dynamic Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center my-4 overflow-hidden">
                {/* Word Search Render */}
                {activeTab === "wordsearch" && wsData && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div 
                      className="grid gap-1 p-2 border-2 border-black rounded"
                      style={{ gridTemplateColumns: `repeat(${wsSize}, minmax(0, 1fr))` }}
                    >
                      {wsData.grid.map((row, rIdx) =>
                        row.map((cell, cIdx) => {
                          const isSol = showSolution && wsData.solutionGrid[rIdx][cIdx] !== '';
                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-xs md:text-sm font-bold rounded ${
                                isSol ? "bg-indigo-100 text-indigo-700 font-extrabold" : "text-gray-900"
                              }`}
                            >
                              {cell}
                            </div>
                          );
                        })
                      )}
                    </div>
                    {/* Words list */}
                    <div className="w-full pt-2">
                      <p className="text-xs font-bold text-center mb-1 text-gray-700">WORD LIST:</p>
                      <div className="flex flex-wrap justify-center gap-2 text-[10px] md:text-xs text-gray-700">
                        {wsData.placedWords.map((pw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 rounded border border-gray-300 font-semibold">
                            {pw.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sudoku Render */}
                {activeTab === "sudoku" && sudokuData && (
                  <div className="grid grid-cols-9 border-2 border-black">
                    {(showSolution ? sudokuData.solution : sudokuData.puzzle).map((row, rIdx) =>
                      row.map((cell, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-sm md:text-base font-bold border border-gray-300 ${
                            (cIdx + 1) % 3 === 0 && cIdx !== 8 ? "border-r-2 border-r-black" : ""
                          } ${
                            (rIdx + 1) % 3 === 0 && rIdx !== 8 ? "border-b-2 border-b-black" : ""
                          } ${
                            showSolution && sudokuData.puzzle[rIdx][cIdx] === 0 ? "text-indigo-600" : "text-black"
                          }`}
                        >
                          {cell !== 0 ? cell : ""}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Maze Render */}
                {activeTab === "maze" && mazeData && (
                  <div className="flex flex-col items-center">
                    <div 
                      className="grid border-2 border-black"
                      style={{ gridTemplateColumns: `repeat(${mazeData.width}, minmax(0, 1fr))` }}
                    >
                      {mazeData.grid.map((row, rIdx) =>
                        row.map((cell, cIdx) => {
                          const isPath = showSolution && mazeData.solutionPath.some(p => p.r === rIdx && p.c === cIdx);
                          return (
                            <div
                              key={`${rIdx}-${cIdx}`}
                              className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center relative"
                              style={{
                                borderTop: cell.walls[0] ? "2px solid black" : "none",
                                borderRight: cell.walls[1] ? "2px solid black" : "none",
                                borderBottom: cell.walls[2] ? "2px solid black" : "none",
                                borderLeft: cell.walls[3] ? "2px solid black" : "none",
                              }}
                            >
                              {isPath && <div className="w-2 h-2 rounded-full bg-rose-500"></div>}
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="flex justify-between w-full text-[10px] font-bold text-gray-500 mt-2 px-4">
                      <span>➔ START</span>
                      <span>GOAL ➔</span>
                    </div>
                  </div>
                )}

                {/* Mandala Render */}
                {activeTab === "mandala" && mandalaData && (
                  <svg viewBox="0 0 400 400" className="w-72 h-72 md:w-80 md:h-80 stroke-black fill-none stroke-[1.5]">
                    {mandalaData.map((elem, idx) => {
                      if (elem.type === "ring") {
                        return <circle key={idx} cx="200" cy="200" r={elem.radius} />;
                      } else if (elem.type === "petals") {
                        const angleStep = (Math.PI * 2) / elem.folds;
                        return Array.from({ length: elem.folds }).map((_, i) => {
                          const angle = i * angleStep;
                          const px = 200 + Math.cos(angle) * elem.radius;
                          const py = 200 + Math.sin(angle) * elem.radius;
                          return <circle key={`${idx}-${i}`} cx={px} cy={py} r={elem.petalRadius} />;
                        });
                      } else if (elem.type === "star") {
                        const step = Math.PI / elem.folds;
                        const points = Array.from({ length: elem.folds * 2 }).map((_, i) => {
                          const r = i % 2 === 0 ? elem.outerRadius : elem.innerRadius;
                          const a = i * step;
                          return `${200 + Math.cos(a) * r},${200 + Math.sin(a) * r}`;
                        }).join(" ");
                        return <polygon key={idx} points={points} />;
                      } else if (elem.type === "scallops") {
                        const count = elem.folds * 2;
                        const angleStep = (Math.PI * 2) / count;
                        return Array.from({ length: count }).map((_, i) => {
                          const a = i * angleStep;
                          const r = elem.baseRadius + (i % 2 === 0 ? elem.amplitude : -elem.amplitude);
                          return <circle key={`${idx}-${i}`} cx={200 + Math.cos(a) * r} cy={200 + Math.sin(a) * r} r="6" />;
                        });
                      } else if (elem.type === "spokes") {
                        const step = (Math.PI * 2) / elem.folds;
                        return Array.from({ length: elem.folds }).map((_, i) => {
                          const a = i * step;
                          return (
                            <line
                              key={`${idx}-${i}`}
                              x1={200 + Math.cos(a) * elem.innerRadius}
                              y1={200 + Math.sin(a) * elem.innerRadius}
                              x2={200 + Math.cos(a) * elem.outerRadius}
                              y2={200 + Math.sin(a) * elem.outerRadius}
                            />
                          );
                        });
                      }
                      return null;
                    })}
                  </svg>
                )}
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-400 font-medium">
                - Page 1 -
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
