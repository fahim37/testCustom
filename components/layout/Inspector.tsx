"use client";

import { useEditor } from "@/components/editor/EditorProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
        numberFontFamily, setNumberFontFamily
    } = useEditor();

    return (
        <aside className="w-80 border-l bg-background flex flex-col overflow-auto h-full">
            <div className="p-4 border-b">
                <h2 className="text-xs font-bold text-primary uppercase tracking-widest border-l-2 border-indigo-500 pl-2">Inspector</h2>
            </div>

            <div className="flex-1 p-6 space-y-8">

                {/* Production Asset */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Production Asset</h3>
                    <Card className="p-4 border-dashed border-2 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                        <div className="bg-emerald-500 text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <Upload className="h-4 w-4" />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">image-removebg-preview.png</span>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Preview Loaded</span>
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
