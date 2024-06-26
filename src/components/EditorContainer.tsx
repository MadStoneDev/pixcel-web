﻿"use client";

import { Route } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import Logo from "@/components/Logo";
import { newArtwork } from "@/utilities/GeneralUtils";
import CanvasContainer from "@/components/CanvasContainer";
import { CanvasConfig, ColourObject } from "@/types/canvas";

import {
  IconArrowsMove,
  IconColorSwatch,
  IconEraser,
  IconFilePlus,
  IconHome,
  IconMarquee2,
  IconPencil,
  IconTools,
  IconUpload,
} from "@tabler/icons-react";
import { PaintBucket, Pipette } from "lucide-react";
import { generateKeyIdentifier } from "@/utilities/IndexedUtils";

interface CanvasEditorProps {
  config?: CanvasConfig;
}

export default function EditorContainer({ config }: CanvasEditorProps) {
  // States
  // initialise to pencil;
  const [previousTool, setPreviousTool] = useState(1);
  const [selectedTool, setSelectedTool] = useState(1);
  const [keyIdentifier, setKeyIdentifier] = useState("");

  // initialise colour to 0;
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentColour, setCurrentColour] = useState<ColourObject>({
    colour: DEFAULT_COLOUR_PALETTE[1],
    alpha: 255,
  });

  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleToolChange = (tool: number) => {
    if (tool === selectedTool) return;

    const applicableTools = ["pencil", "fill"];
    const oldTool = selectedTool;
    const newTool = tool;

    console.log(oldTool, newTool);

    if (applicableTools.includes(DEFAULT_TOOLS[oldTool].name.toLowerCase())) {
      setPreviousTool(selectedTool);
    }

    setSelectedTool(newTool);
  };

  const toggleToolChange = () => handleToolChange(previousTool);

  const handleColourChange = (colour: string, alpha: number) => {
    setCurrentColour({ colour: colour.toUpperCase(), alpha });
  };

  return (
    <main
      id={`editor-${keyIdentifier}`}
      className={`flex flex-col w-full h-dvh bg-neutral-900/50 transition-all duration-300 overflow-hidden`}
    >
      {/* App Main */}
      <div
        className={`relative p-5 flex flex-row items-start gap-6 w-full h-full`}
      >
        {/* Toolbar */}
        <article
          className={`pt-5 relative col-span-2 flex ${
            selectedCategory === 1 ? "" : "gap-7"
          } w-60 h-full z-20`}
        >
          <div
            className={`relative flex flex-col w-[52.5%] h-full bg-neutral-100 rounded-3xl z-10`}
          >
            {/* Toolbar Categories */}
            <section
              ref={sidebarRef}
              className={`flex-grow relative flex flex-col h-full`}
            >
              {/* Toolbar Indicator */}
              <div
                className={`absolute top-0 left-0 w-full bg-secondary-500 rounded-3xl shadow-xl shadow-neutral-900/30 scale-110 transition-all duration-500 ease-in-out z-0`}
                style={{
                  top: `${(100 * selectedCategory) / TOOL_CATEGORIES.length}%`,
                  height: `${100 / TOOL_CATEGORIES.length}%`,
                }}
              >
                <span
                  className={`absolute top-4 right-4 w-3.5 h-3.5 rounded-full border-2`}
                  style={{
                    backgroundColor: currentColour.colour as string,
                  }}
                ></span>
              </div>

              {TOOL_CATEGORIES.map((tool, index) => (
                <div
                  key={`tool-${index}`}
                  className={`cursor-pointer grid place-content-center w-full h-full transition-all duration-300 z-10`}
                  style={{ aspectRatio: 1 }}
                  onClick={() => setSelectedCategory(index)}
                >
                  <div
                    className={`flex flex-col items-center justify-center gap-2 w-full h-full ${
                      selectedCategory === index
                        ? "text-primary-500"
                        : "text-neutral-900"
                    } transition-all duration-500`}
                  >
                    {tool.icon}
                    <span className={`grid place-content-center text-xs`}>
                      {tool.name}
                    </span>
                  </div>
                </div>
              ))}
            </section>

            {/* Toolbar Footer */}
            <section className={`pb-1 px-3 w-full`}>
              <div className={`mb-3 w-full h-0.5 bg-secondary-200`}></div>
              <h3
                className={`flex flex-col items-center font-poppins text-secondary-500 text-base font-bold uppercase text-center`}
              >
                <Logo className="w-6 h-6" />
                Pixecute
              </h3>
              <div
                className={`py-3 flex flex-row justify-evenly gap-2 text-secondary-500`}
              >
                <button
                  className={`hover:text-primary-500 transition-all duration-300`}
                  onClick={() => router.push("/")}
                >
                  <IconHome size={24} />
                </button>
                <button
                  className={`hover:text-primary-500 transition-all duration-300`}
                  onClick={async () => {
                    const keyIdentifier = await generateKeyIdentifier();

                    const configEncoded = newArtwork({
                      width: config?.width || 16,
                      height: config?.height || 16,
                      background: config?.background || "transparent",
                      keyIdentifier: keyIdentifier,
                    });

                    router.push(`/editor?new=${configEncoded}` as Route);

                    const configDecoded = JSON.parse(
                      window.atob(await configEncoded),
                    );

                    setKeyIdentifier(configDecoded.keyIdentifier);
                  }}
                >
                  <IconFilePlus size={24} />
                </button>
              </div>
            </section>
          </div>

          {selectedCategory === 0 && (
            <ToolsMenu
              className={`flex-grow`}
              selectedOption={selectedTool}
              setSelectedOption={handleToolChange}
              currentColour={currentColour}
            />
          )}

          {selectedCategory === 1 && (
            <ColourMenu
              className={`flex-grow`}
              setSelectedOption={handleColourChange}
              sidebarRef={sidebarRef}
            />
          )}
        </article>

        {/* Drawing Area */}
        <CanvasContainer
          className={`col-span-10`}
          config={config}
          currentColour={currentColour}
          setColour={handleColourChange}
          currentTool={DEFAULT_TOOLS[selectedTool]}
          toggleTools={toggleToolChange}
        />
      </div>
    </main>
  );
}

