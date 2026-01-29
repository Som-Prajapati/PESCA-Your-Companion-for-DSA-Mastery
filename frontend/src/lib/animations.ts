import gsap from "gsap";

// * ANIMATION LIBRARY - 41 Functions
//  *
//  * MOVEMENT (5): slideElementTo, fadeIn, fadeOut, scaleUp, scaleDown
//  * HIGHLIGHTING (11): highlight, highlightRed, highlightBlue, highlightGreen,
//  * removeHighlight, greyOut, markAsSorted, highlightBoxes,
//  * highlightElementWithScale, highlightNode, removeHighlightNode
//  * SWAP (4): simpleSwap, eclipseSwap, scaleSwap, arcSwap
//  * TEXT (2): fadeInText, fadeOutText
//  * ARROW/INDICATOR (3): showArrow, hideArrow, moveArrow
//  * UTILITY (5): resetElement, pause, resetElementsToBase, fadeOutStagger, greyOutOtherNodes, restoreOnlyNodes
//  *
//  * - DIGIT OPERATIONS (4): highlightDigit, removeDigitHighlight, updateDigitPlaceIndicator, removeDigitPlaceIndicator
//  * - BUCKET OPERATIONS (4): highlightBucketDash, removeBucketDashHighlight, showBucketDashes, hideBucketDashes
//  * - ELEMENT MOVEMENT (2): moveElementToBucket, moveElementsFromBucketsToArray
//  * - PSEUDO CODE (2): updatePseudoCodeLine, switchToTab
//  * - TREE/SVG SPECIALS (5): rotationRevealAnimation, rotationHideAnimation, animateEdgeExtend, animateEdgeCompress, bounceScale
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
        y: "-=eclipseHeight",
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
        y: "+=eclipseHeight",
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
        y: "+=eclipseHeight",
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
        y: "-=eclipseHeight",
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

/**
 * Highlight element with scale and color change
 * More elaborate than basic highlight - includes scale animation
 */
export const highlightElementWithScale = (
  element: HTMLElement,
  color: string = "#ffeb3b",
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  // Animate to highlighted state
  timeline.fromTo(
    element,
    {
      opacity: 1,
      scale: 1,
    },
    {
      opacity: 1,
      scale: 1.05,
      backgroundColor: color,
      borderColor: "rgb(240, 158, 75)",
      duration: duration / 2,
      ease: "power2.out",
    },
  );

  // Scale back to normal
  timeline.to(element, {
    scale: 1,
    duration: duration / 2,
    ease: "power2.out",
  });

  return timeline;
};

/**
 * Fade out element with scale down effect
 */
export const fadeOutWithScale = (
  element: HTMLElement,
  duration: number = 0.3,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  timeline.to({}, { duration: 0.1 });

  timeline.to(element, {
    opacity: 0,
    scale: 0.95,
    backgroundColor: "#f8f9fa",
    duration: duration,
    ease: "power2.out",
  });

  return timeline;
};

/**
 * Bounce scale effect for value updates
 */
export const bounceScale = (
  element: HTMLElement,
  scale: number = 1.2,
  duration: number = 0.2,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  timeline.fromTo(
    element,
    { scale: 1 },
    {
      scale: scale,
      duration: duration / 2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    },
  );

  return timeline;
};

/**
 * Reset multiple elements to base state
 */
export const resetElementsToBase = (
  elements: HTMLElement[],
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (elements.length === 0) return timeline;

  timeline.set(elements, {
    scale: 1,
    opacity: 1,
    zIndex: "auto",
    backgroundColor: "#f8f9fa",
    borderColor: "#e9ecef",
    color: "#212529",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  });

  return timeline;
};

/**
 * Fade out multiple elements with stagger
 */
export const fadeOutStagger = (
  elements: HTMLElement[],
  duration: number = 0.6,
  staggerAmount: number = 0.03,
  yOffset: number = 20,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (elements.length === 0) return timeline;

  timeline.to(elements, {
    opacity: 0,
    y: yOffset,
    duration: duration,
    ease: "power2.inOut",
    stagger: staggerAmount,
  });

  return timeline;
};

// ----------------------------------------
/**
 * Highlights a specific digit in an element by making it red
 * @param element - The HTML element containing the number
 * @param digitPlace - The place value of the digit to highlight (0 = ones, 1 = tens, etc.)
 * @returns GSAP timeline
 */
