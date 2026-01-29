"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import SortingControls from "./SortingControl";
import {
  slideElementTo,
  highlightElementWithScale,
  fadeOutWithScale,
  bounceScale,
  resetElementsToBase,
  fadeOutStagger,
} from "@/lib/animations";

const getDynamicSizing = (arrayLength: number) => {
  if (arrayLength <= 9) {
    return {
      BOX_WIDTH: 80,
      BOX_HEIGHT: 80,
      BOX_GAP: 16,
      BOX_BORDER_RADIUS: 10,
      BOX_FONT_SIZE: 20,
      ARROW_SIZE: 8,
      ARROW_FONT_SIZE: 16,
      ECLIPSE_HEIGHT: 80,
      TOTAL_BOX_SPACING: 80 + 16,
      ARROW_Y_OFFSET_DOWN: (80 * 2.4) / 2,
      ARROW_X_OFFSET: 80 / 2,
      COUNT_WIDTH: 60,
      COUNT_HEIGHT: 40,
      COUNT_GAP: 10,
      COUNT_LABEL_HEIGHT: 25,
      COUNT_SET_X: (80 - 60) / 2,
      COUNT_SET_Y: -90,
      ARRAY_OFFSET_Y:
        typeof window !== "undefined" ? window.innerHeight * 0.3 : 150,
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
      COUNT_WIDTH: 45,
      COUNT_HEIGHT: 35,
      COUNT_GAP: 8,
      COUNT_LABEL_HEIGHT: 20,
      ARRAY_OFFSET_Y: "30vh",
      COUNT_SET_X: (80 - 60) / 2,
      COUNT_SET_Y: -30,
    };
  }
};

interface SidebarProps {
  isOpen: boolean;
  width: number;
}

