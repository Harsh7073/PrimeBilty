"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Printer, ArrowLeft, Save, Plus, Trash2, AlignLeft, 
  AlignCenter, AlignRight, Bold, RotateCw, Type, QrCode, 
  Image as ImageIcon, CheckCircle, Percent
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import Link from "next/link";

// 1mm on canvas = 3.2px on screen (gives 672px width for 210mm)
const SCALE = 3.2; 
const CANVAS_WIDTH_MM = 210;
const CANVAS_HEIGHT_MM = 297;

// Predefined available dynamic parameters
const PARAMETERS = [
  { id: "lr_number", name: "LR (Bilty) Number", tag: "{{lr_number}}", type: "text" },
  { id: "lr_date", name: "LR Date", tag: "{{lr_date}}", type: "text" },
  { id: "consignor_name", name: "Consignor Name", tag: "{{consignor_name}}", type: "text" },
  { id: "consignor_address", name: "Consignor Address", tag: "{{consignor_address}}", type: "text" },
  { id: "consignor_gst", name: "Consignor GSTIN", tag: "{{consignor_gst}}", type: "text" },
  { id: "consignee_name", name: "Consignee Name", tag: "{{consignee_name}}", type: "text" },
  { id: "consignee_address", name: "Consignee Address", tag: "{{consignee_address}}", type: "text" },
  { id: "consignee_gst", name: "Consignee GSTIN", tag: "{{consignee_gst}}", type: "text" },
  { id: "from_city", name: "From City", tag: "{{from_city}}", type: "text" },
  { id: "to_city", name: "To City", tag: "{{to_city}}", type: "text" },
  { id: "via", name: "Via Route", tag: "{{via}}", type: "text" },
  { id: "vehicle_number", name: "Vehicle Number", tag: "{{vehicle_number}}", type: "text" },
  { id: "driver_name", name: "Driver Name", tag: "{{driver_name}}", type: "text" },
  { id: "goods_description", name: "Goods Description", tag: "{{goods_description}}", type: "text" },
  { id: "quantity", name: "Quantity", tag: "{{quantity}}", type: "text" },
  { id: "unit", name: "Unit", tag: "{{unit}}", type: "text" },
  { id: "weight", name: "Weight", tag: "{{weight}}", type: "text" },
  { id: "freight_amount", name: "Base Freight", tag: "{{freight_amount}}", type: "text" },
  { id: "gst_amount", name: "GST Amount", tag: "{{gst_amount}}", type: "text" },
  { id: "total_amount", name: "Total Freight", tag: "{{total_amount}}", type: "text" },
  { id: "advance_amount", name: "Advance Amount", tag: "{{advance_amount}}", type: "text" },
  { id: "balance_amount", name: "Balance Due", tag: "{{balance_amount}}", type: "text" },
  { id: "payment_type", name: "Payment Type", tag: "{{payment_type}}", type: "text" },
  { id: "e_way_bill", name: "E-Way Bill No", tag: "{{e_way_bill}}", type: "text" },
  { id: "qr_code", name: "Bilty QR Code", tag: "{{qr_code}}", type: "qr" },
  { id: "barcode", name: "Bilty Barcode", tag: "{{barcode}}", type: "barcode" },
  { id: "logo", name: "Company Logo", tag: "{{logo}}", type: "logo" },
];

interface CanvasElement {
  id: string;
  type: "text" | "qr" | "barcode" | "logo" | "static";
  name: string;
  value: string; // "{{consignor_name}}" or custom string
  x: number; // in mm
  y: number; // in mm
  width: number; // in mm
  height: number; // in mm
  fontSize: number; // in pt
  color: string;
  align: "left" | "center" | "right";
  bold: boolean;
  rotation: number; // degrees: 0, 90, 180, 270
}