export const highlightDigit = (
  element: HTMLElement,
  digitPlace: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  const value = parseInt(element.textContent || "0");

  // Store original value for restoration
  element.setAttribute("data-original-value", element.textContent || "0");

  // Build a string padded with leading zeros up to the current digit place
  const paddedStr = value.toString().padStart(digitPlace + 1, "0");
  const digitIndex = paddedStr.length - 1 - digitPlace;

  timeline.add(pause(0.1));

  timeline.call(() => {
    const beforeDigit = paddedStr.substring(0, digitIndex);
    const highlightedDigit = paddedStr[digitIndex] ?? "0";
    const afterDigit = paddedStr.substring(digitIndex + 1);

    element.innerHTML = `${beforeDigit}<span style="color:rgb(243, 9, 9);">${highlightedDigit}</span>${afterDigit}`;
  });

  return timeline;
};

/**
 * Removes digit highlighting and restores original text
 * @param element - The HTML element to restore
 * @returns GSAP timeline
 */
export const removeDigitHighlight = (element: HTMLElement): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  timeline.add(pause(0.1));

  timeline.call(() => {
    const originalValue =
      element.getAttribute("data-original-value") ||
      element.textContent?.replace(/<[^>]*>/g, "") ||
      "0";
    element.innerHTML = originalValue;
    element.removeAttribute("data-original-value");
  });

  return timeline;
};

/**
 * Updates the digit place indicator text
 * @param digitPlaceIndicatorRef - Reference to the indicator element
 * @param place - The digit place to display (0 = ones, 1 = tens, etc.)
 * @returns GSAP timeline
 */
export const updateDigitPlaceIndicator = (
  digitPlaceIndicatorRef: React.RefObject<HTMLDivElement | null>,
  place: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  const labelForPlace = (p: number): string => {
    if (p === 0) return "Ones";
    if (p === 1) return "Tens";
    if (p === 2) return "Hundreds";
    return `10^${p}`;
  };

  const element = digitPlaceIndicatorRef.current;
  if (element) {
    timeline.fromTo(
      element,
      { y: -10 },
      {
        y: 0,
        duration: 0.5,
        ease: "power1.inOut",
        onStart: () => {
          gsap.set(element, { opacity: 1 });
          element.textContent = `Current digit place: ${labelForPlace(place)}`;
        },
        onReverseComplete: () => {
          gsap.set(element, { opacity: 1 });
          if (place === 0) {
            element.textContent = `Current digit place: ${labelForPlace(0)}`;
          } else {
            element.textContent = `Current digit place: ${labelForPlace(place - 1)}`;
          }
        },
      },
    );
  }

  return timeline;
};

/**
 * Hides the digit place indicator
 * @param digitPlaceIndicatorRef - Reference to the indicator element
 * @returns GSAP timeline
 */
export const removeDigitPlaceIndicator = (
  digitPlaceIndicatorRef: React.RefObject<HTMLDivElement | null>,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (digitPlaceIndicatorRef.current) {
    timeline.to(digitPlaceIndicatorRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: "power1.inOut",
    });
  }

  return timeline;
};

// ============================================================================
// BUCKET OPERATIONS
// ============================================================================

/**
 * Highlights a bucket dash in red to show where an element is going
 * @param bucketElementsRef - Reference array of bucket elements
 * @param bucketIndex - Index of the bucket to highlight (0-9)
 * @returns GSAP timeline
 */
export const highlightBucketDash = (
  bucketElementsRef: React.RefObject<(HTMLDivElement | null)[]>,
  bucketIndex: number,
): gsap.core.Timeline => {
  const bucketElement = bucketElementsRef.current?.[bucketIndex];
  if (!bucketElement) return gsap.timeline();

  const timeline = gsap.timeline();
  const dashElement = bucketElement.querySelector(".bucket-dash") as HTMLElement;

  if (dashElement) {
    timeline.to(dashElement, {
      backgroundColor: "#F30909",
      scaleY: 2,
      duration: 0.3,
      ease: "power1.inOut",
    });
  }

  return timeline;
};

/**
 * Removes bucket dash highlighting
 * @param bucketElementsRef - Reference array of bucket elements
 * @param bucketIndex - Index of the bucket to restore (0-9)
 * @returns GSAP timeline
 */
