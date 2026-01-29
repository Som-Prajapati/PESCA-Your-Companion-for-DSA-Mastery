import gsap from "gsap";

// * ANIMATION LIBRARY - 24 Functions
//  *
//  * MOVEMENT (5): slideElementTo, fadeIn, fadeOut, scaleUp, scaleDown
//  * HIGHLIGHTING (8): highlight, highlightRed, highlightBlue, highlightGreen,
//  *                   removeHighlight, greyOut, markAsSorted, highlightBoxes
//  * SWAP (4): simpleSwap, eclipseSwap, scaleSwap, arcSwap
//  * TEXT (2): fadeInText, fadeOutText
//  * ARROW (3): showArrow, hideArrow, moveArrow
//  * UTILITY (2): resetElement, pause
//  */

/**
 * Shared GSAP animation functions for algorithm visualizations.
 * These are universal animations that can be used across different algorithms.
 * All functions now return timelines for better composition.
 */

// ============================================================================
// BASIC MOVEMENT ANIMATIONS
// ============================================================================

/**
 * Slides an element to a specific position
 */
export const slideElementTo = (
  element: HTMLElement, 
  toX: number | string,
  toY: number | string = 0,
  duration: number = 0.5,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    x: toX,
    y: toY,
    duration,
    ease: "power1.inOut",
  });
  return timeline;
};

/**
 * Fades in an element
 */
export const fadeIn = (
  element: HTMLElement,
  duration: number = 0.5,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    opacity: 1,
    duration,
    ease: "power2.out",
  });
  return timeline;
};

/**
 * Fades out an element
 */
export const fadeOut = (
  element: HTMLElement,
  duration: number = 0.5,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    opacity: 0,
    duration,
    ease: "power2.out",
  });
  return timeline;
};

/**
 * Scales an element up
 */
export const scaleUp = (
  element: HTMLElement,
  scale: number = 1.2,
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    scale,
    duration,
    ease: "back.out(1.7)",
  });
  return timeline;
};

/**
 * Scales an element down to normal
 */
export const scaleDown = (
  element: HTMLElement,
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    scale: 1,
    duration,
    ease: "power2.out",
  });
  return timeline;
};

// ============================================================================
// HIGHLIGHTING ANIMATIONS
// ============================================================================

/**
 * Highlights an element with a specific color (default blue for comparison)
 */
export const highlight = (
  element: HTMLElement,
  color: string = "#e3f2fd",
  borderColor: string = "#2196f3",
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    backgroundColor: color,
    borderColor: borderColor,
    boxShadow: `0 0 15px rgba(33, 150, 243, 0.3), 0 2px 12px rgba(33, 150, 243, 0.2)`,
    duration,
    ease: "power2.out",
  });
  return timeline;
};

/**
 * Highlights an element in red (for min/max or special cases)
 */
export const highlightRed = (
  element: HTMLElement,
  duration: number = 0.4,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    boxShadow:
      "0 0 20px rgba(244, 67, 54, 0.4), 0 2px 15px rgba(244, 67, 54, 0.2)",
    duration,
    ease: "power2.out",
  });
  return timeline;
};

/**
 * Highlights an element in blue (for current comparison)
 */
export const highlightBlue = (
  element: HTMLElement,
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
    boxShadow:
      "0 0 15px rgba(33, 150, 243, 0.3), 0 2px 12px rgba(33, 150, 243, 0.2)",
    duration,
    ease: "power2.out",
  });
  return timeline;
};

/**
 * Highlights an element in green (for sorted/success)
 */
export const highlightGreen = (
  element: HTMLElement,
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    boxShadow:
      "0 0 15px rgba(40, 167, 69, 0.3), 0 2px 12px rgba(40, 167, 69, 0.2)",
    duration,
    ease: "power2.out",
  });
  return timeline;
};

/**
 * Removes highlight from an element (returns to default state)
 */
