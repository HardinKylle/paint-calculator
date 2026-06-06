"use client";
import React, { useState } from "react";
import { Grid, Info, BookOpen, ShieldCheck } from "lucide-react";
import {
  FloorPlanPanel,
  AssumptionsPanel,
  CalculationPanel,
  ValidationPanel,
} from "@/components/panels";
import { CollapsiblePanel } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { RoomInput, ProjectEstimate } from "@/types/estimate";

interface WorkspacePanelsProps {
  rooms: RoomInput[];
  projectEstimate: ProjectEstimate;
  onAddRoomFromReference: (room: { name: string; length: number; width: number }) => void;
  onLoadSamplePlan: () => void;
}

export const WorkspacePanels: React.FC<WorkspacePanelsProps> = ({
  rooms,
  projectEstimate,
  onAddRoomFromReference,
  onLoadSamplePlan,
}) => {
  const [activeTab, setActiveTab] = useState<"reference" | "assumptions" | "validation" | "calculation">("reference");

  return (
    <>
      {/* Desktop Tabbed Panels */}
      <div className="hidden lg:flex flex-col gap-5 border-t border-stone-200 pt-8 mt-4">
        <div className="flex border-b border-stone-200 text-xs font-semibold text-stone-500">
          {(
            [
              { id: "reference", label: "Floor Plan Reference", Icon: Grid },
              { id: "assumptions", label: "Estimation Assumptions", Icon: Info },
              { id: "calculation", label: "Calculation Walkthrough", Icon: BookOpen },
              { id: "validation", label: "Engine Validation", Icon: ShieldCheck },
            ] as const
          ).map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3 border-b-2 transition-all cursor-pointer",
                  active
                    ? "border-rose-600 text-rose-600 font-bold"
                    : "border-transparent hover:text-stone-800"
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="pt-2">
          {activeTab === "reference" && (
            <FloorPlanPanel
              onAddRoom={onAddRoomFromReference}
              showLoadSample={rooms.length === 0}
              onLoadSamplePlan={onLoadSamplePlan}
            />
          )}
          {activeTab === "assumptions" && <AssumptionsPanel />}
          {activeTab === "calculation" && <CalculationPanel rooms={rooms} estimates={projectEstimate.rooms} />}
          {activeTab === "validation" && <ValidationPanel />}
        </div>
      </div>

      {/* Mobile Accordion Panels */}
      <div className="block lg:hidden border-t border-stone-200 pt-8 mt-4 space-y-4 print:hidden">
        {(
          [
            {
              id: "reference",
              label: "Floor Plan Reference",
              Icon: Grid,
              component: (
                <FloorPlanPanel
                  onAddRoom={onAddRoomFromReference}
                  showLoadSample={rooms.length === 0}
                  onLoadSamplePlan={onLoadSamplePlan}
                />
              ),
            },
            {
              id: "assumptions",
              label: "Estimation Assumptions",
              Icon: Info,
              component: <AssumptionsPanel />,
            },
            {
              id: "calculation",
              label: "Calculation Walkthrough",
              Icon: BookOpen,
              component: <CalculationPanel rooms={rooms} estimates={projectEstimate.rooms} />,
            },
            {
              id: "validation",
              label: "Engine Validation Checks",
              Icon: ShieldCheck,
              component: <ValidationPanel />,
            },
          ] as const
        ).map(({ id, label, Icon, component }) => (
          <CollapsiblePanel key={id} label={label} icon={Icon}>
            {component}
          </CollapsiblePanel>
        ))}
      </div>
    </>
  );
};
