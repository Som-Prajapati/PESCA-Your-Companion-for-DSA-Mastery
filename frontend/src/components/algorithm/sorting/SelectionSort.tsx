"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import SortingControls from "@/components/algorithm/sorting/SortingControl";
import {
  highlightRed,
  highlightBlue,
  removeHighlight,
  markAsSorted,
  eclipseSwap,
  showArrow,
  hideArrow,
  moveArrow,
  resetElement,
  pause as animationPause,
} from "@/lib/animations";

// ============================================================================
// TYPES
// ============================================================================

interface SidebarProps {
  isOpen: boolean;
  width: number;
}

// ============================================================================
// CONSTANTS & UTILITIES
// ============================================================================

const getDynamicSizing = (arrayLength: number) => {
  if (arrayLength <= 9) {
    return {
      BOX_WIDTH: 80,
      BOX_HEIGHT: 80,
      BOX_GAP: 16,
      BOX_BORDER_RADIUS: 12,
      BOX_FONT_SIZE: 20,
      ARROW_SIZE: 8,
      ARROW_FONT_SIZE: 16,
      ECLIPSE_HEIGHT: 80,
      TOTAL_BOX_SPACING: 80 + 16,
      ARROW_Y_OFFSET_DOWN: (80 * 2.4) / 2,
    };
  } else {
    return {
      BOX_WIDTH: 55,
      BOX_HEIGHT: 55,
      BOX_GAP: 10,
      BOX_BORDER_RADIUS: 8,
      BOX_FONT_SIZE: 16,
      ARROW_SIZE: 6,
      ARROW_FONT_SIZE: 14,
      ECLIPSE_HEIGHT: 60,
      TOTAL_BOX_SPACING: 55 + 10,
      ARROW_Y_OFFSET_DOWN: (55 * 2.4) / 2,
    };
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

const SelectionSort: React.FC<SidebarProps> = ({ isOpen, width }) => {
  // Fixed initial array to prevent hydration mismatch
  const getFixedInitialArray = () => [42, 17, 89, 31, 65, 8];
  const initialArray = getFixedInitialArray();

  // State management
  const [array, setArray] = useState<number[]>(initialArray);
  const [arraySize, setArraySize] = useState<number>(6);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [currentPseudoCodeLine, setCurrentPseudoCodeLine] = useState<
    number | number[]
  >(0);

  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const arrayElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const minArrowRef = useRef<HTMLDivElement>(null);
  const jArrowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const wasPausedRef = useRef<boolean>(false);
  const propsRef = useRef({ array, speed, isAscending, isPlaying });
  const currentStepRef = useRef<number>(0);
  const totalStepsRef = useRef<number>(0);

  // Pseudo code configuration
  const tabTitles = ["Selection Sort"] as const;
  const showPseudoCode = 0;
  const pseudoCode = [
    [
      "for i ← 0 to (size - 2) do",
      "    minIndex ← i",
      "",
      "    for j ← i + 1 to (size - 1) do",
      "        if array[j] < array[minIndex] then",
      "            minIndex ← j",
      "",
      "    swap array[i] and array[minIndex]",
      "",
      "return array",
    ],
  ];

  const dynamicSizing = getDynamicSizing(array.length);
  const {
    BOX_WIDTH,
    BOX_HEIGHT,
    BOX_GAP,
    BOX_BORDER_RADIUS,
    BOX_FONT_SIZE,
    ARROW_SIZE,
    ARROW_FONT_SIZE,
    ECLIPSE_HEIGHT,
    ARROW_Y_OFFSET_DOWN,
    TOTAL_BOX_SPACING,
  } = dynamicSizing;

  // ============================================================================
  // ANIMATION LOGIC
  // ============================================================================

  const playAnimation = (): void => {
    // Handle resume from pause
    if (wasPausedRef.current && timelineRef.current) {
      timelineRef.current.play();
      wasPausedRef.current = false;
      return;
    }

    resetAnimation();

    const arr = [...array];
    const n = arr.length;
    const mainTimeline = gsap.timeline();
    mainTimeline.timeScale(propsRef.current.speed);
    currentStepRef.current = 0;

    // Initial label
    mainTimeline.addLabel("step-0");
    mainTimeline.call(() => {
      currentStepRef.current = 0;
      setCurrentPseudoCodeLine(0);
    });

    let stepIndex = 1;

    // Selection sort algorithm
    for (let i = 0; i < n - 1; i++) {
      if (i > 0) {
        mainTimeline.call(() => setCurrentPseudoCodeLine(0));
        mainTimeline.add(animationPause(0.3));
      }

      let minIndex = i;

      mainTimeline.call(() => setCurrentPseudoCodeLine(1));

      // Show arrows
      if (
        minArrowRef.current &&
        jArrowRef.current &&
        arrayElementsRef.current[0] &&
        arrayElementsRef.current[1]
      ) {
        mainTimeline.add(
          showArrow(
            minArrowRef.current,
            i * TOTAL_BOX_SPACING + BOX_WIDTH * 0.25,
            ARROW_Y_OFFSET_DOWN,
            0.5,
          ),
        );
        mainTimeline.add(
          showArrow(
            jArrowRef.current,
            (i + 1) * TOTAL_BOX_SPACING + BOX_WIDTH * 0.75,
            ARROW_Y_OFFSET_DOWN,
            0.5,
          ),
          "-=0.5",
        );
      }

      // Highlight initial min element
      if (arrayElementsRef.current[i]) {
        mainTimeline.add(highlightRed(arrayElementsRef.current[i]!), "-=0.3");
      }

      // Show inner loop
      mainTimeline.call(() => setCurrentPseudoCodeLine(3));
      mainTimeline.add(animationPause(0.3));

      // Find minimum element
      for (let j = i + 1; j < n; j++) {
        if (j > i + 1) {
          mainTimeline.call(() => setCurrentPseudoCodeLine(3));
        }

        // Add step label
        mainTimeline.addLabel(`step-${stepIndex}`, "+=0.1");
        {
          const thisStep = stepIndex;
          mainTimeline.call(() => {
            currentStepRef.current = thisStep;
          });
        }
        stepIndex++;

        // Move j arrow
        if (jArrowRef.current && j != i + 1) {
          mainTimeline.add(
            moveArrow(
              jArrowRef.current,
              j * TOTAL_BOX_SPACING + BOX_WIDTH * 0.75,
              undefined,
              0.3,
            ),
            "+=0.2",
          );
        }

        mainTimeline.call(() => setCurrentPseudoCodeLine(4));

        // Remove highlight from previous j if not min
        if (
          j > i + 1 &&
          j - 1 !== minIndex &&
          arrayElementsRef.current[j - 1]
        ) {
          mainTimeline.add(
            removeHighlight(arrayElementsRef.current[j - 1]!),
            "-=0.4",
          );
        }

        // Highlight current j element
        if (j !== minIndex && arrayElementsRef.current[j]) {
          mainTimeline.add(
            highlightBlue(arrayElementsRef.current[j]!),
            "-=0.3",
          );
        }

        mainTimeline.add(animationPause(0.4));

        // Check for new minimum
        if (isAscending ? arr[j] < arr[minIndex] : arr[j] > arr[minIndex]) {
          mainTimeline.call(() => setCurrentPseudoCodeLine(5));
          const oldMinIndex = minIndex;
          minIndex = j;

          // Remove old min highlight
          if (oldMinIndex !== j && arrayElementsRef.current[oldMinIndex]) {
            mainTimeline.add(
              removeHighlight(arrayElementsRef.current[oldMinIndex]!),
              "-=0.1",
            );
          }

          // Move min arrow
          if (minArrowRef.current) {
            mainTimeline.add(
              moveArrow(
                minArrowRef.current,
                j * TOTAL_BOX_SPACING + BOX_WIDTH * 0.25,
                undefined,
                0.3,
              ),
              "+=0.2",
            );
          }

          // Highlight new minimum
          if (arrayElementsRef.current[j]) {
            mainTimeline.add(
              highlightRed(arrayElementsRef.current[j]!),
              "-=0.1",
            );
          }
        } else {
          // Keep current min highlighted
          if (arrayElementsRef.current[minIndex]) {
            mainTimeline.add(
              highlightRed(arrayElementsRef.current[minIndex]!),
              "-=0.2",
            );
          }
        }

        mainTimeline.add(animationPause(0.3));
      }

      // Remove highlight from last j
      const lastJ = n - 1;
      if (lastJ !== minIndex && arrayElementsRef.current[lastJ]) {
        mainTimeline.add(removeHighlight(arrayElementsRef.current[lastJ]!));
      }

      mainTimeline.call(() => setCurrentPseudoCodeLine(7));

      // Swap if needed
      if (minIndex !== i) {
        // Hide arrows
        if (minArrowRef.current && jArrowRef.current) {
          mainTimeline.add(hideArrow(minArrowRef.current, 0.5));
          mainTimeline.add(hideArrow(jArrowRef.current, 0.5), "-=0.5");
          mainTimeline.to([minArrowRef.current, jArrowRef.current], {
            opacity: 0,
            duration: 0,
          });
        }

        // Swap array values
        const temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;

        // Visual swap
        if (arrayElementsRef.current[i] && arrayElementsRef.current[minIndex]) {
          mainTimeline.add(
            eclipseSwap(
              arrayElementsRef,
              arrayElementsRef.current[i]!,
              arrayElementsRef.current[minIndex]!,
              ECLIPSE_HEIGHT,
              1.2,
              TOTAL_BOX_SPACING,
            ),
            "+=0.3",
          );
        }

        // Swap refs
        const tempRef = arrayElementsRef.current[i];
        arrayElementsRef.current[i] = arrayElementsRef.current[minIndex];
        arrayElementsRef.current[minIndex] = tempRef;

        if (arrayElementsRef.current[i]) {
          mainTimeline.add(removeHighlight(arrayElementsRef.current[i]!));
        }
        mainTimeline.add(animationPause(1.2));
      } else {
        // No swap needed
        if (minArrowRef.current && jArrowRef.current) {
          mainTimeline.add(hideArrow(minArrowRef.current, 0.5));
          mainTimeline.add(hideArrow(jArrowRef.current, 0.5), "-=0.5");
        }
        if (arrayElementsRef.current[i]) {
          mainTimeline.add(
            removeHighlight(arrayElementsRef.current[i]!),
            "-=0.2",
          );
        }
      }

      // Mark as sorted
      if (arrayElementsRef.current[i]) {
        mainTimeline.add(markAsSorted(arrayElementsRef.current[i]!));
      }
    }

    // Hide arrows at end
    if (minArrowRef.current && jArrowRef.current) {
      mainTimeline.add(hideArrow(minArrowRef.current, 0.5), "+=0.5");
      mainTimeline.add(hideArrow(jArrowRef.current, 0.5), "-=0.5");
    }

    mainTimeline.call(() => setCurrentPseudoCodeLine(9));

    // Final sorted animation
    const sortedElements = arrayElementsRef.current.filter(
      (el): el is HTMLDivElement => el !== null,
    );
    mainTimeline.add(markAsSorted(sortedElements), "-=0.5");

    totalStepsRef.current = stepIndex;
    mainTimeline.addLabel("end");

    mainTimeline.call(() => {
      wasPausedRef.current = false;
      setIsPlaying(false);
    });

    timelineRef.current = mainTimeline;
  };

  const nextStep = (): void => {
    if (!timelineRef.current) {
      playAnimation();
      // After playAnimation, check again if timeline was created
      if (!timelineRef.current) return;

      const timeline: gsap.core.Timeline = timelineRef.current;
      timeline.pause();
      currentStepRef.current = 0;
      timeline.play(`step-0`);
      currentStepRef.current = 1;
      timeline.addPause(`step-1`);
      wasPausedRef.current = true;
      return;
    }

    const timeline: gsap.core.Timeline = timelineRef.current;

    if (propsRef.current.isPlaying) {
      timeline.pause();
      currentStepRef.current++;
      const temp = propsRef.current.speed;
      timeline.timeScale(propsRef.current.speed * 4);
      timeline.play();
      timeline.addPause(`step-${currentStepRef.current}`, () => {
        setTimeout(() => {
          const tl: gsap.core.Timeline | null = timelineRef.current;
          if (tl) {
            tl.timeScale(temp);
            tl.play();
          }
          wasPausedRef.current = false;
        }, 0);
      });
    } else {
      if (currentStepRef.current <= totalStepsRef.current) {
        timeline.play();
        currentStepRef.current++;
        timeline.addPause(`step-${currentStepRef.current}`);
      } else {
        timeline.play();
        timeline.addPause("end");
      }
      wasPausedRef.current = true;
    }
  };

  const pauseAnimation = (): void => {
    if (timelineRef.current) {
      timelineRef.current.pause();
      wasPausedRef.current = true;
    }
  };

  const resetAnimation = (): void => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Reset all elements
    if (arrayElementsRef.current) {
      arrayElementsRef.current.forEach((element) => {
        if (element) resetElement(element);
      });

      // Restore original order
      const valueToElements: Map<number, HTMLDivElement[]> = new Map();
      arrayElementsRef.current.forEach((element) => {
        if (element) {
          const value = parseInt(element.textContent || "0");
          if (!valueToElements.has(value)) {
            valueToElements.set(value, []);
          }
          valueToElements.get(value)!.push(element);
        }
      });

      const originalOrder: (HTMLDivElement | null)[] = [];
      for (let i = 0; i < array.length; i++) {
        const value = array[i];
        const queue = valueToElements.get(value);
        if (queue && queue.length > 0) {
          originalOrder.push(queue.shift()!);
        } else {
          originalOrder.push(null);
        }
      }
      arrayElementsRef.current = originalOrder;
    }

    // Reset arrows
    if (minArrowRef.current && jArrowRef.current) {
      gsap.killTweensOf([minArrowRef.current, jArrowRef.current]);
      gsap.set([minArrowRef.current, jArrowRef.current], {
        opacity: 0,
        x: 0,
        y: 0,
        zIndex: "auto",
      });
    }

    wasPausedRef.current = false;
    currentStepRef.current = 0;
  };

  const previousStep = (): void => {
    if (!timelineRef.current) return;

    const timeline: gsap.core.Timeline = timelineRef.current;

    if (currentStepRef.current > 0) {
      currentStepRef.current--;
      const prevLabel =
        currentStepRef.current === 0
          ? "step-0"
          : `step-${currentStepRef.current}`;
      const temp = propsRef.current.speed;
      timeline.timeScale(propsRef.current.speed * 4);
      timeline.reverse();
      timeline.pause(prevLabel);
      timeline.timeScale(temp);
      wasPausedRef.current = true;

      if (propsRef.current.isPlaying) {
        setTimeout(() => {
          const tl: gsap.core.Timeline | null = timelineRef.current;
          if (tl) {
            tl.play();
          }
          wasPausedRef.current = false;
        }, 100);
      }
    }
  };

  // ============================================================================
  // CONTROL HANDLERS
  // ============================================================================

  const handlePlay = (): void => {
    setIsPlaying(true);
    playAnimation();
  };

  const handlePause = (): void => {
    setIsPlaying(false);
    pauseAnimation();
  };

  const handleReset = (): void => {
    setIsPlaying(false);
    resetAnimation();
  };

  const handleNextStep = (): void => {
    nextStep();
  };

  const handlePreviousStep = (): void => {
    previousStep();
  };

  const handleArrayChange = (newArray: number[]): void => {
    setArray(newArray);
    setIsPlaying(false);
    resetAnimation();
  };

  const handleArraySizeChange = (newSize: number): void => {
    setArraySize(newSize);
  };

  const handleSortOrderChange = (ascending: boolean): void => {
    setIsAscending(ascending);
    setIsPlaying(false);
    resetAnimation();
  };

  const handleSpeedChange = (newSpeed: number): void => {
    setSpeed(newSpeed);
  };

  const handleToggleCodePanel = () => {
    setShowCodePanel(!showCodePanel);
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    propsRef.current = { array, speed, isAscending, isPlaying };
    if (timelineRef.current) {
      timelineRef.current.timeScale(speed);
    }
  }, [array, speed, isAscending, isPlaying]);

  useEffect(() => {
    arrayElementsRef.current = arrayElementsRef.current.slice(0, array.length);
  }, [array]);

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div>
      {/* Animation Container */}
      <div className="mb-8">
        <div
          ref={containerRef}
          className="selection-sort-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            padding: "2rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#1a1a1a",
            minHeight: "400px",
            zIndex: 0,
          }}
        >
          {/* Array Elements */}
          <div
            className="array-container"
            style={{
              display: "flex",
              gap: `${BOX_GAP}px`,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {array.map((value, index) => (
              <div
                key={`${index}-${value}`}
                ref={(el) => {
                  arrayElementsRef.current[index] = el;
                }}
                className={`array-element array-element-${index}`}
                style={{
                  width: `${BOX_WIDTH}px`,
                  height: `${BOX_HEIGHT}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8f9fa",
                  border: "2px solid #e9ecef",
                  borderRadius: `${BOX_BORDER_RADIUS}px`,
                  fontSize: `${BOX_FONT_SIZE}px`,
                  fontWeight: "600",
                  color: "#212529",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  zIndex: 2,
                }}
              >
                {value}
              </div>
            ))}

            {/* Min Arrow */}
            <div
              ref={minArrowRef}
              className="min-arrow"
              style={{
                position: "absolute",
                left: "0px",
                top: "0px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: 0,
                transform: "translateX(-50%)",
              }}
            >
              <div
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: `${ARROW_SIZE}px solid transparent`,
                  borderRight: `${ARROW_SIZE}px solid transparent`,
                  borderBottom: "20px solid #dc3545",
                }}
              />
              <div
                style={{
                  fontSize: `${ARROW_FONT_SIZE}px`,
                  fontWeight: "600",
                  color: "#dc3545",
                  marginTop: "4px",
                }}
              >
                {isAscending ? "min" : "max"}
              </div>
            </div>

            {/* J Arrow */}
            <div
              ref={jArrowRef}
              className="j-arrow"
              style={{
                position: "absolute",
                left: "0px",
                top: "0px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: 0,
                transform: "translateX(-50%)",
              }}
            >
              <div
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: `${ARROW_SIZE}px solid transparent`,
                  borderRight: `${ARROW_SIZE}px solid transparent`,
                  borderBottom: "20px solid #0d6efd",
                }}
              />
              <div
                style={{
                  fontSize: `${ARROW_FONT_SIZE}px`,
                  fontWeight: 600,
                  color: "#0d6efd",
                  marginTop: "4px",
                }}
              >
                j
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <SortingControls
        limit={150}
        isOpen={isOpen}
        width={width}
        array={array}
        arraySize={arraySize}
        isAscending={isAscending}
        speed={speed}
        isPlaying={isPlaying}
        onArrayChange={handleArrayChange}
        onArraySizeChange={handleArraySizeChange}
        onSortOrderChange={handleSortOrderChange}
        onSpeedChange={handleSpeedChange}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onNextStep={handleNextStep}
        onPreviousStep={handlePreviousStep}
        showCodePanel={showCodePanel}
        onToggleCodePanel={handleToggleCodePanel}
        currentLine={currentPseudoCodeLine}
        tabTitles={[...tabTitles]}
        showPseudoCode={showPseudoCode}
        pseudoCode={pseudoCode}
      />
    </div>
  );
};

export default SelectionSort;