export const removeBucketDashHighlight = (
  bucketElementsRef: React.RefObject<(HTMLDivElement | null)[]>,
  bucketIndex: number,
): gsap.core.Timeline => {
  const bucketElement = bucketElementsRef.current?.[bucketIndex];
  if (!bucketElement) return gsap.timeline();

  const timeline = gsap.timeline();
  const dashElement = bucketElement.querySelector(".bucket-dash") as HTMLElement;

  if (dashElement) {
    timeline.to(dashElement, {
      backgroundColor: "#6c757d",
      scaleY: 1,
      duration: 0.3,
      ease: "power1.inOut",
    });
  }

  return timeline;
};

/**
 * Shows all bucket dashes with fade in animation
 * @param bucketContainerRef - Reference to the bucket container element
 * @param bottomOffset - Y offset for positioning
 * @returns GSAP timeline
 */
export const showBucketDashes = (
  bucketContainerRef: React.RefObject<HTMLDivElement | null>,
  bottomOffset: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (bucketContainerRef.current) {
    // Set position first
    timeline.set(bucketContainerRef.current, { y: bottomOffset });
    // Then fade in
    timeline.add(fadeIn(bucketContainerRef.current, 0.5));
  }

  return timeline;
};

/**
 * Hides all bucket dashes with fade out animation
 * @param bucketContainerRef - Reference to the bucket container element
 * @param bottomOffset - Y offset for positioning
 * @returns GSAP timeline
 */
export const hideBucketDashes = (
  bucketContainerRef: React.RefObject<HTMLDivElement | null>,
  bottomOffset: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (bucketContainerRef.current) {
    // Keep position, just fade out
    timeline.add(fadeOut(bucketContainerRef.current, 0.5));
  }

  return timeline;
};

// ============================================================================
// ELEMENT MOVEMENT
// ============================================================================

/**
 * Moves an element to a specific bucket with arc animation
 * @param containerRef - Reference to the container element
 * @param bucketElementsRef - Reference array of bucket elements
 * @param element - The element to move
 * @param bucketIndex - Target bucket index (0-9)
 * @param stackPosition - Position in the stack (0 = bottom)
 * @param boxWidth - Width of the element box
 * @param boxHeight - Height of the element box
 * @param bottomOffset - Y offset for bucket positioning
 * @param duration - Animation duration
 * @returns GSAP timeline
 */
export const moveElementToBucket = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  bucketElementsRef: React.RefObject<(HTMLDivElement | null)[]>,
  element: HTMLElement,
  bucketIndex: number,
  stackPosition: number,
  boxWidth: number,
  boxHeight: number,
  bottomOffset: number,
  duration: number = 0.8,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  if (!containerRef.current || !bucketElementsRef.current?.[bucketIndex]) {
    return timeline;
  }

  const containerRect = containerRef.current.getBoundingClientRect();
  const bucketElement = bucketElementsRef.current[bucketIndex];
  const bucketRect = bucketElement!.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const elementOffsetX = elementRect.left - containerRect.left;
  const elementOffsetY = elementRect.top - containerRect.top;

  const targetX =
    bucketRect.left -
    containerRect.left +
    bucketRect.width / 2 -
    boxWidth / 2 -
    elementOffsetX;

  const targetY =
    bucketRect.top -
    containerRect.top -
    elementOffsetY -
    boxHeight -
    10 -
    stackPosition * (boxHeight + 4) +
    bottomOffset;

  // Animate with arc motion - go up first
  timeline.add(slideElementTo(element, targetX, targetY - 20, duration * 0.5));
  
  // Then drop down with bounce
  timeline.to(
    element,
    {
      y: targetY,
      duration: duration * 0.5,
      ease: "bounce.out",
    },
    duration * 0.5,
  );

  return timeline;
};

/**
 * Moves all elements from buckets back to the array line
 * @param containerRef - Reference to the container element
 * @param buckets - 2D array of elements in each bucket
 * @param boxWidth - Width of the element box
 * @param boxHeight - Height of the element box
 * @param duration - Animation duration
 * @param isAscending - Whether to collect in ascending order
 * @returns GSAP timeline
 */
