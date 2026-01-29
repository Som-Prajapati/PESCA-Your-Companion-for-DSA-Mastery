"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Controls from "../../extras/Control";
import SortingControls from "./SortingControl";
import {
  highlightDigit,
  removeDigitHighlight,
  updateDigitPlaceIndicator,
  removeDigitPlaceIndicator,
  highlightBucketDash,
  removeBucketDashHighlight,
  showBucketDashes,
  hideBucketDashes,
  moveElementToBucket,
  moveElementsFromBucketsToArray,
  updatePseudoCodeLine,
  switchToTab,
  getDigitAtPlace,
  getMaxDigits,
  markAsSorted,
  resetElement,
  pause,
} from "@/lib/animations";
// import { markAsSorted, resetElement, pause } from "./animationLibrary";

const getDynamicSizing = (arrayLength: number) => {
  if (arrayLength <= 9) {
    return {
      BOX_WIDTH: 80,
      BOX_HEIGHT: 50,
      BOX_GAP: 16,
      BOX_BORDER_RADIUS: 10,
      BOX_FONT_SIZE: 20,
      ARROW_SIZE: 8,
      ARROW_FONT_SIZE: 16,
      ECLIPSE_HEIGHT: 80,
      TOTAL_BOX_SPACING: 80 + 16,
      ARROW_Y_OFFSET_DOWN: (80 * 2.4) / 2,
      ARROW_X_OFFSET: 80 / 2,
      BUCKET_WIDTH: 60,
      BUCKET_HEIGHT: 200,
      BUCKET_GAP: 10,
      BUCKET_LABEL_HEIGHT: 25,
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
      ARROW_X_OFFSET: 55 / 2,
      BUCKET_WIDTH: 45,
      BUCKET_HEIGHT: 150,
      BUCKET_GAP: 8,
      BUCKET_LABEL_HEIGHT: 20,
    };
  }
};

interface SidebarProps {
  isOpen: boolean;
  width: number;
}

