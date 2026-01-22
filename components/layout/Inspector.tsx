"use client";

import { useEditor } from "@/components/editor/EditorProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { HexColorPicker } from "react-colorful";
import { useRef, useState, ChangeEvent } from "react";
import { Upload, Check, FileImage, Loader2, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

// Mock implementation of a Color Picker Popover replacement without full Popover component yet
const ColorPickerButton = ({ color, onChange }: { color: string, onChange: (c: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <div
                className="w-full h-8 rounded border cursor-pointer flex items-center justify-center text-xs font-mono lowercase shadow-sm"
                style={{ backgroundColor: color, color: parseInt(color.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {color}
            </div>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 z-20 mt-2 shadow-xl rounded-lg border bg-background p-2 w-full min-w-[200px]">
                        <HexColorPicker color={color} onChange={onChange} />
                    </div>
                </>
            )}
        </div>
    )
}

export function Inspector() {
    const {
        name, setName,
        number, setNumber,
        size, setSize,
        color, setColor,
        fontFamily, setFontFamily,
        numberFontFamily, setNumberFontFamily,
        setBaseImage,
        setBaseImageName,
        setBaseImageType,
        setBaseImageSize,
        baseImage,
        baseImageName,
        baseImageType,
        baseImageSize,
        nameOffsetY,
        setNameOffsetY,
        numberOffsetY,
        setNumberOffsetY
    } = useEditor();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isProcessingAsset, setIsProcessingAsset] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleAssetClick = () => {
        fileInputRef.current?.click();
    };

    const readRasterAsDataUrl = (file: File) => {
        return new Promise<{ dataUrl: string; width: number; height: number }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result as string;
                const img = new Image();
                img.onload = () => resolve({ dataUrl, width: img.width, height: img.height });
                img.onerror = () => reject(new Error("Unable to read image dimensions"));
                img.src = dataUrl;
            };
            reader.onerror = () => reject(new Error("Unable to read file"));
            reader.readAsDataURL(file);
        });
    };

    const convertAiToPng = async (file: File) => {
        const pdfjs = await import("pdfjs-dist");
        const { getDocument } = pdfjs as any;
        const arrayBuffer = await file.arrayBuffer();
        // disableWorker avoids fetching a remote worker (safer in offline environments)
        const pdf = await getDocument({ data: arrayBuffer, disableWorker: true }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Unable to initialize canvas to render AI");
        }
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/png");
        return { dataUrl, width: canvas.width, height: canvas.height };
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadError(null);
        setIsProcessingAsset(true);
        try {
            const isAi = file.name.toLowerCase().endsWith(".ai");
            let result;
            if (isAi) {
                result = await convertAiToPng(file);
                setBaseImageType("ai");
            } else if (file.type.startsWith("image/")) {
                result = await readRasterAsDataUrl(file);
                setBaseImageType("raster");
            } else {
                throw new Error("Please upload an .ai, .png, .jpg, or .webp file.");
            }

            setBaseImage(result.dataUrl);
            setBaseImageName(file.name);
            setBaseImageSize({ width: result.width, height: result.height });
        } catch (error: any) {
            setUploadError(error?.message || "Failed to process file");
        } finally {
            setIsProcessingAsset(false);
            event.target.value = "";
        }
    };

    return (
        <aside className="w-80 border-l bg-background flex flex-col overflow-auto h-full">
            <div className="p-4 border-b">
                <h2 className="text-xs font-bold text-primary uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Inspector</h2>
            </div>

            <div className="flex-1 p-6 space-y-8">

                {/* Production Asset */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Production Asset</h3>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".ai,image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Card
                        onClick={handleAssetClick}
                        className="p-4 border-dashed border-2 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group"
                    >
                        <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center">
                            {isProcessingAsset ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        </div>
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-full">
                            {baseImageName || "Upload .ai or image"}
                        </span>
                        {uploadError ? (
                            <span className="text-[10px] text-destructive font-bold uppercase tracking-wider text-center">{uploadError}</span>
                        ) : baseImage ? (
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Check className="h-3 w-3" /> Preview ready
                            </span>
                        ) : (
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Click to load jersey</span>
                        )}
                        {baseImage && (
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/60 dark:bg-white/10">
                                    {baseImageType === "ai" ? <FileUp className="h-3 w-3" /> : <FileImage className="h-3 w-3" />}
                                    {baseImageType === "ai" ? "AI → PNG" : "Raster"}
                                </span>
                                {baseImageSize && (
                                    <span className="font-mono">
                                        {baseImageSize.width}×{baseImageSize.height}px
                                    </span>
                                )}
                            </div>
                        )}
                    </Card>
                </section>

                <div className="h-px bg-border/50" />

                {/* Personalization */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Personalization</h3>
                        <span className="text-[10px] text-muted-foreground font-mono">ID: 0762</span>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground uppercase">Typography (Name)</Label>
                        <div className="grid grid-cols-[1fr_100px] gap-2">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="font-bold uppercase"
                            />
                            <Select value={fontFamily} onValueChange={setFontFamily}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Font" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="arial">Arial Black</SelectItem>
                                    <SelectItem value="inter">Inter</SelectItem>
                                    <SelectItem value="oswald">Oswald</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <ColorPickerButton color={color} onChange={setColor} />
                            {/* Additional controls like spacing could go here */}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground uppercase">Squad Number</Label>
                        <div className="grid grid-cols-[80px_1fr] gap-2">
                            <Input
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                className="font-mono text-center text-lg tracking-widest"
                                maxLength={3}
                            />
                            <Select value={numberFontFamily} onValueChange={setNumberFontFamily}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Font" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="impact">Impact</SelectItem>
                                    <SelectItem value="college">College Block</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground uppercase">Placement Fine-Tune</Label>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                    <span>Player Name Y</span>
                                    <span className="font-mono">{nameOffsetY}px</span>
                                </div>
                                <Slider
                                    value={[nameOffsetY]}
                                    min={-200}
                                    max={200}
                                    step={1}
                                    onValueChange={([v]) => setNameOffsetY(v)}
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                    <span>Number Y</span>
                                    <span className="font-mono">{numberOffsetY}px</span>
                                </div>
                                <Slider
                                    value={[numberOffsetY]}
                                    min={-200}
                                    max={200}
                                    step={1}
                                    onValueChange={([v]) => setNumberOffsetY(v)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-border/50" />

                {/* Dimensions */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dimension Preset</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {["XS", "S", "M", "L", "XL", "2XL"].map((s) => (
                            <div
                                key={s}
                                onClick={() => setSize(s)}
                                className={cn(
                                    "border rounded p-2 flex flex-col gap-1 cursor-pointer transition-all hover:border-primary",
                                    size === s ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                                )}
                            >
                                <span className="text-xs font-bold">{s}</span>
                                <span className="text-[10px] text-muted-foreground">101 cm - 104 cm</span>
                                {size === s && <div className="absolute top-1 right-1 h-1.5 w-1.5 bg-primary rounded-full" />}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="p-4 border-t bg-muted/10">
                <div className="bg-indigo-600 rounded-lg p-4 text-white shadow-lg shadow-indigo-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Check className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Production Link</span>
                    </div>
                    <p className="text-[10px] opacity-80 leading-relaxed">
                        High-fidelity vector pipeline ready. PDF/X-4 CMYK conversion calibrated for Dhaka industrial facility.
                    </p>
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>FPS: 60</span>
                    <span>MEMORY: 24.8MB</span>
                </div>
            </div>
        </aside>
    );
}