const ToolsMenu = ({
  className,
  selectedOption,
  setSelectedOption,
  currentColour,
}: {
  className?: string;
  selectedOption: number;
  setSelectedOption: (props: any) => void;
  currentColour: ColourObject;
}) => {
  return (
    <article
      className={`relative top-1/2 -translate-y-1/2 flex flex-col h-fit bg-neutral-100 rounded-3xl ${className}`}
    >
      <div
        className={`absolute top-0 left-0 w-full bg-secondary-500 rounded-3xl shadow-xl shadow-neutral-900 scale-125 transition-all duration-500 ease-in-out z-10`}
        style={{
          top: `${(100 * selectedOption) / DEFAULT_TOOLS.length}%`,
          width: "100%",
          aspectRatio: 1,
        }}
      >
        <span
          className={`absolute top-4 right-4 w-3 h-3 rounded-full border-2`}
          style={{
            backgroundColor: currentColour.colour as string,
          }}
        ></span>
      </div>
      {DEFAULT_TOOLS.map((tool, index) => (
        <div
          key={`tool-${index}`}
          className={`cursor-pointer grid place-content-center w-full ${
            selectedOption === index ? "text-primary-500" : "text-neutral-900"
          } transition-all duration-500 z-10`}
          style={{ aspectRatio: 1 }}
          onClick={() => setSelectedOption(index)}
        >
          {tool.icon}
        </div>
      ))}
    </article>
  );
};