const RadixSort: React.FC<SidebarProps> = ({ isOpen, width }: SidebarProps) => {
  console.log(isOpen, width);
  const getFixedInitialArray = () => [170, 451, 752, 903, 204, 802, 214, 656];
  const initialArray = getFixedInitialArray();

  // State management
  const [array, setArray] = useState<number[]>(initialArray);
  const [arraySize, setArraySize] = useState<number>(8);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPseudoCodeLine, setCurrentPseudoCodeLine] = useState<
    number | number[]
  >(0);
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [showPseudoCode, setShowPseudoCode] = useState(0);

  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const arrayElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bucketContainerRef = useRef<HTMLDivElement | null>(null);
  const bucketElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentElementArrowRef = useRef<HTMLDivElement>(null);
  const digitPlaceIndicatorRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const wasPausedRef = useRef<boolean>(false);
  const propsRef = useRef({ array, speed, isAscending, isPlaying });
  const stepDigitPlaceRef = useRef<Map<number, number>>(new Map());
  const currentStepRef = useRef<number>(0);
  const totalStepsRef = useRef<number>(0);
  const highlightStateRef = useRef<
    Map<number, { elementIndex: number; digitPlace: number }>
  >(new Map());

  const tabTitles = ["RadixSort", "CountingSortByDigit"] as const;
  const pseudoCode = [
    [
      "RadixSort(array, size):",
      "",
      "   maxElement ← maximum value in array",
      "   exp ← 1",
      "",
      "   while (maxElement / exp) > 0 do",
      "       CountingSortByDigit(array, size, exp)",
      "       exp ← exp * 10",
      "",
      "return array",
    ],
    [
      "CountingSortByDigit(array, size, exp):",
      "",
      "   output[size]",
      "   count[10] ← all zeros",
      "",
      "   for i ← 0 to (size - 1) do",
      "       index ← (array[i] / exp) mod 10",
      "       count[index] ← count[index] + 1",
      "",
      "   for i ← 1 to 9 do",
      "       count[i] ← count[i] + count[i - 1]",
      "",
      "   for i ← (size - 1) to 0 do",
      "       index ← (array[i] / exp) mod 10",
      "       output[count[index] - 1] ← array[i]",
      "       count[index] ← count[index] - 1",
      "",
      "   for i ← 0 to (size - 1) do",
      "       array[i] ← output[i]",
      "",
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
  } = dynamicSizing;

  const TOP_OFFSET = BOX_HEIGHT * 4;
  const BOTTOM_OFFSET = BOX_HEIGHT * 2;

  const playAnimation = (): void => {
    if (wasPausedRef.current && timelineRef.current) {
      timelineRef.current.play();
      wasPausedRef.current = false;
      return;
    }

    resetAnimation();
    stepDigitPlaceRef.current.clear();

    const arr = [...array];
    const maxDigits = getMaxDigits(arr);
    const mainTimeline = gsap.timeline();
    mainTimeline.timeScale(propsRef.current.speed);
    currentStepRef.current = 0;

    let stepIndex = 0;

    // Add initial label
    mainTimeline.addLabel("step-0");
    mainTimeline.call(() => {
      currentStepRef.current = 0;
    });
    mainTimeline.call(() => {
      stepDigitPlaceRef.current.set(0, 0);
    });

    // Highlight the first line of RadixSort
    mainTimeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        [2, 3],
        0,
        showPseudoCode,
      ),
      "+=0.1",
    );
    stepIndex++;

    // Move all elements to the top initially
    const elements = arrayElementsRef.current;
    if (elements) {
      mainTimeline.fromTo(
        elements,
        { y: 0 },
        {
          y: -TOP_OFFSET,
          duration: 0.5,
          ease: "power1.inOut",
          stagger: 0.1,
        },
        0,
      );
    }

    // Show bucket dashes initially
    mainTimeline.add(showBucketDashes(bucketContainerRef, BOTTOM_OFFSET));

    // Process each digit place (ones, tens, hundreds, etc.)
    for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      // Highlight while condition (line 5)
      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          5,
          0,
          showPseudoCode,
        ),
        "+=0.3",
      );

      // Update digit place indicator
      mainTimeline.add(
        updateDigitPlaceIndicator(digitPlaceIndicatorRef, digitPlace),
        "+=0.2",
      );

      // Highlight CountingSortByDigit call (line 6) and switch to CountingSortByDigit tab
      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          6,
          0,
          showPseudoCode,
        ),
        "+=0.2",
      );
      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          0,
          1,
          showPseudoCode,
        ),
        "+=0.3",
      );

      // Add step label for digit place start
      mainTimeline.addLabel(`step-${stepIndex}`, "+=0.1");
      {
        const thisStep = stepIndex;
        mainTimeline.call(() => {
          currentStepRef.current = thisStep;
        });
        mainTimeline.call(() => {
          stepDigitPlaceRef.current.set(thisStep, digitPlace);
        });
      }
      stepIndex++;

      // Initialize count array (line 3 in CountingSortByDigit)
      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          [2, 3],
          1,
          showPseudoCode,
        ),
        "+=0.3",
      );

      // PHASE 1: Count occurrences of each digit
      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          5,
          1,
          showPseudoCode,
        ),
        "+=0.5",
      );

      const buckets: HTMLElement[][] = Array.from({ length: 10 }, () => []);

      for (let i = 0; i < arr.length; i++) {
        const element = arrayElementsRef.current[i];
        if (!element) continue;

        const digit = getDigitAtPlace(arr[i], digitPlace);
        buckets[digit].push(element);

        // Add step label for each element distribution
        mainTimeline.addLabel(`step-${stepIndex}`, "+=0.1");
        {
          const thisStep = stepIndex;
          mainTimeline.call(() => {
            currentStepRef.current = thisStep;
          });
          mainTimeline.call(() => {
            stepDigitPlaceRef.current.set(thisStep, digitPlace);
          });
        }
        stepIndex++;

        // Highlight digit extraction
        mainTimeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            6,
            1,
            showPseudoCode,
          ),
          "+=0.1",
        );

        // Highlight and animate to bucket
        mainTimeline.add(highlightDigit(element, digitPlace), ">");
        mainTimeline.add(
          highlightBucketDash(bucketElementsRef, digit),
          "-=0.1",
        );

        mainTimeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            7,
            1,
            showPseudoCode,
          ),
          "+=0.1",
        );

        const stackPosition = buckets[digit].length - 1;
        mainTimeline.add(
          moveElementToBucket(
            containerRef,
            bucketElementsRef,
            element,
            digit,
            stackPosition,
            BOX_WIDTH,
            BOX_HEIGHT,
            BOTTOM_OFFSET,
            0.8,
          ),
          "+=0.3",
        );

        mainTimeline.add(
          removeBucketDashHighlight(bucketElementsRef, digit),
          "-=0.4",
        );
        mainTimeline.add(pause(0.2));
      }

      // Transform count array to cumulative
      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          [9, 10],
          1,
          showPseudoCode,
        ),
        "+=0.3",
      );
      mainTimeline.add(pause(0.3));

      // PHASE 2: Collect from buckets back to array
      const newOrder: number[] = [];
      const newElementOrder: (HTMLDivElement | null)[] = [];
      let collectElements: HTMLDivElement[] = [];

      if (propsRef.current.isAscending) {
        for (let bucket = 0; bucket < 10; bucket++) {
          buckets[bucket].forEach((element) => {
            collectElements.push(element as HTMLDivElement);
          });
        }
      } else {
        for (let bucket = 9; bucket >= 0; bucket--) {
          buckets[bucket].forEach((element) => {
            collectElements.push(element as HTMLDivElement);
          });
        }
      }

      for (let i = 0; i < collectElements.length; i++) {
        const element = collectElements[i];
        const value = parseInt(element.textContent || "0");
        newOrder.push(value);
        newElementOrder.push(element as HTMLDivElement);
      }

      // Update array state
      for (let i = 0; i < newOrder.length; i++) {
        arr[i] = newOrder[i];
      }
      arrayElementsRef.current = newElementOrder;

      // Add step label for collection phase
      mainTimeline.addLabel(`step-${stepIndex}`, "+=0.1");
      {
        const thisStep = stepIndex;
        mainTimeline.call(() => {
          currentStepRef.current = thisStep;
        });
        mainTimeline.call(() => {
          stepDigitPlaceRef.current.set(thisStep, digitPlace);
        });
      }
      stepIndex++;

      // Highlight lines 12-15 for each element being collected
      for (let i = 0; i < collectElements.length; i++) {
        mainTimeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            12,
            1,
            showPseudoCode,
          ),
        );
        mainTimeline.add(pause(0.15));

        mainTimeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            13,
            1,
            showPseudoCode,
          ),
        );
        mainTimeline.add(pause(0.15));

        mainTimeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            14,
            1,
            showPseudoCode,
          ),
        );
        mainTimeline.add(pause(0.15));

        mainTimeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            15,
            1,
            showPseudoCode,
          ),
        );
        mainTimeline.add(pause(0.15));
      }

      // Move elements from buckets to array
      mainTimeline.add(
        gsap
          .timeline()
          .add(
            moveElementsFromBucketsToArray(
              containerRef,
              buckets,
              BOX_WIDTH,
              BOX_HEIGHT,
              1.2,
              propsRef.current.isAscending,
            ),
          ),
        "-=5",
      );

      // Remove all digit highlights
      for (let i = 0; i < arr.length; i++) {
        const element = arrayElementsRef.current[i];
        if (!element) continue;
        mainTimeline.add(removeDigitHighlight(element), "+=0.1");
      }

      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          [17, 18],
          1,
          showPseudoCode,
        ),
        "+=0.3",
      );

      mainTimeline.add(pause(1.0));
      mainTimeline.add(switchToTab(setShowPseudoCode, 0), "+=0.2");
      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          7,
          0,
          showPseudoCode,
        ),
        "+=0.3",
      );
    }

    // Final cleanup
    mainTimeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        9,
        0,
        showPseudoCode,
      ),
      "+=0.2",
    );
    mainTimeline.add(
      hideBucketDashes(bucketContainerRef, BOTTOM_OFFSET),
      "+=0.2",
    );
    mainTimeline.add(
      removeDigitPlaceIndicator(digitPlaceIndicatorRef),
      "+=0.1",
    );
    mainTimeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        9,
        0,
        showPseudoCode,
      ),
      "+=0.3",
    );

    mainTimeline.add(
      markAsSorted(
        [...Array(arr.length).keys()].map((i) => arrayElementsRef.current[i]!),
      ),
      "-=0.1",
    );

    // Set total steps and add end label
    totalStepsRef.current = stepIndex - 1;
    currentStepRef.current = 0;
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
      if (timelineRef.current) {
        (timelineRef.current as gsap.core.Timeline).pause();
        currentStepRef.current = 0;
        (timelineRef.current as gsap.core.Timeline).play(`step-${0}`);
        currentStepRef.current = 1;
        (timelineRef.current as gsap.core.Timeline).addPause(`step-${1}`);
        wasPausedRef.current = true;
      }
      return;
    }

    if (propsRef.current.isPlaying) {
      (timelineRef.current as gsap.core.Timeline).pause();
      currentStepRef.current++;

      const temp = propsRef.current.speed;
      timelineRef.current!.timeScale(propsRef.current.speed * 4);
      (timelineRef.current as gsap.core.Timeline).play();
      (timelineRef.current as gsap.core.Timeline).addPause(
        `step-${currentStepRef.current}`,
        () => {
          setTimeout(() => {
            if (timelineRef.current) {
              timelineRef.current.timeScale(temp);
              timelineRef.current.play();
            }
            wasPausedRef.current = false;
          }, 0);
        },
      );
    } else {
      if (currentStepRef.current <= totalStepsRef.current) {
        (timelineRef.current as gsap.core.Timeline).play();
        currentStepRef.current++;
        (timelineRef.current as gsap.core.Timeline).addPause(
          `step-${currentStepRef.current}`,
        );
      } else {
        (timelineRef.current as gsap.core.Timeline).play();
        (timelineRef.current as gsap.core.Timeline).addPause("end");
      }
      wasPausedRef.current = true;
    }
  };

  const previousStep = (): void => {
    if (!timelineRef.current) return;

    if (currentStepRef.current > 0) {
      currentStepRef.current--;
      const prevLabel =
        currentStepRef.current === 0
          ? "step-0"
          : `step-${currentStepRef.current}`;
      const temp = propsRef.current.speed;
      timelineRef.current.timeScale(propsRef.current.speed * 4);

      timelineRef.current.reverse();
      timelineRef.current.pause(prevLabel);
      if (timelineRef.current) {
        timelineRef.current.timeScale(temp);
      }
      wasPausedRef.current = true;
      if (propsRef.current.isPlaying) {
        setTimeout(() => {
          if (timelineRef.current) {
            timelineRef.current.play();
          }
          wasPausedRef.current = false;
        }, 100);
      }
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

    if (arrayElementsRef.current) {
      arrayElementsRef.current.forEach((element) => {
        if (element) {
          // Use resetElement from animation library
          resetElement(element);
          element.innerHTML = element.textContent || "0";
        }
      });

      // Restore original array order
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

    if (bucketContainerRef.current) {
      gsap.set(bucketContainerRef.current, { opacity: 0, y: 0 });
    }

    bucketElementsRef.current.forEach((bucketElement) => {
      if (bucketElement) {
        const dashElement = bucketElement.querySelector(
          ".bucket-dash",
        ) as HTMLElement;
        if (dashElement) {
          gsap.set(dashElement, { backgroundColor: "#6c757d", scaleY: 1 });
        }
      }
    });

    if (digitPlaceIndicatorRef.current) {
      gsap.set(digitPlaceIndicatorRef.current, { opacity: 0, y: 0 });
      digitPlaceIndicatorRef.current.textContent = "";
    }

    wasPausedRef.current = false;
    currentStepRef.current = 0;
    highlightStateRef.current.clear();
    stepDigitPlaceRef.current.clear();
  };

  // Control handlers
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

  // Effects
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

  return (
    <div>
      {/* Animation Container */}
      <div className="mb-8">
        <div
          ref={containerRef}
          className="radix-sort-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            padding: "2rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#1a1a1a",
            minHeight: "600px",
            zIndex: 0,
          }}
        >
          {/* Digit Place Indicator */}
          <div
            ref={digitPlaceIndicatorRef}
            className="digit-place-indicator"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#495057",
              opacity: 0,
              position: "absolute",
              top: "17%",
            }}
          ></div>

          {/* Array Elements */}
          <div
            className="array-container"
            style={{
              display: "flex",
              gap: `${BOX_GAP}px`,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 2,
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
                  zIndex: 3,
                }}
              >
                {value}
              </div>
            ))}

            {/* Current Element Arrow */}
            <div
              ref={currentElementArrowRef}
              className="current-element-arrow"
              style={{
                position: "absolute",
                left: "0px",
                top: "0px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity: 0,
                transform: "translateX(-50%)",
                zIndex: 4,
              }}
            >
              <div
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: `${ARROW_SIZE}px solid transparent`,
                  borderRight: `${ARROW_SIZE}px solid transparent`,
                  borderBottom: "20px solid #28a745",
                }}
              />
              <div
                style={{
                  fontSize: `${ARROW_FONT_SIZE}px`,
                  fontWeight: "600",
                  color: "#28a745",
                  marginTop: "4px",
                }}
              >
                current
              </div>
            </div>
          </div>

          {/* Buckets Container */}
          <div
            ref={bucketContainerRef}
            className="buckets-container"
            style={{
              display: "flex",
              gap: `${dynamicSizing.BUCKET_GAP}px`,
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              marginTop: "4rem",
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <div
                key={`bucket-${digit}`}
                ref={(el) => {
                  bucketElementsRef.current[digit] = el;
                }}
                className={`bucket bucket-${digit}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="bucket-dash"
                  style={{
                    width: `${BOX_WIDTH}px`,
                    height: "4px",
                    backgroundColor: "#6c757d",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    marginBottom: "8px",
                  }}
                />
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  {digit}
                </div>
              </div>
            ))}
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

export default RadixSort;