export const removeHighlight = (
  element: HTMLElement,
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    backgroundColor: "#f8f9fa",
    borderColor: "#e9ecef",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    duration,
    ease: "power2.out",
  });
  return timeline;
};

/**
 * Greys out an element (for elements that are no longer being considered)
 */
export const greyOut = (
  element: HTMLElement,
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    backgroundColor: "#e0e0e0",
    color: "#888",
    borderColor: "#cccccc",
    duration,
    ease: "power2.out",
  });
  return timeline;
};

/**
 * Marks element(s) as sorted (green)
 */
export const markAsSorted = (
  elements: HTMLElement | HTMLElement[],
  duration: number = 0.5,
): gsap.core.Timeline => {
  const targetElements = Array.isArray(elements) ? elements : [elements];
  const timeline = gsap.timeline();

  targetElements.forEach((element) => {
    timeline.to(
      element,
      {
        backgroundColor: "#d4edda",
        borderColor: "#c3e6cb",
        duration,
        ease: "power2.out",
      },
      0, // All elements animate simultaneously
    );
  });

  return timeline;
};

// ============================================================================
// SWAP ANIMATIONS
// ============================================================================

/**
 * Simple horizontal swap between two elements
 */
export const simpleSwap = (
  elementA: HTMLElement,
  elementB: HTMLElement,
  duration: number = 0.8,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  const currentXA = gsap.getProperty(elementA, "x") as number;
  const currentXB = gsap.getProperty(elementB, "x") as number;

  timeline.to(
    elementA,
    {
      x: currentXB,
      duration,
      ease: "power2.inOut",
    },
    0,
  );

  timeline.to(
    elementB,
    {
      x: currentXA,
      duration,
      ease: "power2.inOut",
    },
    0,
  );

  return timeline;
};

/**
 * Eclipse swap animation (elements swap in upper/lower arcs)
 */
export const eclipseSwap = (
  arrayElementsRef: React.RefObject<(HTMLDivElement | null)[]>,
  elementA: HTMLDivElement | null,
  elementB: HTMLDivElement | null,
  eclipseHeight: number = 80,
  duration: number = 1.2,
  TOTAL_BOX_SPACING: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  const indexA = arrayElementsRef.current.findIndex((el: HTMLDivElement | null) => el === elementA);
  const indexB = arrayElementsRef.current.findIndex((el: HTMLDivElement | null) => el === elementB);

  if (indexA === -1 || indexB === -1) {
    return timeline;
  }

  timeline.call(() => {
    const currentXA = gsap.getProperty(elementA, "x") as number;
    const currentXB = gsap.getProperty(elementB, "x") as number;
    
    const distance = (indexB - indexA) * TOTAL_BOX_SPACING;
    const midPoint = distance / 2;

    const swapAnimation = gsap.timeline();

    // Element A moves in upper arc with flip
    swapAnimation.to(
      elementA,
      {
        x: currentXA + midPoint,
        y: -eclipseHeight,
        rotation: 180,
        duration: duration / 2,
        ease: "power2.out",
      },
      0,
    );

    swapAnimation.to(
      elementA,
      {
        x: currentXA + distance,
        y: 0,
        rotation: 360,
        duration: duration / 2,
        ease: "power2.in",
      },
      duration / 2,
    );
    
    // Element B moves in lower arc with flip
    swapAnimation.to(
      elementB,
      {
        x: currentXB - midPoint,
        y: eclipseHeight,
        rotation: -180,
        duration: duration / 2,
        ease: "power2.out",
      },
      0,
    );

    swapAnimation.to(
      elementB,
      {
        x: currentXB - distance,
        y: 0,
        rotation: -360,
        duration: duration / 2,
        ease: "power2.in",
      },
      duration / 2,
    );

    // Reset rotation
    swapAnimation.set([elementA, elementB], { rotation: 0 });

    timeline.add(swapAnimation);
  });
  
  return timeline;
};

/**
 * Arc swap animation (both elements go up and swap)
 */