const ColourMenu = ({
  className,
  setSelectedOption,
  sidebarRef,
}: {
  className?: string;
  setSelectedOption: (...props: any) => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
}) => {
  // States
  const [isSwiping, setIsSwiping] = useState(false);
  const [extraDegrees, setExtraDegrees] = useState(0);
  const [originCenter, setOriginCenter] = useState(0);
  const [colourSpectrum, setColourSpectrum] = useState(false);
  const [loading, setLoading] = useState(true);

  // Refs
  const initialYRef = useRef(0);
  const radialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (radialRef.current) {
      setOriginCenter(radialRef.current.offsetWidth / 2);
      setLoading(false);
    }
  }, []);

  return (
    <article
      className={`absolute touch-none w-full overflow-hidden ${className}`}
      style={{ height: sidebarRef.current?.offsetHeight || "100%" }}
      onPointerUp={() => setIsSwiping(false)}
      onPointerLeave={() => setIsSwiping(false)}
      onPointerMove={(event) => {
        if (isSwiping) {
          const { clientY } = event;

          const deltaY = clientY - initialYRef.current;
          setExtraDegrees((prev) => prev + deltaY);
          initialYRef.current = clientY;
        }
      }}
    >
      <section
        className={`absolute p-3 ${
          loading ? "right-full" : "right-0"
        } top-1/2 -translate-y-1/2 flex justify-center items-center w-full rounded-full bg-neutral-100 transition-all duration-500`}
        style={{
          aspectRatio: 1,
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          const { clientY } = event;

          setIsSwiping(true);
          initialYRef.current = clientY;
        }}
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center  w-[92%] h-[92%] ${
            colourSpectrum ? "max-w-full max-h-full" : "max-w-[40%] max-h-[40%]"
          } rounded-full bg-neutral-100 z-20 transition-all duration-500`}
          onClick={() => setColourSpectrum(true)}
        >
          <div
            className={`relative p-6 w-[100%] h-[100%] rotate-[150deg] rounded-full`}
            style={{
              background: `conic-gradient(rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))`,
            }}
          >
            {colourSpectrum && (
              <div
                className={`p-2 flex justify-center items-center w-full h-full bg-neutral-100 rounded-full transition-all duration-500`}
              >
                <div
                  className={`w-full h-full ${
                    colourSpectrum ? "max-w-full max-h-full" : "max-w-0 max-h-0"
                  } rounded-full transition-all delay-300 duration-500`}
                  style={{
                    background: `conic-gradient(rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))`,
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>

        <div
          ref={radialRef}
          className={`relative w-full h-full flex justify-center items-center rounded-full`}
          style={{
            transform: `rotate(${130 + extraDegrees}deg)`,
          }}
        >
          {DEFAULT_COLOUR_PALETTE.map((colour, index) => (
            <div
              key={`colour-palette-${index}`}
              className={`absolute left-0 w-8 h-8 rounded-full ${
                colour === "#FFFFFF" ? "" : ""
              } shadow-xl shadow-neutral-900/40 transition-all duration-500`}
              style={{
                backgroundColor: colour,
                aspectRatio: 1,
                transformOrigin: originCenter + "px",
                transform: `rotate(${
                  (index * 360) / DEFAULT_COLOUR_PALETTE.length
                }deg)`,
              }}
              onClick={() => {
                setSelectedOption(DEFAULT_COLOUR_PALETTE[index], 255);
              }}
            ></div>
          ))}
        </div>
      </section>
    </article>
  );
};

const DEFAULT_COLOUR_PALETTE = [
  "#FFFFFF", // White
  "#000000", // Black
  // "#BDC3C7", // Silver
  // "#7F8C8D", // Asbestos
  "#F1C40F", // Sun Flower
  // "#F39C12", // Orange
  "#E67E22", // Carrot
  // "#D35400", // Pumpkin
  // "#E74C3C", // Alizarin
  "#C0392B", // Pomegranate
  // "#2ECC71", // Emerald
  "#27AE60", // Nephritis
  "#1ABC9C", // Turquoise
  // "#16A085", // Green Sea
  "#3498DB", // Peter River
  "#2980B9", // Belize Hole
  // "#9B59B6", // Amethyst
  "#8E44AD", // Wisteria
  // "#34495E", // Wet Asphalt
  "#2C3E50", // Midnight Blue
];

interface ArtTool {
  name: string;
  icon: React.ReactNode;
  trigger?: "up" | "down";
  subTools?: ArtTool[];
}

const TOOL_CATEGORIES = [
  {
    name: "Tools",
    icon: <IconTools />,
  },
  {
    name: "Colours",
    icon: <IconColorSwatch size={35} />,
  },
  {
    name: "Save / Export",
    icon: <IconUpload size={35} />,
  },
];

const DEFAULT_TOOLS: ArtTool[] = [
  {
    name: "Select",
    icon: <IconMarquee2 size={30} />,
    trigger: "down",
  },
  {
    name: "Pencil",
    icon: <IconPencil size={30} />,
    trigger: "down",
  },
  // {
  //   name: "Brush",
  //   icon: <IconBrush size={28} />,
  //   trigger: "down",
  //   subTools: [
  //     {
  //       name: "Brush",
  //       icon: <IconBrush size={28} />,
  //     },
  //   ],
  // },
  {
    name: "Picker",
    icon: <Pipette size={30} />,
    trigger: "up",
  },
  {
    name: "Eraser",
    icon: <IconEraser size={28} />,
    trigger: "down",
  },
  {
    name: "Fill",
    icon: <PaintBucket size={30} style={{ transform: "scaleX(-1)" }} />,
    trigger: "up",
  },
  // {
  //   name: "Line",
  //   icon: <IconLine size={30} />,
  //   trigger: "down",
  // },
  // {
  //   name: "Shape",
  //   icon: <IconShape size={30} />,
  //   trigger: "down",
  // },
  {
    name: "Move",
    icon: <IconArrowsMove size={30} />,
    trigger: "down",
  },
];
