import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Play, FileDown } from "lucide-react";
import { useEditor } from "@/components/editor/EditorProvider";

export function Header() {
    const { triggerExport, triggerExportAi } = useEditor();
    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    {/* Logo placeholder - I'll use a simple colored box or Icon if no logo asset */}
                    <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold">
                        OC
                    </div>
                    <div>
                        <h1 className="text-sm font-bold leading-tight">One Click Jersey</h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Production Studio</p>
                    </div>
                </div>
                <div className="h-6 w-px bg-border mx-2" />
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Project</span>
                    <span className="text-sm font-medium">Premier League - Home Kit 2025</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                    <Upload className="h-3.5 w-3.5" />
                    Import Batch
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={triggerExportAi}>
                    <FileDown className="h-3.5 w-3.5" />
                    Export AI
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={triggerExport}>
                    <Download className="h-3.5 w-3.5" />
                    Export PNG
                </Button>
                <Button size="sm" className="h-8 text-xs gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Start Production
                </Button>
            </div>
        </header>
    );
}