const CountSort: React.FC<SidebarProps> = ({ isOpen, width }: SidebarProps) => {
  const getFixedInitialArray = () => [4, 2, 2, 8, 3, 3, 1];
  const initialArray = getFixedInitialArray();

  // State management
  const [array, setArray] = useState<number[]>(initialArray);
  const [arraySize, setArraySize] = useState<number>(7);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const arrayElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const countElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const countElementsIndexRef = useRef<(HTMLDivElement | null)[]>([]);
  const countLabelRef = useRef<HTMLDivElement>(null);
  const currentElementArrowRef = useRef<HTMLDivElement>(null);
  const stepIndicatorRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const wasPausedRef = useRef<boolean>(false);
  const propsRef = useRef({ array, speed, isAscending, isPlaying });
  const currentStepRef = useRef<number>(0);
  const totalStepsRef = useRef<number>(0);

  const dynamicSizing = getDynamicSizing(array.length);
  const {
    BOX_WIDTH,
    BOX_HEIGHT,
    BOX_GAP,
    BOX_BORDER_RADIUS,
    BOX_FONT_SIZE,
    ARROW_SIZE,
    ARROW_FONT_SIZE,
    ARROW_X_OFFSET,
    ARROW_Y_OFFSET_DOWN,
    TOTAL_BOX_SPACING,
    COUNT_WIDTH,
    COUNT_HEIGHT,
    COUNT_GAP,
    ARRAY_OFFSET_Y,
    COUNT_SET_X,
    COUNT_SET_Y,
  } = dynamicSizing;

  const getMaxValue = (arr: number[]): number => {
    return Math.max(...arr);
  };

  // Count-specific animations
  const highlightCountElement = (countIndex: number): gsap.core.Timeline => {
    const countElement = countElementsRef.current[countIndex];
    if (!countElement) return gsap.timeline();

    const timeline = gsap.timeline();
    timeline.to(countElement, {
      backgroundColor: "rgb(168, 230, 233)",
      scale: 1.1,
      duration: 0.3,
      ease: "power1.inOut",
    });

    return timeline;
  };

  const removeCountElementHighlight = (
    countIndex: number,
  ): gsap.core.Timeline => {
    const countElement = countElementsRef.current[countIndex];
    if (!countElement) return gsap.timeline();

    const timeline = gsap.timeline();
    timeline.to(countElement, {
      backgroundColor: "transparent",
      scale: 1,
      duration: 0.3,
      ease: "power1.inOut",
    });

    return timeline;
  };

  const slideArrayElementToCountElement = (
    arrayIdx: number,
    countIdx: number,
  ): gsap.core.Timeline => {
    const arrayEl = arrayElementsRef.current[arrayIdx];
    const countEl = countElementsRef.current[countIdx];
    if (!arrayEl || !countEl) return gsap.timeline();

    const arrayRect = arrayEl.getBoundingClientRect();
    const countRect = countEl.getBoundingClientRect();

    const dx = countRect.left - arrayRect.left - COUNT_SET_X;
    const dy = countRect.top - arrayRect.top + COUNT_SET_Y;

    const tl = gsap.timeline();
    tl.add(slideElementTo(arrayEl, dx, dy, 0.8));
    tl.add(
      gsap.to(arrayEl, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      }),
    );

    return tl;
  };

  const slideCountElementToArrayElement = (
    value: number,
    arrayIdx: number,
  ): gsap.core.Timeline => {
    const countEl = countElementsRef.current[value];
    const arrayEl = arrayElementsRef.current[arrayIdx];
    if (!countEl || !arrayEl) return gsap.timeline();

    const arrayRect = arrayEl.getBoundingClientRect();
    const countRect = countEl.getBoundingClientRect();

    const dx = countRect.left - arrayRect.left - COUNT_SET_X;
    const dy = countRect.top - arrayRect.top + COUNT_SET_Y;

    const tl = gsap.timeline();
    tl.to(arrayEl, {
      x: dx,
      y: dy,
      opacity: 0,
      zIndex: 10,
      duration: 0.1,
      ease: "power1.inOut",
    });

    tl.to({}, { duration: 0.5 });

    tl.to(arrayEl, {
      x: 0,
      y: -ARRAY_OFFSET_Y,
      opacity: 1,
      duration: 0.8,
      ease: "power1.inOut",
    });

    tl.set(arrayEl, { zIndex: "auto" });

    return tl;
  };

  const hideCountArray = (): gsap.core.Timeline => {
    const timeline = gsap.timeline();

    const countElements = countElementsRef.current.filter(
      Boolean,
    ) as HTMLElement[];
    if (countElements.length > 0) {
      timeline.add(fadeOutStagger(countElements, 0.6, 0.03, 20));
    }

    const countIndexElements = countElementsIndexRef.current.filter(
      Boolean,
    ) as HTMLElement[];
    if (countIndexElements.length > 0) {
      timeline.add(fadeOutStagger(countIndexElements, 0.5, 0.02, 10), "-=0.4");
    }

    if (countLabelRef.current) {
      timeline.to(
        countLabelRef.current,
        {
          opacity: 0,
          y: 15,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "-=0.3",
      );
    }

    return timeline;
  };

  const animateSortedIndicator = (
    sortedArray: number[],
  ): gsap.core.Timeline => {
    const elements = arrayElementsRef.current.filter(
      (el): el is HTMLDivElement => el instanceof HTMLDivElement,
    );

    if (elements.length === 0) return gsap.timeline();

    const timeline = gsap.timeline();

    elements.forEach((element) => {
      timeline.to(
        element,
        {
          y: 0,
          duration: 0.5,
          ease: "power1.inOut",
        },
        0,
      );
    });

    elements.forEach((element) => {
      timeline.to(
        element,
        {
          backgroundColor: "#4caf50",
          borderColor: "#388e3c",
          color: "#fff",
          duration: 0.5,
          ease: "power1.inOut",
        },
        "0.5",
      );
    });

    return timeline;
  };

  const playAnimation = (): void => {
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

    mainTimeline.addLabel("step-0");
    mainTimeline.call(() => {
      currentStepRef.current = 0;
    });

    // Slide array elements to top
    arrayElementsRef.current.forEach((element, idx) => {
      if (element) {
        mainTimeline.add(
          slideElementTo(element, 0, -ARRAY_OFFSET_Y),
          idx * 0.1,
        );
      }
    });

    // Fade in count elements
    mainTimeline.to(countElementsRef.current.filter(Boolean), {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    });

    mainTimeline.to(
      Array.from(
        containerRef.current?.querySelectorAll(
          ".count-container > div > div > div:last-child",
        ) || [],
      ),
      {
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      },
    );

    mainTimeline.to(
      containerRef.current?.querySelectorAll(
        ".count-container > div:last-child",
      ) || [],
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      },
    );

    const max = Math.max(...array);
    const count = new Array(max - 0 + 1).fill(0);

    // PHASE 1: Count elements
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
      const count_increment = count[arr[i]];

      if (arrayElementsRef.current[i]) {
        mainTimeline.add(
          highlightElementWithScale(
            arrayElementsRef.current[i]!,
            "rgb(240, 200, 150)",
          ),
        );
        mainTimeline.add(slideArrayElementToCountElement(i, arr[i]));

        mainTimeline.add(() => {
          const countElement = countElementsRef.current[arr[i]];
          if (countElement) {
            const valueDiv = countElement.querySelector("div:last-child");
            if (valueDiv) {
              valueDiv.textContent = count_increment.toString();
            }
          }
        });
      }
    }

    // PHASE 2: Reconstruct sorted array
    const sortedPositions: Array<{ value: number; position: number }> = [];
    let sortedIdx = 0;

    for (let value = 0; value < count.length; value++) {
      for (
        let instanceCount = 0;
        instanceCount < count[value];
        instanceCount++
      ) {
        sortedPositions.push({ value, position: sortedIdx });
        sortedIdx++;
      }
    }

    sortedPositions.forEach(({ value, position }) => {
      mainTimeline.add(() => {
        const arrayEl = arrayElementsRef.current[position];
        if (arrayEl) {
          arrayEl.textContent = value.toString();
        }
      });

      mainTimeline.add(slideCountElementToArrayElement(value, position));

      mainTimeline.add(() => {
        const countElement = countElementsRef.current[value];
        if (countElement) {
          const valueDiv = countElement.querySelector("div:last-child");
          if (valueDiv) {
            const currentCount = parseInt(valueDiv.textContent || "0");
            if (currentCount > 0) {
              valueDiv.textContent = (currentCount - 1).toString();
            }
          }
        }
      });
    });

    mainTimeline.to({}, { duration: 0.3 });

    const allElements = arrayElementsRef.current.filter(
      (el): el is HTMLDivElement => el instanceof HTMLDivElement,
    );
    mainTimeline.add(resetElementsToBase(allElements));

    mainTimeline.to({}, { duration: 0.2 });
    mainTimeline.add(hideCountArray());
    mainTimeline.add(
      animateSortedIndicator(Array.from({ length: array.length }, (_, i) => i)),
    );

    timelineRef.current = mainTimeline;
  };

  const resetAnimation = (): void => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    if (arrayElementsRef.current) {
      arrayElementsRef.current.forEach((element, idx) => {
        if (element) {
          gsap.set(element, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            backgroundColor: "#f8f9fa",
            borderColor: "#e9ecef",
            color: "#212529",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            zIndex: "auto",
            clearProps: "transform",
          });

          if (array[idx] !== undefined) {
            element.textContent = array[idx].toString();
          }
        }
      });

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

    if (countElementsRef.current) {
      countElementsRef.current.forEach((element) => {
        if (element) {
          gsap.set(element, {
            opacity: 0,
            y: 0,
            scale: 1,
            backgroundColor: "transparent",
            clearProps: "transform",
          });

          const valueDiv = element.querySelector("div:last-child");
          if (valueDiv) {
            valueDiv.textContent = "0";
          }
        }
      });
    }

    if (countElementsIndexRef.current) {
      countElementsIndexRef.current.forEach((element) => {
        if (element) {
          gsap.set(element, {
            opacity: 0,
            y: 0,
            clearProps: "transform",
          });
        }
      });
    }

    if (countLabelRef.current) {
      gsap.set(countLabelRef.current, {
        opacity: 0,
        y: 0,
        clearProps: "transform",
      });
    }

    if (stepIndicatorRef.current) {
      gsap.set(stepIndicatorRef.current, {
        opacity: 0,
        y: -10,
        clearProps: "transform",
      });
      stepIndicatorRef.current.textContent = "";
    }

    if (currentElementArrowRef.current) {
      gsap.set(currentElementArrowRef.current, {
        opacity: 0,
        clearProps: "transform",
      });
    }

    wasPausedRef.current = false;
    currentStepRef.current = 0;
    totalStepsRef.current = 0;
  };

  const nextStep = (): void => {
    if (!timelineRef.current) {
      playAnimation();
      if (timelineRef.current) {
        (timelineRef.current as gsap.core.Timeline).pause();
        (timelineRef.current as gsap.core.Timeline).play("end");
        currentStepRef.current = totalStepsRef.current + 1;
        (timelineRef.current as gsap.core.Timeline).addPause("end");
        wasPausedRef.current = true;
      }
      return;
    }

    if (currentStepRef.current > totalStepsRef.current) {
      return;
    }

    timelineRef.current.play("end");
    currentStepRef.current = totalStepsRef.current + 1;
    timelineRef.current.addPause("end");
    wasPausedRef.current = true;
  };

  const previousStep = (): void => {
    if (!timelineRef.current) {
      return;
    }

    if (currentStepRef.current <= 0) {
      return;
    }

    currentStepRef.current--;

    const originalSpeed = propsRef.current.speed;
    timelineRef.current.timeScale(originalSpeed * 4);

    const targetLabel =
      currentStepRef.current === 0
        ? "step-0"
        : `step-${currentStepRef.current}`;

    if (propsRef.current.isPlaying && !wasPausedRef.current) {
      timelineRef.current.pause();
      timelineRef.current.reverse();
      timelineRef.current.addPause(targetLabel, () => {
        if (timelineRef.current) {
          timelineRef.current.timeScale(originalSpeed);
          timelineRef.current.play();
        }
        wasPausedRef.current = false;
      });
    } else {
      timelineRef.current.reverse();
      timelineRef.current.addPause(targetLabel, () => {
        if (timelineRef.current) {
          timelineRef.current.timeScale(originalSpeed);
        }
        wasPausedRef.current = true;

        if (propsRef.current.isPlaying) {
          setTimeout(() => {
            if (timelineRef.current && propsRef.current.isPlaying) {
              timelineRef.current.play();
              wasPausedRef.current = false;
            }
          }, 100);
        }
      });
    }
  };

  const pauseAnimation = (): void => {
    if (timelineRef.current) {
      timelineRef.current.pause();
      wasPausedRef.current = true;
    }
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

  const maxValue = getMaxValue(array);

  return (
    <div>
      <div className="mb-8">
        <div
          ref={containerRef}
          className="count-sort-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3rem",
            padding: "2rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#1a1a1a",
            zIndex: 0,
          }}
        >
          <div
            ref={stepIndicatorRef}
            className="step-indicator"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#495057",
              opacity: 0,
              position: "absolute",
              top: "10%",
            }}
          ></div>

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
                  width: BOX_WIDTH,
                  height: BOX_HEIGHT,
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

          <div
            className="count-container"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              position: "absolute",
              bottom: "30%",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: `${COUNT_GAP}px`,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {Array.from({ length: maxValue + 1 }, (_, index) => (
                <div
                  key={`count-${index}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    ref={(el) => {
                      countElementsRef.current[index] = el;
                    }}
                    className={`count-element count-element-${index}`}
                    style={{
                      width: `${COUNT_WIDTH}px`,
                      height: `${COUNT_HEIGHT}px`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      borderBottom: "2px solid #6c757d",
                      fontSize: `${BOX_FONT_SIZE - 4}px`,
                      fontWeight: "600",
                      color: "#212529",
                      transition: "all 0.3s ease",
                      zIndex: 3,
                      opacity: 0,
                    }}
                  >
                    <div>0</div>
                  </div>

                  <div
                    ref={(el) => {
                      countElementsIndexRef.current[index] = el;
                    }}
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6c757d",
                      marginTop: "8px",
                      opacity: 0,
                    }}
                  >
                    {index}
                  </div>
                </div>
              ))}
            </div>
            <div
              ref={countLabelRef}
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#495057",
                opacity: 0,
              }}
            >
              Count Array
            </div>
          </div>
        </div>
      </div>

      <SortingControls
        limit={12}
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
      />
    </div>
  );
};

export default CountSort;