export const arcSwap = (
  elementA: HTMLElement,
  elementB: HTMLElement,
  arcHeight: number = 60,
  duration: number = 1.0,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  const currentXA = gsap.getProperty(elementA, "x") as number;
  const currentXB = gsap.getProperty(elementB, "x") as number;

  const distance = currentXB - currentXA;

  // Both elements go up
  timeline.to(
    [elementA, elementB],
    {
      y: -arcHeight,
      duration: duration / 3,
      ease: "power2.out",
    },
    0,
  );

  // Swap positions horizontally
  timeline.to(
    elementA,
    {
      x: currentXA + distance,
      duration: duration / 3,
      ease: "power1.inOut",
    },
    duration / 3,
  );

  timeline.to(
    elementB,
    {
      x: currentXB - distance,
      duration: duration / 3,
      ease: "power1.inOut",
    },
    duration / 3,
  );

  // Both elements come down
  timeline.to([elementA, elementB], {
    y: 0,
    duration: duration / 3,
    ease: "power2.in",
  });

  return timeline;
};

/**
 * Scale swap animation (for bubble sort - elements scale while swapping)
 */
export const scaleSwap = (
  arrayElementsRef: React.RefObject<(HTMLDivElement | null)[]>,
  elementA: HTMLDivElement,
  elementB: HTMLDivElement,
  duration: number = 1.2,
  TOTAL_BOX_SPACING: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  
  const indexA = arrayElementsRef.current.findIndex((el) => el === elementA);
  const indexB = arrayElementsRef.current.findIndex((el) => el === elementB);

  if (indexA === -1 || indexB === -1) {
    return timeline;
  }

  timeline.call(() => {
    // Swap refs
    const temp = arrayElementsRef.current[indexA];
    arrayElementsRef.current[indexA] = arrayElementsRef.current[indexB];
    arrayElementsRef.current[indexB] = temp;

    const currentXA = gsap.getProperty(elementA, "x") as number;
    const currentXB = gsap.getProperty(elementB, "x") as number;
    const distance = (indexB - indexA) * TOTAL_BOX_SPACING;

    console.log(indexA , indexB, currentXA, currentXB)

    // Store original z-index values
    const originalZIndexA = elementA.style.zIndex || "auto";
    const originalZIndexB = elementB.style.zIndex || "auto";

    const swapAnimation = gsap.timeline();

    // Set z-index: left element (A) higher than right element (B)
    swapAnimation.set(elementA, { zIndex: 1001 }, 0);
    swapAnimation.set(elementB, { zIndex: 1000 }, 0);

    // Element A (left) scales up, moves right to midpoint
    swapAnimation.to(
      elementA,
      {
        scale: 1.5,
        x: currentXA + distance / 2,
        duration: duration / 2,
        ease: "power2.out",
      },
      0,
    );

    // Element A scales back to normal at final position
    swapAnimation.to(
      elementA,
      {
        scale: 1,
        x: currentXA + distance,
        duration: duration / 2,
        ease: "power2.in",
      },
      duration / 2,
    );

    // Element B (right) scales down, moves left to midpoint
    swapAnimation.to(
      elementB,
      {
        scale: 0.5,
        x: currentXB - distance / 2,
        duration: duration / 2,
        ease: "power2.out",
      },
      0,
    );

    // Element B scales back to normal at final position
    swapAnimation.to(
      elementB,
      {
        scale: 1,
        x: currentXB - distance,
        duration: duration / 2,
        ease: "power2.in",
      },
      duration / 2,
    );

    // Reset z-index back to original values
    swapAnimation.call(() => {
      gsap.set(elementA, {
        scale: 1,
        zIndex: originalZIndexA === "auto" ? "auto" : originalZIndexA,
      });
      gsap.set(elementB, {
        scale: 1,
        zIndex: originalZIndexB === "auto" ? "auto" : originalZIndexB,
      });
    });

    timeline.add(swapAnimation);
  });

  return timeline;
};