export const moveElementsFromBucketsToArray = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  buckets: HTMLElement[][],
  boxWidth: number,
  boxHeight: number,
  duration: number,
  isAscending: boolean,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  const elementsInOrder: HTMLElement[] = [];
  
  if (isAscending) {
    for (let bucket = 0; bucket < 10; bucket++) {
      buckets[bucket].forEach((element) => {
        elementsInOrder.push(element);
      });
    }
  } else {
    for (let bucket = 9; bucket >= 0; bucket--) {
      buckets[bucket].forEach((element) => {
        elementsInOrder.push(element);
      });
    }
  }

  elementsInOrder.forEach((element, i) => {
    if (!element || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const currentX = elementRect.left - containerRect.left;
    const currentY = elementRect.top - containerRect.top;

    const targetX = i * (boxWidth + 15);
    const targetY = 0;

    // Use slideElementTo with absolute positioning
    timeline.to(
      element,
      {
        x: targetX - currentX + 100,
        y: targetY - currentY + 10,
        duration: duration,
        ease: "power1.inOut",
        zIndex: 10,
      },
      i * 0.5,
    );
  });

  return timeline;
};

// ============================================================================
// PSEUDO CODE OPERATIONS
// ============================================================================

/**
 * Updates the highlighted pseudo code line
 * @param setCurrentPseudoCodeLine - State setter for current line
 * @param setShowPseudoCode - State setter for current tab
 * @param line - Line number(s) to highlight
 * @param tabIndex - Tab index to show
 * @returns GSAP timeline
 */
export const updatePseudoCodeLine = (
  setCurrentPseudoCodeLine: (line: number | number[] ) => void,
  setShowPseudoCode: (tab: number) => void,
  line: number | number[],
  tabIndex: number = 0,
  currentTab: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  timeline.call(() => {
    setCurrentPseudoCodeLine(line);
    if (tabIndex !== currentTab) {
      setShowPseudoCode(tabIndex);
    }
  });

  return timeline;
};

/**
 * Switches to a specific pseudo code tab
 * @param setShowPseudoCode - State setter for current tab
 * @param tabIndex - Tab index to switch to
 * @returns GSAP timeline
 */
