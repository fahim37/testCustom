import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const queueItems = [
        { id: 1, name: "NIAZ", number: "07", size: "L", active: false },
        { id: 2, name: "NEWDSADA", number: "00", size: "L", active: true },
    ];

    return (
        <aside className="w-64 border-r bg-background flex flex-col">
            <div className="p-4 border-b space-y-4">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search sequence..." className="pl-8 h-9 text-xs" />
                </div>
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-muted/30">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Personalization Queue</span>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                    <Plus className="h-3 w-3" />
                </Button>
            </div>

            <div className="flex-1 overflow-auto p-2 space-y-1">
                {queueItems.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "group flex items-start justify-between rounded-md p-3 text-sm transition-colors cursor-pointer",
                            item.active ? "bg-slate-900 text-white dark:bg-slate-800" : "hover:bg-muted text-muted-foreground"
                        )}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="font-bold uppercase tracking-wide">{item.name}</span>
                            <div className="flex items-center gap-2 text-xs opacity-80">
                                <span className="font-mono">#{item.number}</span>
                                <span className="px-1 py-0.5 rounded bg-white/20 text-[10px]">{item.size}</span>
                            </div>
                        </div>
                        <div className={cn("opacity-0 group-hover:opacity-100", item.active && "opacity-100")}>
                            {item.active && <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 mr-1 animate-pulse" />}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-2 border-t text-[10px] text-muted-foreground text-center">
                Engine Online • Node: DX-DHAKA 01
            </div>
        </aside>
    );
}