// ============================================================================
// TEXT ANIMATIONS
// ============================================================================

/**
 * Fades in the text content of an element
 */
export const fadeInText = (
  element: HTMLElement,
  duration: number = 0.6,
): gsap.core.Timeline => {
  const textEl = element.querySelector("span");
  const timeline = gsap.timeline();
  
  if (!textEl) return timeline;

  timeline.to(textEl, {
    opacity: 1,
    scale: 1,
    duration,
    ease: "power2.out",
  });
  
  return timeline;
};

/**
 * Fades out the text content of an element
 */
export const fadeOutText = (
  element: HTMLElement,
  duration: number = 0.6,
): gsap.core.Timeline => {
  const textEl = element.querySelector("span");
  const timeline = gsap.timeline();
  
  if (!textEl) return timeline;

  timeline.to(textEl, {
    opacity: 0,
    scale: 0.6,
    duration,
    ease: "power2.out",
  });
  
  return timeline;
};

// ============================================================================
// ARROW/INDICATOR ANIMATIONS
// ============================================================================

/**
 * Shows an arrow indicator by fading it in and moving it down
 */
export const showArrow = (
  arrow: HTMLElement,
  x: number,
  y: number,
  duration: number = 0.5,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.fromTo(
    arrow,
    {
      x,
      y: 0,
      opacity: 0,
      zIndex: -1,
    },
    {
      y,
      opacity: 1,
      duration,
      ease: "power1.out",
      zIndex: -1,
    },
  );
  return timeline;
};

/**
 * Hides an arrow indicator by moving it up and fading it out
 */
export const hideArrow = (
  arrow: HTMLElement,
  duration: number = 0.5,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(arrow, {
    y: 0,
    opacity: 0,
    duration,
    ease: "power1.out",
  });
  return timeline;
};

/**
 * Moves an arrow to a new position
 */
export const moveArrow = (
  arrow: HTMLElement,
  x: number,
  y?: number,
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to(arrow, {
    x,
    ...(y !== undefined && { y }),
    duration,
    ease: "power1.inOut",
  });
  return timeline;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Resets an element to its default state
 */
export const resetElement = (element: HTMLElement): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.set(element, {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    opacity: 1,
    backgroundColor: "#f8f9fa",
    borderColor: "#e9ecef",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    zIndex: "auto",
  });
  return timeline;
};

/**
 * Creates a pause in the timeline
 */
export const pause = (duration: number = 0.3): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.to({}, { duration });
  return timeline;
};

/**
 * Highlight boxes with glow effect (for comparisons)
 */
export const highlightBoxes = (
  arrayElementsRef: React.MutableRefObject<(HTMLDivElement | null)[]>,
  indices: number | number[],
  intensity: "low" | "high" = "low",
  duration: number = 0.6,
): gsap.core.Timeline => {
  const targetIndices = Array.isArray(indices) ? indices : [indices];
  const elements = targetIndices
    .map((index) => arrayElementsRef.current[index])
    .filter((el): el is HTMLDivElement => el instanceof HTMLDivElement);

  const timeline = gsap.timeline();
  
  if (elements.length === 0) return timeline;

  const shadowConfig = {
    low: "0 0 10px #ffd700, 0 2px 15px rgba(255, 215, 0, 0.3)",
    high: "0 0 25px #ff4444, 0 4px 30px rgba(255, 68, 68, 0.5)",
  };

  const glowShadow = shadowConfig[intensity];
  const originalBoxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";

  elements.forEach((element) => {
    timeline
      .to(
        element,
        {
          boxShadow: glowShadow,
          duration: duration / 2,
          ease: "power2.out",
        },
        0,
      )
      .to(
        element,
        {
          boxShadow: originalBoxShadow,
          duration: duration / 2,
          ease: "power2.in",
        },
        duration / 2,
      );
  });

  return timeline;
};