export const switchToTab = (
  setShowPseudoCode: (tab: number) => void,
  tabIndex: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  timeline.call(() => {
    setShowPseudoCode(tabIndex);
  });
  return timeline;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets the digit at a specific place value
 * @param num - The number to extract from
 * @param place - The place value (0 = ones, 1 = tens, etc.)
 * @returns The digit at that place
 */
export const getDigitAtPlace = (num: number, place: number): number => {
  return Math.floor(num / Math.pow(10, place)) % 10;
};

/**
 * Gets the maximum number of digits in an array
 * @param arr - Array of numbers
 * @returns Maximum digit count
 */
export const getMaxDigits = (arr: number[]): number => {
  const maxNum = Math.max(...arr);
  return maxNum.toString().length;
};

/**
 * Gets a user-friendly label for a digit place
 * @param place - The digit place (0 = ones, 1 = tens, etc.)
 * @returns Human-readable label
 */
export const getDigitPlaceLabel = (place: number): string => {
  if (place === 0) return "Ones";
  if (place === 1) return "Tens";
  if (place === 2) return "Hundreds";
  return `10^${place}`;
};

/**
 * Highlights a heap tree node
 * @param arrayNodeRef - Reference array of heap tree nodes
 * @param index - Index of node to highlight
 * @returns GSAP timeline
 */
export const highlightNode = (
  arrayNodeRef: React.RefObject<(HTMLDivElement | null)[]>,
  index: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  const node = arrayNodeRef.current?.[index];
  if (node) {
    timeline.to(
      node,
      {
        backgroundColor: "#ffe082",
        borderColor: "#ffb300",
        boxShadow: "0 0 16px 2px #ffe082",
        duration: 0.3,
        ease: "power2.out",
      },
      0,
    );
  }
  return timeline;
};

/**
 * Removes highlight from a heap tree node
 * @param arrayNodeRef - Reference array of heap tree nodes
 * @param index - Index of node to restore
 * @returns GSAP timeline
 */
export const removeHighlightNode = (
  arrayNodeRef: React.RefObject<(HTMLDivElement | null)[]>,
  index: number,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  const node = arrayNodeRef.current?.[index];
  if (node) {
    timeline.to(
      node,
      {
        backgroundColor: "#fff",
        borderColor: "#007bff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        duration: 0.3,
        ease: "power2.out",
      },
      0,
    );
  }
  return timeline;
};

/**
 * Greys out all nodes except those at the given indices
 * @param arrayNodeRef - Reference array of heap tree nodes
 * @param indicesToKeep - Indices of nodes to keep highlighted
 * @returns GSAP timeline
 */
export const greyOutOtherNodes = (
  arrayNodeRef: React.RefObject<(HTMLDivElement | null)[]>,
  indicesToKeep: number[],
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  if (!arrayNodeRef.current) return timeline;
  arrayNodeRef.current.forEach((node, idx) => {
    if (!indicesToKeep.includes(idx) && node) {
      timeline.to(
        node,
        {
          backgroundColor: "#e0e0e0",
          duration: 0.2,
          overwrite: "auto",
        },
        0,
      );
    }
  });
  return timeline;
};

/**
 * Restores only the nodes at the given indices to their original color
 * @param arrayNodeRef - Reference array of heap tree nodes
 * @param indicesToKeep - Indices of nodes to restore
 * @returns GSAP timeline
 */
export const restoreOnlyNodes = (
  arrayNodeRef: React.RefObject<(HTMLDivElement | null)[]>,
  indicesToKeep: number[],
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  if (!arrayNodeRef.current) return timeline;
  arrayNodeRef.current.forEach((node, idx) => {
    if (!indicesToKeep.includes(idx) && node) {
      timeline.to(
        node,
        {
          backgroundColor: "#fff",
          border: "2px solid #007bff",
          duration: 0.2,
          overwrite: "auto",
        },
        0,
      );
    }
  });
  return timeline;
};

/**
 * Helper to generate a polygon for a pie slice (from 0 to angle)
 * Used for rotational reveal/hide animations
 */
export const getPiePolygon = (deg: number): string => {
  const steps = Math.max(3, Math.ceil(deg / 10));
  const points = [`50% 50%`, `50% 0%`];
  for (let i = 0; i <= steps; i++) {
    const angle = (deg * i) / steps - 90;
    const rad = (angle * Math.PI) / 180;
    const x = 50 + 50 * Math.cos(rad);
    const y = 50 + 50 * Math.sin(rad);
    points.push(`${x}% ${y}%`);
  }
  return `polygon(${points.join(",")})`;
};

/**
 * Animation function for revealing a node with a rotational clipPath effect
 * @param node - The HTML node element to reveal
 * @returns GSAP timeline
 */
export const rotationRevealAnimation = (node: HTMLDivElement): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  // Step 1: Set initial state
  gsap.set(node, { opacity: 0, scale: 0.5, rotation: 0 });
  node.style.clipPath = getPiePolygon(0);
  (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;

  // Step 2: Reveal 0-90deg
  timeline.to(
    node,
    {
      opacity: 0.5,
      scale: 0.7,
      rotation: 0,
      duration: 0.18,
      transformOrigin: "50% 50%",
      ease: "power1.inOut",
      onUpdate: function () {
        const progress = this.progress();
        const deg = 0 + 90 * progress;
        node.style.clipPath = getPiePolygon(deg);
        (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;
      },
    },
    "+=0.05",
  );

  // Step 3: Reveal 90-180deg
  timeline.to(node, {
    opacity: 0.7,
    scale: 0.85,
    duration: 0.18,
    transformOrigin: "50% 50%",
    ease: "power1.inOut",
    onUpdate: function () {
      const progress = this.progress();
      const deg = 90 + 90 * progress;
      node.style.clipPath = getPiePolygon(deg);
      (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;
    },
  });

  // Step 4: Reveal 180-270deg
  timeline.to(node, {
    opacity: 0.85,
    scale: 1,
    duration: 0.18,
    transformOrigin: "50% 50%",
    ease: "power1.inOut",
    onUpdate: function () {
      const progress = this.progress();
      const deg = 180 + 90 * progress;
      node.style.clipPath = getPiePolygon(deg);
      (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;
    },
  });

  // Step 5: Reveal 270-360deg (full circle)
  timeline.to(node, {
    opacity: 1,
    scale: 1,
    duration: 0.18,
    transformOrigin: "50% 50%",
    ease: "back.out(2)",
    onUpdate: function () {
      const progress = this.progress();
      const deg = 270 + 90 * progress;
      node.style.clipPath = getPiePolygon(deg);
      (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;
    },
    onComplete: function () {
      node.style.clipPath = getPiePolygon(360);
      (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;
    },
  });

  return timeline;
};

/**
 * Animation function for hiding a node with a rotational "wipe" effect
 * @param node - The HTML node element to hide
 * @returns GSAP timeline
 */
export const rotationHideAnimation = (node: HTMLDivElement): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  node.style.clipPath = getPiePolygon(360);
  (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;

  // Step 1: Hide 270-360deg arc
  timeline.to(node, {
    opacity: 0.85,
    scale: 1,
    duration: 0.18,
    transformOrigin: "50% 50%",
    ease: "power1.inOut",
    onUpdate: function () {
      const progress = this.progress();
      const deg = 360 - 90 * progress;
      node.style.clipPath = getPiePolygon(deg);
      (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;
    },
  });

  // Step 2: Hide 180-270deg arc
  timeline.to(node, {
    opacity: 0.7,
    scale: 0.85,
    duration: 0.18,
    transformOrigin: "50% 50%",
    ease: "power1.inOut",
    onUpdate: function () {
      const progress = this.progress();
      const deg = 270 - 90 * progress;
      node.style.clipPath = getPiePolygon(deg);
      (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;
    },
  });

  // Step 3: Hide 90-180deg arc
  timeline.to(node, {
    opacity: 0.5,
    scale: 0.7,
    duration: 0.18,
    transformOrigin: "50% 50%",
    ease: "power1.inOut",
    onUpdate: function () {
      const progress = this.progress();
      const deg = 180 - 90 * progress;
      node.style.clipPath = getPiePolygon(deg);
      (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;
    },
  });

  // Step 4: Hide 0-90deg arc (fully hidden)
  timeline.to(node, {
    opacity: 0,
    scale: 0.5,
    duration: 0.18,
    transformOrigin: "50% 50%",
    ease: "back.in(2)",
    onUpdate: function () {
      const progress = this.progress();
      const deg = 90 - 90 * progress;
      node.style.clipPath = getPiePolygon(deg);
      (node.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = node.style.clipPath;
    },
  });

  return timeline;
};

/**
 * Animate the edge "growing" from parent to child using stroke-dasharray
 * @param edge - SVG line element
 * @param x1 - Starting X coordinate
 * @param y1 - Starting Y coordinate
 * @param x2 - Ending X coordinate
 * @param y2 - Ending Y coordinate
 * @param duration - Animation duration
 * @returns GSAP timeline
 */
export const animateEdgeExtend = (
  edge: SVGLineElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  duration: number = 0.5,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  edge.setAttribute("x1", `${x1}`);
  edge.setAttribute("y1", `${y1}`);
  edge.setAttribute("x2", `${x2}`);
  edge.setAttribute("y2", `${y2}`);

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  edge.setAttribute("stroke-dasharray", `${length}`);
  edge.setAttribute("stroke-dashoffset", `${length}`);

  timeline.to(edge, {
    strokeDashoffset: 0,
    duration,
    ease: "power2.out",
    onStart: () => {
      edge.setAttribute("opacity", "1");
    },
    onComplete: () => {
      edge.removeAttribute("stroke-dasharray");
      edge.removeAttribute("stroke-dashoffset");
    },
  });

  return timeline;
};

/**
 * Animate edge compress: animate the edge from child back to parent (collapse)
 * @param edge - SVG line element
 * @param x1 - Starting X coordinate (parent)
 * @param y1 - Starting Y coordinate (parent)
 * @param x2 - Ending X coordinate (child)
 * @param y2 - Ending Y coordinate (child)
 * @param duration - Animation duration
 * @returns GSAP timeline
 */
export const animateEdgeCompress = (
  edge: SVGLineElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  duration: number = 0.5,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  edge.setAttribute("x1", `${x1}`);
  edge.setAttribute("y1", `${y1}`);
  edge.setAttribute("x2", `${x2}`);
  edge.setAttribute("y2", `${y2}`);

  timeline.to(edge, {
    attr: { x2: x1, y2: y1 },
    duration,
    ease: "power2.in",
  });

  return timeline;
};

// ------------------------------------------------------
// ============================================================================
// LINEAR SEARCH SPECIFIC ANIMATIONS
// ============================================================================

/**
 * Fades in the text content of an array box element
 * @param arrayElementsRef - Reference array of array box elements
 * @param index - Index of the box to fade in text
 * @param duration - Animation duration
 * @returns GSAP timeline
 */
export const fadeInBoxText = (
  arrayElementsRef: React.RefObject<(HTMLDivElement | null)[]>,
  index: number,
  duration: number = 0.6,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  const box = arrayElementsRef.current?.[index];
  
  if (!box) return timeline;

  const textEl = box.querySelector("span");
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
 * Fades out the text content of an array box element
 * @param arrayElementsRef - Reference array of array box elements
 * @param index - Index of the box to fade out text
 * @param duration - Animation duration
 * @returns GSAP timeline
 */
export const fadeOutBoxText = (
  arrayElementsRef: React.RefObject<(HTMLDivElement | null)[]>,
  index: number,
  duration: number = 0.6,
): gsap.core.Timeline => {
  const timeline = gsap.timeline();
  const box = arrayElementsRef.current?.[index];
  
  if (!box) return timeline;

  const textEl = box.querySelector("span");
  if (!textEl) return timeline;

  timeline.to(textEl, {
    opacity: 0,
    scale: 0.6,
    duration,
    ease: "power2.out",
  });

  return timeline;
};

/**
 * Fades out text on all array elements with staggered timing
 * @param arrayElementsRef - Reference array of array box elements
 * @param staggerDelay - Delay between each element's animation
 * @param duration - Animation duration for each element
 * @returns Array of GSAP timelines
 */
export const fadeOutAllBoxTexts = (
  arrayElementsRef: React.RefObject<(HTMLDivElement | null)[]>,
  staggerDelay: number = 0.1,
  duration: number = 0.6,
): gsap.core.Timeline[] => {
  return (arrayElementsRef.current || []).map((box, idx) => {
    if (!box) return gsap.timeline();
    const tl = fadeOutBoxText(arrayElementsRef, idx, duration);
    tl.delay(idx * staggerDelay);
    return tl;
  });
};

/**
 * Animates an element (like a search icon) to "jump" from start to end position in an elliptical arc,
 * with pre-jump crouch, main arc jump, and bounce landing animations
 * @param elementA - The element to animate (e.g., search icon)
 * @param elementB - The target element to react when elementA lands
 * @param x1 - Starting x position
 * @param y1 - Starting y position
 * @param x2 - Ending x position
 * @param y2 - Ending y position
 * @param duration - Total animation duration
 * @returns GSAP timeline
 */
  const teleportToPosition = (
    searchCircle: HTMLElement,
    targetIndex: number,
    duration: number = 0.8,
    TOTAL_BOX_SPACING: number
  ): gsap.core.Timeline => {
    const timeline = gsap.timeline();

    // Calculate target position above the array element
    const targetX = targetIndex * TOTAL_BOX_SPACING;

    // Step 1: Scale down to 0 (disappear)
    timeline.to(searchCircle, {
      scale: 0,
      duration: duration * 0.5,
      ease: "power2.in",
    });

    // Step 2: Move to new position while invisible
    timeline.set(searchCircle, {
      x: targetX,
      y: 0,
    });

    // Step 3: Scale back up (appear)
    timeline.to(searchCircle, {
      scale: 1,
      duration: duration * 0.5,
      ease: "back.out(1.7)",
    });

    // Step 4: Optional bounce effect
    // timeline.to(searchCircle, {
    //   y: -10,
    //   duration: duration * 0.1,
    //   ease: "power2.out",
    // });

    timeline.to(searchCircle, {
      y: 0,
      duration: duration * 0.2,
      ease: "bounce.out",
    });

    return timeline;
  };

const eliminateElements = (
      arrayElementsRef :React.RefObject<(HTMLDivElement | null)[]> ,
    start: number,
    end: number,
    direction: "left" | "right"
  ): gsap.core.Timeline => {
    const timeline = gsap.timeline();

    // Calculate rotation direction based on which side is being eliminated
    const rotation = direction === "left" ? -15 : 15;

    for (let i = start; i <= end; i++) {
      const element = arrayElementsRef.current[i];
      if (element) {
        timeline.to(
          element,
          {
            backgroundColor: "#9e9e9e",
            borderColor: "#757575",
            y: 400,
            opacity: 0,
            rotation: rotation,
            duration: 0.6,
            ease: "power2.in",
            delay: (i - start) * 0, // Reduced delay for faster animation
          },
          `eliminate-${i}`
        );
      }
    }

    return timeline;
};
  