export default function TemplateDesignerPage() {
  const { token } = useAuthStore();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [template, setTemplate] = useState<any>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef<{
    elementId: string;
    startX: number;
    startY: number;
    startElemX: number;
    startElemY: number;
  } | null>(null);

  // Extract ID from query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");
      if (id) {
        setTemplateId(id);
      } else {
        window.location.href = "/admin/print-templates";
      }
    }
  }, []);

  // Fetch template data
  useEffect(() => {
    if (templateId && token) {
      const fetchTemplate = async () => {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const { data } = await axios.get(`/api/print-templates/${templateId}`, { headers });
          setTemplate(data.template);
          
          let parsedLayout: CanvasElement[] = [];
          try {
            parsedLayout = JSON.parse(data.template.jsonLayout || "[]");
          } catch {
            parsedLayout = [];
          }
          setElements(parsedLayout);
        } catch (e) {
          console.error("Failed to load print template designer:", e);
        }
      };
      fetchTemplate();
    }
  }, [templateId, token]);

  const handleSave = async () => {
    if (!templateId || !token) return;
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`/api/print-templates/${templateId}`, {
        jsonLayout: JSON.stringify(elements)
      }, { headers });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error("Error saving template layout:", e);
    } finally {
      setSaving(false);
    }
  };

  // Add parameter to canvas
  const addElement = (param: typeof PARAMETERS[0] | { type: "static"; name: string; tag: string }) => {
    const newElement: CanvasElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: param.type as any,
      name: param.name,
      value: param.tag,
      x: 10,
      y: 10 + (elements.length * 8) % 200, // offset slightly to prevent complete overlap
      width: param.type === "text" || param.type === "static" ? 80 : 35,
      height: param.type === "text" || param.type === "static" ? 8 : 35,
      fontSize: 10,
      color: "#000000",
      align: "left",
      bold: false,
      rotation: 0
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(e => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  // Drag and Drop positioning
  const handlePointerDown = (e: React.PointerEvent, elemId: string) => {
    e.stopPropagation();
    setSelectedId(elemId);
    
    const target = elements.find(el => el.id === elemId);
    if (!target) return;

    dragInfo.current = {
      elementId: elemId,
      startX: e.clientX,
      startY: e.clientY,
      startElemX: target.x,
      startElemY: target.y
    };
    
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragInfo.current) return;
    const { elementId, startX, startY, startElemX, startElemY } = dragInfo.current;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Convert screen pixel delta to millimeter delta
    const deltaX_mm = deltaX / SCALE;
    const deltaY_mm = deltaY / SCALE;

    let newX = Math.round(startElemX + deltaX_mm);
    let newY = Math.round(startElemY + deltaY_mm);

    // Bound inside the A4 sheet boundaries
    newX = Math.max(0, Math.min(CANVAS_WIDTH_MM - 10, newX));
    newY = Math.max(0, Math.min(CANVAS_HEIGHT_MM - 5, newY));

    updateElement(elementId, { x: newX, y: newY });
  };

  const handlePointerUp = () => {
    dragInfo.current = null;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  const selectedElement = elements.find(e => e.id === selectedId);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col -m-6 overflow-hidden">
      {/* Top Header */}
      <div className="bg-dark-900 border-b border-white/10 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/admin/print-templates" className="btn-icon">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="text-xs text-white/40 font-mono">{template?.designNo || "Loading..."}</div>
            <h1 className="text-base font-semibold text-white -mt-0.5">{template?.designName || "Loading designer..."}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-400 flex items-center gap-1 mr-3"
            >
              <CheckCircle className="w-4 h-4" /> Saved Successfully!
            </motion.div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary gap-1.5 px-4 py-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Design"}
          </button>
        </div>
      </div>

      {/* Main Designer Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Parameters List */}
        <div className="w-64 bg-dark-900 border-r border-white/10 flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Dynamic Fields</h2>
            <p className="text-[10px] text-white/30 mt-0.5">Click fields to place them on A4 canvas</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-area">
            {/* Custom static label */}
            <div className="space-y-1.5">
              <h3 className="text-[11px] font-semibold text-white/40">Static Elements</h3>
              <button
                onClick={() => addElement({ type: "static", name: "Custom Text Label", tag: "Custom Text Label" })}
                className="w-full text-left p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-xs font-medium text-white/80 flex items-center gap-2"
              >
                <Type className="w-3.5 h-3.5 text-brand-400" />
                Add Static Text Label
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-[11px] font-semibold text-white/40">System Parameters</h3>
              <div className="grid grid-cols-1 gap-1.5">
                {PARAMETERS.map(param => (
                  <button
                    key={param.id}
                    onClick={() => addElement(param)}
                    className="w-full text-left p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-xs font-medium text-white/70 flex items-center justify-between"
                  >
                    <span className="truncate">{param.name}</span>
                    <span className="text-[9px] font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{param.tag.slice(2, -2)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Side: Visual Canvas */}
        <div className="flex-1 bg-dark-950 p-6 overflow-y-auto flex justify-center scroll-area">
          <div className="relative">
            {/* Canvas Ruler Indicators */}
            <div className="absolute -top-6 left-0 text-[10px] text-white/20">210mm Width (A4)</div>
            <div className="absolute -left-6 top-0 text-[10px] text-white/20 origin-bottom-left -rotate-90 whitespace-nowrap">297mm Height (A4)</div>

            {/* Visual sheet wrapper */}
            <div 
              ref={canvasRef}
              style={{ 
                width: `${CANVAS_WIDTH_MM * SCALE}px`, 
                height: `${CANVAS_HEIGHT_MM * SCALE}px` 
              }}
              className="relative bg-white border border-black/10 shadow-2xl rounded overflow-hidden select-none"
              onClick={() => setSelectedId(null)}
            >
              {/* Grid Background Mock */}
              <div className="absolute inset-0 grid grid-cols-21 grid-rows-29 pointer-events-none opacity-[0.03]">
                {Array.from({ length: 21 * 30 }).map((_, i) => (
                  <div key={i} className="border-b border-r border-black" />
                ))}
              </div>

              {/* Placed Elements */}
              {elements.map((el) => {
                const isSelected = selectedId === el.id;
                const style: React.CSSProperties = {
                  position: "absolute",
                  left: `${el.x * SCALE}px`,
                  top: `${el.y * SCALE}px`,
                  width: `${el.width * SCALE}px`,
                  height: `${el.height * SCALE}px`,
                  fontSize: `${el.fontSize * 1.3}px`,
                  color: el.color,
                  textAlign: el.align,
                  fontWeight: el.bold ? "bold" : "normal",
                  transform: `rotate(${el.rotation}deg)`,
                  fontFamily: "monospace",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: el.align === "center" ? "center" : el.align === "right" ? "flex-end" : "flex-start",
                };

                return (
                  <div
                    key={el.id}
                    onPointerDown={(e) => handlePointerDown(e, el.id)}
                    style={style}
                    className={`cursor-move border border-dashed transition-colors ${
                      isSelected 
                        ? "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20" 
                        : "border-black/20 hover:border-black/40 hover:bg-black/5"
                    }`}
                  >
                    {/* Render visual mock based on element type */}
                    {el.type === "text" || el.type === "static" ? (
                      <span className="truncate px-1 select-none">{el.value}</span>
                    ) : el.type === "qr" ? (
                      <div className="w-full h-full p-1 bg-white border border-black flex-center flex-col text-[8px] text-black">
                        <QrCode className="w-3/4 h-3/4 text-black" />
                        <span className="text-[6px] truncate">{el.value.slice(2, -2)}</span>
                      </div>
                    ) : el.type === "barcode" ? (
                      <div className="w-full h-full p-1 bg-white border border-black flex flex-col items-center justify-between text-[7px] text-black">
                        <div className="w-full flex-1 flex items-stretch gap-[1px]">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="flex-1 bg-black" style={{ width: i % 3 === 0 ? "2px" : "1px", opacity: i % 4 === 0 ? 0.3 : 1 }} />
                          ))}
                        </div>
                        <span className="text-[6px] truncate font-mono mt-0.5">{el.value.slice(2, -2)}</span>
                      </div>
                    ) : el.type === "logo" ? (
                      <div className="w-full h-full p-1 bg-white border border-black flex-center flex-col text-[8px] text-black gap-1">
                        <ImageIcon className="w-1/2 h-1/2 text-black/50" />
                        <span className="text-[6px]">LOGO</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Properties Panel */}
        <div className="w-80 bg-dark-900 border-l border-white/10 flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Properties Inspector</h2>
          </div>

          {selectedElement ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scroll-area">
              {/* Element Name */}
              <div className="space-y-1">
                <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Element ID & Type</span>
                <div className="p-2 rounded bg-white/5 border border-white/5 text-xs text-white/60 font-semibold flex items-center justify-between">
                  <span>{selectedElement.name}</span>
                  <span className="text-[9px] bg-brand-500/20 text-brand-400 font-mono px-1 rounded uppercase">{selectedElement.type}</span>
                </div>
              </div>

              {/* Editable Text Value if Static */}
              {selectedElement.type === "static" && (
                <div className="space-y-1">
                  <label className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Label Text Content</label>
                  <input
                    type="text"
                    value={selectedElement.value}
                    onChange={(e) => updateElement(selectedElement.id, { value: e.target.value })}
                    className="input-base text-xs py-1.5"
                  />
                </div>
              )}

              {/* Dimensions & Coordinates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Position X (mm)</label>
                  <input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                    className="input-base text-xs py-1.5 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Position Y (mm)</label>
                  <input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                    className="input-base text-xs py-1.5 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Width (mm)</label>
                  <input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                    className="input-base text-xs py-1.5 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Height (mm)</label>
                  <input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                    className="input-base text-xs py-1.5 font-mono"
                  />
                </div>
              </div>

              {/* Text Styling Options */}
              {(selectedElement.type === "text" || selectedElement.type === "static") && (
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider font-mono">Text Styles</h3>
                  
                  {/* Font Size */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/35">Font Size (pt)</label>
                    <input
                      type="number"
                      value={selectedElement.fontSize}
                      onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                      className="input-base text-xs py-1.5 font-mono"
                    />
                  </div>

                  {/* Alignment, Bold, Color */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/35">Text Properties</label>
                    <div className="flex gap-2">
                      <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
                        {(["left", "center", "right"] as const).map(align => (
                          <button
                            key={align}
                            onClick={() => updateElement(selectedElement.id, { align })}
                            className={`p-1.5 rounded transition-all ${selectedElement.align === align ? "bg-brand-500/20 text-brand-400" : "text-white/40 hover:text-white/70"}`}
                          >
                            {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                            {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                            {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => updateElement(selectedElement.id, { bold: !selectedElement.bold })}
                        className={`p-2 bg-white/5 border border-white/10 rounded-lg flex-center font-bold text-xs ${
                          selectedElement.bold ? "bg-brand-500/20 text-brand-400 border-brand-500/30" : "text-white/40 hover:text-white/70"
                        }`}
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex-1 relative">
                        <input
                          type="color"
                          value={selectedElement.color}
                          onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                          className="absolute inset-y-0 right-0 w-8 h-full p-0 border-0 bg-transparent cursor-pointer rounded"
                        />
                        <input
                          type="text"
                          value={selectedElement.color.toUpperCase()}
                          onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                          className="input-base text-xs py-1.5 font-mono pr-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rotation Property */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-[10px] text-white/30 uppercase tracking-wider font-mono flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Rotation (Degrees)
                </label>
                <div className="flex gap-1 bg-white/5 border border-white/10 p-0.5 rounded-lg">
                  {([0, 90, 180, 270] as const).map(angle => (
                    <button
                      key={angle}
                      onClick={() => updateElement(selectedElement.id, { rotation: angle })}
                      className={`flex-1 py-1 text-[10px] font-mono rounded transition-all ${
                        selectedElement.rotation === angle ? "bg-brand-500/20 text-brand-400 font-semibold" : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => deleteElement(selectedElement.id)}
                  className="w-full btn-secondary text-red-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <Trash2 className="w-4 h-4" /> Remove Element
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center p-6 text-center text-white/30 gap-2 select-none">
              <Type className="w-8 h-8 opacity-30 animate-pulse" />
              <div className="text-xs font-medium">No Element Selected</div>
              <div className="text-[10px] max-w-44 leading-relaxed">Select any layout item on the A4 page sheet to inspect and edit its positioning or style parameters.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
