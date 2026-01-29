"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import SortingControls from "./SortingControl";
import {
  slideElementTo,
  markAsSorted,
  showArrow,
  hideArrow,
  resetElement,
  pause as animationPause,
  scaleSwap,
  highlightBoxes,
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
      BOX_GAP: 14,
      BOX_BORDER_RADIUS: 12,
      BOX_FONT_SIZE: 20,
      ARROW_SIZE: 8,
      ARROW_FONT_SIZE: 16,
      TOTAL_BOX_SPACING: 80 + 14,
      ARROW_Y_OFFSET_DOWN: (80 * 2.4) / 2,
      ARROW_X_OFFSET: 80 / 2,
      ARROW_X_OFFSET2: 80 / 2 - 15,
      IMAGE_HEIGHT: 260,
      IMAGE_WIDTH: 260,
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
      TOTAL_BOX_SPACING: 55 + 10,
      ARROW_Y_OFFSET_DOWN: (55 * 2.4) / 2,
      ARROW_X_OFFSET: 55 / 2,
      ARROW_X_OFFSET2: 55 / 2 - 15,
      IMAGE_HEIGHT: 200,
      IMAGE_WIDTH: 200,
    };
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

const BubbleSort: React.FC<SidebarProps> = ({ isOpen, width }) => {
  // Fixed initial array to prevent hydration mismatch
  const getFixedInitialArray = () => [42, 17, 89, 31, 65, 8];
  const initialArray = getFixedInitialArray();

  // State management
  const [array, setArray] = useState<number[]>(initialArray);
  const [arraySize, setArraySize] = useState<number>(6);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepDescription, setStepDescription] =
    useState<string>("Initial state");
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [currentPseudoCodeLine, setCurrentPseudoCodeLine] = useState<number>(0);

  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const arrayElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const iArrowRef = useRef<HTMLDivElement>(null);
  const jArrowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const wasPausedRef = useRef<boolean>(false);
  const propsRef = useRef({ array, speed, isAscending, isPlaying });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const currentStepRef = useRef<number>(0);
  const totalStepsRef = useRef<number>(0);

  // Pseudo code configuration
  const tabTitles = ["Bubble Sort"] as const;
  const showPseudoCode = 0;
  const pseudoCode = [
    [
      "for i ← 0 to (size - 1) do",
      "",
      "   for j ← 0 to (size - i - 2) do",
      "",
      "        if array[j] > array[j + 1] then",
      "            swap array[j] and array[j + 1]",
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
    TOTAL_BOX_SPACING,
    ARROW_Y_OFFSET_DOWN,
    ARROW_X_OFFSET,
    ARROW_X_OFFSET2,
    IMAGE_HEIGHT,
    IMAGE_WIDTH,
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
      setStepDescription("Initial state - ready to begin sorting");
    });

    // Show arrows
    if (iArrowRef.current && jArrowRef.current) {
      if (arrayElementsRef.current[0] && arrayElementsRef.current[1]) {
        mainTimeline.add(
          showArrow(
            iArrowRef.current,
            ARROW_X_OFFSET,
            ARROW_Y_OFFSET_DOWN,
            0.5,
          ),
        );
        mainTimeline.add(
          showArrow(
            jArrowRef.current,
            ARROW_X_OFFSET2 + TOTAL_BOX_SPACING,
            ARROW_Y_OFFSET_DOWN,
            0.5,
          ),
          "-=0.5",
        );
      }
    }

    let stepIndex = 1;

    // Bubble sort algorithm
    for (let i = 0; i < n - 1; i++) {
      if (i > 0) {
        mainTimeline.call(() => setCurrentPseudoCodeLine(0));
        mainTimeline.add(animationPause(0.3));
      }

      // Reset arrows to start position
      if (iArrowRef.current && jArrowRef.current && i !== 0) {
        mainTimeline.add(
          slideElementTo(
            jArrowRef.current,
            TOTAL_BOX_SPACING + ARROW_X_OFFSET2,
            `+=0`,
            0.3,
          ),
          "+=0.2",
        );
        mainTimeline.add(
          slideElementTo(iArrowRef.current, ARROW_X_OFFSET, `+=0`, 0.3),
          "-=0.3",
        );
        if (bubbleRef.current) {
          mainTimeline.add(
            gsap.to(bubbleRef.current, { x: 0, y: 0, duration: 0.2 }),
            "-=0.2",
          );
        }
      }

      mainTimeline.call(() => setCurrentPseudoCodeLine(2));
      mainTimeline.add(animationPause(0.3));

      // Inner loop - comparisons
      for (let j = 0; j < n - i - 1; j++) {
        if (j > 0) {
          mainTimeline.call(() => setCurrentPseudoCodeLine(2));
          mainTimeline.add(animationPause(0.2));
        }

        // Add step label
        const thisStep = stepIndex;
        mainTimeline.addLabel(`step-${thisStep}`, "+=0");
        mainTimeline.call(() => {
          currentStepRef.current = thisStep;
          setCurrentPseudoCodeLine(4);
          const currentJValue =
            arrayElementsRef.current[j]?.textContent || arr[j];
          const currentJPlusOneValue =
            arrayElementsRef.current[j + 1]?.textContent || arr[j + 1];
          setStepDescription(
            `Comparing elements ${currentJValue} and ${currentJPlusOneValue}`,
          );
        });
        stepIndex++;

        // Highlight comparison elements
        mainTimeline.add(
          highlightBoxes(arrayElementsRef, [j, j + 1], "high"),
          "+=0.2",
        );

        // Check if swap is needed
        const shouldSwap = isAscending
          ? arr[j] > arr[j + 1]
          : arr[j] < arr[j + 1];

        if (shouldSwap) {
          mainTimeline.call(() => setCurrentPseudoCodeLine(5));

          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          // Animate the swap
          if (arrayElementsRef.current[j] && arrayElementsRef.current[j + 1]) {
            const leftElement = arrayElementsRef.current[j];
            const rightElement = arrayElementsRef.current[j + 1];

            if (leftElement && rightElement) {
              mainTimeline.add(
                scaleSwap(
                  arrayElementsRef,
                  leftElement,
                  rightElement,
                  0.8,
                  TOTAL_BOX_SPACING,
                ),
                "+=0.2",
              );
            }
            // mainTimeline.call(() => {
            const temp = arrayElementsRef.current[j];
            arrayElementsRef.current[j] = arrayElementsRef.current[j + 1];
            arrayElementsRef.current[j + 1] = temp;
            // });

            mainTimeline.add(animationPause(0.5));

            // Update description after swap
            mainTimeline.call(() => {
              const currentJValue =
                arrayElementsRef.current[j]?.textContent || arr[j];
              const currentJPlusOneValue =
                arrayElementsRef.current[j + 1]?.textContent || arr[j + 1];
              setStepDescription(
                `Swapped elements ${currentJPlusOneValue} and ${currentJValue} exchanged`,
              );
            });
          }
        } else {
          // Update description when no swap occurs
          mainTimeline.call(() => {
            const currentJValue =
              arrayElementsRef.current[j]?.textContent || arr[j];
            const currentJPlusOneValue =
              arrayElementsRef.current[j + 1]?.textContent || arr[j + 1];
            setStepDescription(
              `No swap needed: ${currentJValue} and ${currentJPlusOneValue} are in correct order`,
            );
          });
        }

        // Move arrows to next position
        if (iArrowRef.current && jArrowRef.current && j < n - i - 2) {
          mainTimeline.add(
            slideElementTo(
              iArrowRef.current,
              `+=${TOTAL_BOX_SPACING}`,
              `+=0`,
              0.3,
            ),
            "+=0.5",
          );

          mainTimeline.add(
            slideElementTo(
              jArrowRef.current,
              `+=${TOTAL_BOX_SPACING}`,
              `+=0`,
              0.3,
            ),
            "-=0.3",
          );

          if (bubbleRef.current) {
            mainTimeline.add(
              slideElementTo(
                bubbleRef.current,
                `+=${TOTAL_BOX_SPACING}`,
                0,
                0.3,
              ),
              "-=0.3",
            );
          }
        }
      }

      // Mark the last element as sorted
      const sortedIndex = n - 1 - i;
      mainTimeline.add(animationPause(0.5));
      const thisStep = stepIndex;
      mainTimeline.addLabel(`step-${thisStep}`, "+=0");
      mainTimeline.call(() => {
        currentStepRef.current = thisStep;
        setStepDescription(
          `Element at position ${sortedIndex} (${arr[sortedIndex]}) is now in its final sorted position`,
        );
      });

      if (arrayElementsRef.current[sortedIndex]) {
        mainTimeline.add(
          markAsSorted(arrayElementsRef.current[sortedIndex]!),
          "+=0",
        );
      }
      stepIndex++;
    }

    // Mark first element as sorted
    const thisStep = stepIndex;
    mainTimeline.addLabel(`step-${thisStep}`);
    mainTimeline.call(() => {
      currentStepRef.current = thisStep;
      setStepDescription(
        `Element at position 0 (${arr[0]}) is now in its final sorted position`,
      );
    });

    if (arrayElementsRef.current[0]) {
      mainTimeline.add(markAsSorted(arrayElementsRef.current[0]!), "+=0.3");
    }

    // Hide arrows
    if (iArrowRef.current && jArrowRef.current) {
      mainTimeline.add(hideArrow(iArrowRef.current, 0.5), "+=0.5");
      mainTimeline.add(hideArrow(jArrowRef.current, 0.5), "-=0.5");
    }

    // Final return statement
    mainTimeline.call(() => setCurrentPseudoCodeLine(7));

    totalStepsRef.current = stepIndex;
    mainTimeline.addLabel("end");

    mainTimeline.call(() => {
      setStepDescription("Sorting completed! All elements are in sorted order");
      wasPausedRef.current = false;
      setIsPlaying(false);
    });

    timelineRef.current = mainTimeline;
  };

  const nextStep = (): void => {
    if (!timelineRef.current) {
      playAnimation();
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
      const originalOrder: (HTMLDivElement | null)[] = new Array(
        array.length,
      ).fill(null);
      const used = new Array(array.length).fill(false);

      arrayElementsRef.current.forEach((element) => {
        if (element) {
          const value = parseInt(element.textContent || "0");
          for (let i = 0; i < array.length; i++) {
            if (!used[i] && array[i] === value) {
              originalOrder[i] = element;
              used[i] = true;
              break;
            }
          }
        }
      });
      arrayElementsRef.current = originalOrder;
    }

    // Reset arrows
    if (iArrowRef.current && jArrowRef.current) {
      gsap.killTweensOf([iArrowRef.current, jArrowRef.current]);
      gsap.set([iArrowRef.current, jArrowRef.current], {
        opacity: 0,
        x: 0,
        y: 0,
        zIndex: "auto",
      });
    }

    // Reset bubble image
    if (bubbleRef.current) {
      gsap.killTweensOf(bubbleRef.current);
      gsap.set(bubbleRef.current, {
        x: 0,
        y: 0,
        opacity: 0.8,
      });
    }

    wasPausedRef.current = false;
    currentStepRef.current = 0;
    setStepDescription("Initial state - ready to begin sorting");
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
          className="bubble-sort-container"
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
            <div
              ref={bubbleRef}
              style={{
                position: "absolute",
                top: `${-IMAGE_HEIGHT * 0.34}px`,
                left: `${ARROW_X_OFFSET * 1.1 + BOX_WIDTH / 2}px`,
                transform: "translateX(-50%)",
                width: `${IMAGE_WIDTH}px`,
                height: `${IMAGE_HEIGHT}px`,
                opacity: 0.8,
                zIndex: -1,
              }}
            >
              <Image
                src="/Images/Bubble.png"
                alt="swap indicator"
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                style={{ objectFit: "contain" }}
              />
            </div>
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

            {/* i Arrow (j) */}
            <div
              ref={iArrowRef}
              className="i-arrow"
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

            {/* j Arrow (j+1) */}
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
                  borderBottom: "20px solid #fd7e14",
                }}
              />
              <div
                style={{
                  fontSize: `${ARROW_FONT_SIZE}px`,
                  fontWeight: "600",
                  color: "#fd7e14",
                  marginTop: "4px",
                }}
              >
                j + 1
              </div>
            </div>
          </div>

          {/* Step Description */}
        </div>
        <div
          className="step-description"
          style={{
            minHeight: "40px",
            fontSize: "16px",
            fontWeight: "500",
            textAlign: "center",
            marginBottom: "5rem",
            color: "#495057",
          }}
        >
          {stepDescription}
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

export default BubbleSort;
