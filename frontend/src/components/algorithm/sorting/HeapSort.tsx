"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Controls from "../../extras/Control";
import SortingControls from "./SortingControl";
import {
  highlightNode,
  removeHighlightNode,
  greyOutOtherNodes,
  restoreOnlyNodes,
  getPiePolygon,
  rotationRevealAnimation,
  rotationHideAnimation,
  animateEdgeExtend,
  animateEdgeCompress,
  updatePseudoCodeLine,
  switchToTab,
  pause,
  resetElement,
  highlightRed,
  highlightBlue,
  removeHighlight as removeHighlightBase,
  eclipseSwap,
  markAsSorted,
} from "@/lib/animations";

const getDynamicSizing = (arrayLength: number) => {
  if (arrayLength <= 9) {
    return {
      BOX_WIDTH: 80,
      BOX_HEIGHT: 80,
      BOX_GAP: 16,
      BOX_BORDER_RADIUS: 12,
      BOX_FONT_SIZE: 20,
      NODE_FONT_SIZE: 16,
      ARROW_SIZE: 8,
      ARROW_FONT_SIZE: 16,
      ECLIPSE_HEIGHT: 80,
      TOTAL_BOX_SPACING: 80 + 16,
      ARROW_Y_OFFSET_DOWN: (80 * 2.4) / 2,
      ARROW_X_OFFSET: 80 / 2,
      NODE_RADIUS: 20,
      LEVEL_HEIGHT: 60,
      ECLIPSE_HEIGHT_NODE: 60,
      LINE_WIDTH: 1,
      TOP_OFFSET: -80 * 3,
      TREE_TOP:
        typeof window !== "undefined" ? window.innerHeight * 0.35 : 0.35 * 800,
      TREE_CENTER_X:
        typeof window !== "undefined" ? 0.5 * window.innerWidth : 400,
      HORIZONTAL_SPACING:
        typeof window !== "undefined" ? 0.7 * window.innerWidth : 0.7 * 800,
    };
  } else if (arrayLength <= 16) {
    return {
      BOX_WIDTH: 50,
      BOX_HEIGHT: 50,
      BOX_GAP: 8,
      BOX_BORDER_RADIUS: 8,
      BOX_FONT_SIZE: 14,
      NODE_FONT_SIZE: 14,
      ARROW_SIZE: 6,
      ARROW_FONT_SIZE: 12,
      ECLIPSE_HEIGHT: 60,
      ECLIPSE_HEIGHT_NODE: 30,
      TOTAL_BOX_SPACING: 50 + 8,
      ARROW_Y_OFFSET_DOWN: (50 * 2.4) / 2,
      ARROW_X_OFFSET: 50 / 2,
      NODE_RADIUS: 18,
      LEVEL_HEIGHT: 50,
      LINE_WIDTH: 1.5,
      TOP_OFFSET: -80 * 3,
      TREE_TOP:
        typeof window !== "undefined" ? window.innerHeight * 0.35 : 0.35 * 800,
      TREE_CENTER_X:
        typeof window !== "undefined" ? 0.5 * window.innerWidth : 400,
      HORIZONTAL_SPACING:
        typeof window !== "undefined" ? 0.6 * window.innerWidth : 0.6 * 800,
    };
  } else {
    return {
      BOX_WIDTH: 45,
      BOX_HEIGHT: 45,
      BOX_GAP: 6,
      BOX_BORDER_RADIUS: 6,
      BOX_FONT_SIZE: 12,
      NODE_FONT_SIZE: 12,
      ARROW_SIZE: 5,
      ARROW_FONT_SIZE: 10,
      ECLIPSE_HEIGHT: 50,
      TOTAL_BOX_SPACING: 45 + 6,
      ARROW_Y_OFFSET_DOWN: (45 * 2.4) / 2,
      ARROW_X_OFFSET: 45 / 2,
      NODE_RADIUS: 16,
      LEVEL_HEIGHT: 50,
      LINE_WIDTH: 1,
      TOP_OFFSET: -80,
      TREE_TOP: 50,
      TREE_CENTER_X: 250,
      HORIZONTAL_SPACING: 40,
      ECLIPSE_HEIGHT_NODE: 60,
    };
  }
};

interface SidebarProps {
  isOpen: boolean;
  width: number;
}

const HeapSort: React.FC<SidebarProps> = ({ isOpen, width }: SidebarProps) => {
  const getFixedInitialArray = () => [42, 17, 89, 31, 65, 8];
  const initialArray = getFixedInitialArray();

  // State management
  const [array, setArray] = useState<number[]>(initialArray);
  const [arraySize, setArraySize] = useState<number>(6);
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
  const arrayNodeRef = useRef<(HTMLDivElement | null)[]>([]);
  const edgeRefs = useRef<Map<string, SVGLineElement>>(new Map());
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const wasPausedRef = useRef<boolean>(false);
  const propsRef = useRef({ array, speed, isAscending, isPlaying });
  const svgRef = useRef<SVGSVGElement>(null);
  const heapTreeLabelRef = useRef<HTMLDivElement | null>(null);
  const currentStepRef = useRef<number>(0);
  const totalStepsRef = useRef<number>(0);

  const tabTitles = ["HeapSort", "buildHeap", "heapify"] as const;
  const pseudoCode = [
    [
      "Algorithm HeapSort(array, size):",
      "",
      "   buildHeap(array, size)",
      "",
      "   for i ← (size - 1) to 1 do",
      "       swap array[0] and array[i]",
      "       heapify(array, i, 0)",
      "",
      "return array",
    ],
    [
      "Procedure buildHeap(array, size):",
      "",
      "   for i ← ((size / 2) - 1) to 0 do",
      "       heapify(array, size, i)",
    ],
    [
      "Procedure heapify(array, size, root):",
      "",
      "   largest ← root",
      "   left ← 2 * root + 1",
      "   right ← 2 * root + 2",
      "",
      "   if left < size AND array[left] > array[largest] then",
      "       largest ← left",
      "",
      "   if right < size AND array[right] > array[largest] then",
      "       largest ← right",
      "",
      "   if largest ≠ root then",
      "       swap array[root] and array[largest]",
      "       heapify(array, size, largest)",
    ],
  ];

  const dynamicSizing = getDynamicSizing(array.length);
  const {
    BOX_WIDTH,
    BOX_HEIGHT,
    BOX_GAP,
    BOX_BORDER_RADIUS,
    BOX_FONT_SIZE,
    NODE_FONT_SIZE,
    ECLIPSE_HEIGHT,
    TOTAL_BOX_SPACING,
    TOP_OFFSET,
    NODE_RADIUS,
    LEVEL_HEIGHT,
    TREE_TOP,
    TREE_CENTER_X,
    HORIZONTAL_SPACING,
    ECLIPSE_HEIGHT_NODE,
  } = dynamicSizing;

  // Helper functions using reusable animations
  const animateSortedIndicator = (
    indices: number | number[],
  ): gsap.core.Timeline => {
    const targetIndices = Array.isArray(indices) ? indices : [indices];
    const elements = targetIndices
      .map((index) => arrayElementsRef.current[index])
      .filter((el): el is HTMLDivElement => el instanceof HTMLDivElement);

    return markAsSorted(elements);
  };

  const highlightElement = (
    index: number,
    color: string,
  ): gsap.core.Timeline => {
    const arrayElement = arrayElementsRef.current[index];
    const timeline = gsap.timeline();

    if (!arrayElement) return timeline;

    if (color === "red") {
      return highlightRed(arrayElement);
    } else if (color === "blue") {
      return highlightBlue(arrayElement);
    }

    return timeline;
  };

  const removeHighlight = (index: number): gsap.core.Timeline => {
    const arrayElement = arrayElementsRef.current[index];
    if (!arrayElement) return gsap.timeline();
    return removeHighlightBase(arrayElement);
  };

  const eclipseSwapNodes = (
    indexA: number,
    indexB: number,
    duration: number = 1.2,
  ): gsap.core.Timeline => {
    const timeline = gsap.timeline();

    const elementA = arrayNodeRef.current?.[indexA];
    const elementB = arrayNodeRef.current?.[indexB];

    if (!elementA || !elementB) {
      return timeline;
    }

    const posA = getNodePosition(indexA, array.length);
    const posB = getNodePosition(indexB, array.length);

    const deltaX = posB.x - posA.x;
    const deltaY = posB.y - posA.y;

    const x = Math.abs(deltaX);
    const y = Math.abs(deltaY);
    const h = Math.sqrt(x * x + y * y);
    const d = (x * y) / (h || 1);

    const eclipseScale = ECLIPSE_HEIGHT_NODE / (d || 1);
    const scaledX = x * eclipseScale;
    const scaledY = y * eclipseScale;

    const midX = deltaX / 2;
    const midY = deltaY / 2;

    const perpOffsetX =
      deltaY !== 0 ? (ECLIPSE_HEIGHT_NODE * deltaY) / (h || 1) : 0;
    const perpOffsetY =
      deltaX !== 0
        ? -(ECLIPSE_HEIGHT_NODE * deltaX) / (h || 1)
        : ECLIPSE_HEIGHT_NODE;

    const swapAnimation = gsap.timeline();

    swapAnimation
      .to(
        elementA,
        {
          x: `+=${midX + perpOffsetX}`,
          y: `+=${midY + perpOffsetY}`,
          duration: duration / 2,
          ease: "power2.out",
        },
        0,
      )
      .to(
        elementA,
        {
          x: `+=${midX - perpOffsetX}`,
          y: `+=${midY - perpOffsetY}`,
          duration: duration / 2,
          ease: "power2.in",
        },
        duration / 2,
      )
      .to(
        elementB,
        {
          x: `+=${-midX - perpOffsetX}`,
          y: `+=${-midY - perpOffsetY}`,
          duration: duration / 2,
          ease: "power2.out",
        },
        0,
      )
      .to(
        elementB,
        {
          x: `+=${-midX + perpOffsetX}`,
          y: `+=${-midY + perpOffsetY}`,
          duration: duration / 2,
          ease: "power2.in",
        },
        duration / 2,
      );

    swapAnimation.call(() => {
      gsap.set([elementA, elementB], { rotation: 0 });
    });

    timeline.add(swapAnimation);

    return timeline;
  };

  const createSingleEdge = (
    parentIndex: number,
    childIndex: number,
    svg: SVGSVGElement,
  ): SVGLineElement | null => {
    const parentPos = getNodePosition(parentIndex, array.length);
    const childPos = getNodePosition(childIndex, array.length);

    const svgRect = svg.getBoundingClientRect();

    const x1 = parentPos.x - svgRect.left;
    const y1 = parentPos.y - svgRect.top;
    const x2 = childPos.x - svgRect.left;
    const y2 = childPos.y - svgRect.top;

    const edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
    edge.setAttribute("x1", `${x1}`);
    edge.setAttribute("y1", `${y1}`);
    edge.setAttribute("x2", `${x1}`);
    edge.setAttribute("y2", `${y1}`);
    edge.setAttribute("stroke", "#bdbdbd");
    edge.setAttribute("stroke-width", "3");
    edge.setAttribute("fill", "none");
    edge.setAttribute("opacity", "0");
    edge.setAttribute("class", `heap-edge edge-${parentIndex}-${childIndex}`);

    svg.appendChild(edge);

    if (edgeRefs.current) {
      edgeRefs.current.set(`${parentIndex},${childIndex}`, edge);
    }

    return edge;
  };

  const createAllEdges = (
    svg: SVGSVGElement,
    n: number,
  ): gsap.core.Timeline => {
    if (svg) {
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
    }
    if (edgeRefs.current) {
      edgeRefs.current.clear();
    }

    const timeline = gsap.timeline();

    const levels: number[][] = [];
    let level = 0;
    let count = 1;
    let index = 0;
    while (index < n) {
      const levelIndices: number[] = [];
      for (let i = 0; i < count && index < n; i++, index++) {
        levelIndices.push(index);
      }
      levels.push(levelIndices);
      count *= 2;
      level++;
    }

    const levelStagger = 1;
    const edgeDuration = 1;

    for (let l = 1; l < levels.length; l++) {
      const levelTimeline = gsap.timeline();
      for (const childIndex of levels[l]) {
        const parentIndex = Math.floor((childIndex - 1) / 2);
        const edge = createSingleEdge(parentIndex, childIndex, svg);
        if (edge) {
          const parentPos = getNodePosition(parentIndex, n);
          const childPos = getNodePosition(childIndex, n);
          const svgRect = svg.getBoundingClientRect();
          const x1 = parentPos.x - svgRect.left;
          const y1 = parentPos.y - svgRect.top;
          const x2 = childPos.x - svgRect.left;
          const y2 = childPos.y - svgRect.top;
          levelTimeline.add(
            animateEdgeExtend(edge, x1, y1, x2, y2, edgeDuration),
            0,
          );
        }
      }
      timeline.add(levelTimeline, l * levelStagger);
    }

    return timeline;
  };

  const resetAnimation = (): void => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    if (arrayElementsRef.current) {
      arrayElementsRef.current.forEach((element) => {
        if (element) {
          resetElement(element);
        }
      });
    }

    if (arrayNodeRef.current) {
      arrayNodeRef.current.forEach((node, idx) => {
        if (node && node.parentNode) {
          try {
            node.parentNode.removeChild(node);
          } catch (e) {
            // Defensive: ignore if already removed
          }
        }
        arrayNodeRef.current[idx] = null;
      });
    }

    if (svgRef.current) {
      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }
    }
    edgeRefs.current.clear();

    const existingSvg = document.getElementById("heap-tree-svg");
    if (existingSvg) {
      while (existingSvg.firstChild) {
        existingSvg.removeChild(existingSvg.firstChild);
      }
    }

    if (heapTreeLabelRef.current) {
      gsap.set(heapTreeLabelRef.current, { opacity: 0 });
    }

    wasPausedRef.current = false;
    currentStepRef.current = 0;
  };

  function getNodeX(
    index: number,
    total: number,
    left: number,
    right: number,
  ): number {
    const level = Math.floor(Math.log2(index + 1));
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);

    const width = right - left;
    const nodeWidth = width / totalInLevel;

    return left + nodeWidth * positionInLevel + nodeWidth / 2;
  }

  const getNodePosition = (index: number, total: number) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelIndex = index - (2 ** level - 1);
    const nodesInLevel = Math.min(2 ** level, total - (2 ** level - 1));

    let baseX = getNodeX(
      index,
      total,
      typeof window !== "undefined"
        ? (window.innerWidth - HORIZONTAL_SPACING) / 2
        : 300,
      typeof window !== "undefined"
        ? (window.innerWidth - HORIZONTAL_SPACING) / 2 + HORIZONTAL_SPACING
        : 800,
    );

    if (isOpen) {
      baseX += width / 2;
    }

    const y = TREE_TOP + level * LEVEL_HEIGHT;

    return { x: baseX, y };
  };

  const handleToggleCodePanel = () => {
    setShowCodePanel(!showCodePanel);
  };

  const createHeapNode = (
    value: number,
    index: number,
    x: number,
    y: number,
  ): HTMLDivElement => {
    const node = document.createElement("div");
    node.className = "heap-node";
    node.style.position = "absolute";
    node.style.left = `${x - NODE_RADIUS}px`;
    node.style.top = `${y - NODE_RADIUS}px`;
    node.style.width = `${NODE_RADIUS * 2}px`;
    node.style.height = `${NODE_RADIUS * 2}px`;
    node.style.borderRadius = "50%";
    node.style.background = "#fff";
    node.style.border = "2px solid #007bff";
    node.style.display = "flex";
    node.style.alignItems = "center";
    node.style.justifyContent = "center";
    node.style.fontWeight = "bold";
    node.style.fontSize = `${NODE_FONT_SIZE}px`;
    node.style.boxShadow = "0 2px 8px rgba(0,0,0,0.10)";
    node.style.transition = "all 0.3s ease";
    node.style.zIndex = "2";
    node.style.opacity = "0";
    node.textContent = value.toString();
    node.setAttribute("data-index", index.toString());
    return node;
  };

  function heapify(
    arr: number[],
    n: number,
    i: number,
    isMaxHeap: boolean = propsRef.current.isAscending,
    isRecursiveCall: boolean = false,
    returnToTab: number = 0,
  ): GSAPTimeline {
    const timeline = gsap.timeline();

    if (!isRecursiveCall) {
      timeline.add(switchToTab(setShowPseudoCode, 2), "+=0.2");
    }

    timeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        0,
        2,
        showPseudoCode,
      ),
    );

    let target = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (arrayNodeRef.current) {
      const indicesToGrey: number[] = [];
      const collectSubtreeIndices = (root: number) => {
        if (root >= n) return;
        indicesToGrey.push(root);
        collectSubtreeIndices(2 * root + 1);
        collectSubtreeIndices(2 * root + 2);
      };
      collectSubtreeIndices(i);
      timeline.add(greyOutOtherNodes(arrayNodeRef, indicesToGrey));
    }

    timeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        [2, 3, 4],
        2,
        showPseudoCode,
      ),
    );

    if (arrayNodeRef.current) {
      timeline.add(highlightNode(arrayNodeRef, target));
    }
    timeline.add(highlightElement(i, "blue"));

    timeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        6,
        2,
        showPseudoCode,
      ),
      "+=0.3",
    );

    if (arrayNodeRef.current && left < n && arrayNodeRef.current[left]) {
      timeline.add(highlightNode(arrayNodeRef, left));
      timeline.add(pause(0.3));
      timeline.add(removeHighlightNode(arrayNodeRef, left));
      timeline.add(highlightElement(left, "blue"));
      timeline.add(pause(0.3));
      timeline.add(removeHighlight(left));
    }

    if (left < n) {
      if (isMaxHeap && arr[left] > arr[target]) {
        timeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            7,
            2,
            showPseudoCode,
          ),
          "+=0.1",
        );
        target = left;
      } else if (!isMaxHeap && arr[left] < arr[target]) {
        timeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            7,
            2,
            showPseudoCode,
          ),
          "+=0.1",
        );
        target = left;
      }
    }

    timeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        9,
        2,
        showPseudoCode,
      ),
      "+=0.3",
    );

    if (arrayNodeRef.current && right < n && arrayNodeRef.current[right]) {
      timeline.add(highlightNode(arrayNodeRef, right));
      timeline.add(pause(0.3));
      timeline.add(removeHighlightNode(arrayNodeRef, right));
      timeline.add(highlightElement(right, "blue"));
      timeline.add(pause(0.3));
      timeline.add(removeHighlight(right));
    }

    if (right < n) {
      if (isMaxHeap && arr[right] > arr[target]) {
        timeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            10,
            2,
            showPseudoCode,
          ),
          "+=0.1",
        );
        target = right;
      } else if (!isMaxHeap && arr[right] < arr[target]) {
        timeline.add(
          updatePseudoCodeLine(
            setCurrentPseudoCodeLine,
            setShowPseudoCode,
            10,
            2,
            showPseudoCode,
          ),
          "+=0.1",
        );
        target = right;
      }
    }

    timeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        12,
        2,
        showPseudoCode,
      ),
      "+=0.3",
    );

    if (target !== i) {
      timeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          13,
          2,
          showPseudoCode,
        ),
      );

      if (
        arrayNodeRef.current &&
        arrayNodeRef.current[i] &&
        arrayNodeRef.current[target]
      ) {
        timeline.add(eclipseSwapNodes(i, target));

        if (
          arrayElementsRef.current &&
          arrayElementsRef.current[i] &&
          arrayElementsRef.current[target]
        ) {
          timeline.add(
            eclipseSwap(
              arrayElementsRef,
              arrayElementsRef.current[i],
              arrayElementsRef.current[target],
              ECLIPSE_HEIGHT,
              1.2,
              TOTAL_BOX_SPACING,
            ),
          );

          const tempRef = arrayElementsRef.current[i];
          arrayElementsRef.current[i] = arrayElementsRef.current[target];
          arrayElementsRef.current[target] = tempRef;
          timeline.call(() => {});
        }

        if (
          arrayNodeRef.current &&
          arrayNodeRef.current[i] &&
          arrayNodeRef.current[target]
        ) {
          [arrayNodeRef.current[i], arrayNodeRef.current[target]] = [
            arrayNodeRef.current[target],
            arrayNodeRef.current[i],
          ];
        }
      }

      [arr[i], arr[target]] = [arr[target], arr[i]];

      timeline.add(pause(1.5));
      timeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          14,
          2,
          showPseudoCode,
        ),
      );
      timeline.add(pause(0.3));

      timeline.add(switchToTab(setShowPseudoCode, returnToTab), "+=0.2");

      timeline.add(heapify(arr, n, target, isMaxHeap, true, returnToTab));
    } else {
      if (!isRecursiveCall) {
        timeline.add(switchToTab(setShowPseudoCode, returnToTab), "+=0.2");
      } else {
        timeline.add(switchToTab(setShowPseudoCode, returnToTab), "+=0.2");
      }

      timeline.add(restoreOnlyNodes(arrayNodeRef, [i]));
      timeline.add(removeHighlightNode(arrayNodeRef, i));
      timeline.add(removeHighlight(i));
    }

    return timeline;
  }

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
    const isMaxHeap = propsRef.current.isAscending;

    mainTimeline.addLabel("step-0");
    mainTimeline.call(() => {
      currentStepRef.current = 0;
    });
    let stepIndex = 1;
    mainTimeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        0,
        0,
        showPseudoCode,
      ),
    );

    mainTimeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        2,
        0,
        showPseudoCode,
      ),
    );

    if (arrayElementsRef.current) {
      const elements = arrayElementsRef.current.filter(Boolean);
      mainTimeline.add(
        gsap.to(elements, {
          y: TOP_OFFSET,
          duration: 1,
          ease: "power1.inOut",
          stagger: 0.1,
        }),
      );
    }

    if (arrayNodeRef.current) {
      arrayNodeRef.current.forEach((node) => {
        if (node && node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
      arrayNodeRef.current = [];
    }

    const svg = svgRef.current;
    if (!svg) {
      console.error("SVG element not found");
      return;
    }

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    arrayNodeRef.current = [];
    mainTimeline.add(pause(1));

    if (heapTreeLabelRef.current) {
      gsap.set(heapTreeLabelRef.current, { opacity: 0, y: 0 });
      mainTimeline.add(
        gsap.to(heapTreeLabelRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        }),
      );
    }

    mainTimeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        2,
        1,
        showPseudoCode,
      ),
      "-=1.3",
    );

    for (let i = 0; i < n; i++) {
      const { x, y } = getNodePosition(i, n);
      const node = createHeapNode(arr[i], i, x, y);

      if (containerRef.current) {
        containerRef.current.appendChild(node);
        arrayNodeRef.current.push(node);

        mainTimeline.add(rotationRevealAnimation(node), `-=${1.6 - i * 0.1}`);
      }
    }

    mainTimeline.add(createAllEdges(svg, n), "-=1.2");

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      const thisStep = stepIndex;
      mainTimeline.addLabel(`step-${thisStep}`);
      mainTimeline.call(() => {
        currentStepRef.current = thisStep;
      });
      stepIndex++;

      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          3,
          1,
          showPseudoCode,
        ),
      );
      mainTimeline.add(pause(0.3));

      mainTimeline.add(heapify(arr, n, i, isMaxHeap, false, 1));
    }

    if (heapTreeLabelRef.current) {
      mainTimeline.add(() => {
        if (heapTreeLabelRef.current) {
          heapTreeLabelRef.current.textContent = isMaxHeap
            ? "Max heap tree"
            : "Min heap tree";
        }
      });
      mainTimeline.to(
        heapTreeLabelRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        0,
      );
    }

    mainTimeline.add(switchToTab(setShowPseudoCode, 0), "+=0.2");

    mainTimeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        4,
        0,
        showPseudoCode,
      ),
      "+=0.3",
    );

    for (let i = n - 1; i > 0; i--) {
      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          4,
          0,
          showPseudoCode,
        ),
        "+=0.3",
      );
      {
        const thisStep = stepIndex;
        mainTimeline.addLabel(`step-${thisStep}`);
        mainTimeline.call(() => {
          currentStepRef.current = thisStep;
        });
        stepIndex++;
      }

      mainTimeline.add(
        updatePseudoCodeLine(
          setCurrentPseudoCodeLine,
          setShowPseudoCode,
          5,
          0,
          showPseudoCode,
        ),
        "+=0.2",
      );

      if (arrayNodeRef.current) {
        mainTimeline.add(highlightNode(arrayNodeRef, 0));
        mainTimeline.add(highlightNode(arrayNodeRef, i));
      }

      [arr[0], arr[i]] = [arr[i], arr[0]];

      mainTimeline.add(highlightElement(0, "blue"));
      mainTimeline.add(highlightElement(i, "blue"));

      if (
        arrayNodeRef.current &&
        arrayNodeRef.current[0] &&
        arrayNodeRef.current[i]
      ) {
        mainTimeline.add(eclipseSwapNodes(0, i));
        mainTimeline.call(() => {});
        [arrayNodeRef.current[0], arrayNodeRef.current[i]] = [
          arrayNodeRef.current[i],
          arrayNodeRef.current[0],
        ];
      }

      if (
        arrayElementsRef.current &&
        arrayElementsRef.current[0] &&
        arrayElementsRef.current[i]
      ) {
        mainTimeline.add(
          eclipseSwap(
            arrayElementsRef,
            arrayElementsRef.current[0] as HTMLDivElement,
            arrayElementsRef.current[i] as HTMLDivElement,
            ECLIPSE_HEIGHT,
            1.2,
            TOTAL_BOX_SPACING,
          ),
        );
        mainTimeline.call(() => {});
        const temp = arrayElementsRef.current[0];
        arrayElementsRef.current[0] = arrayElementsRef.current[i];
        arrayElementsRef.current[i] = temp;
      }

      if (arrayNodeRef.current) {
        mainTimeline.add(removeHighlightNode(arrayNodeRef, 0));
        mainTimeline.add(removeHighlightNode(arrayNodeRef, i));
      }
      mainTimeline.add(removeHighlight(0));
      mainTimeline.add(removeHighlight(i));

      mainTimeline.add(animateSortedIndicator(i));

      if (arrayNodeRef.current && arrayNodeRef.current[i]) {
        if (arrayNodeRef.current[i]) {
          mainTimeline.add(
            rotationHideAnimation(arrayNodeRef.current[i] as HTMLDivElement),
          );
        }
      }

      mainTimeline.call(() => {
        if (arrayNodeRef.current && arrayNodeRef.current[i]) {
          arrayNodeRef.current[i] = null;
        }
      });

      if (i > 0 && svgRef.current && edgeRefs.current) {
        const parentIndex = Math.floor((i - 1) / 2);

        const edgeKey = `${parentIndex},${i}`;
        const edge = edgeRefs.current.get(edgeKey);
        if (edge) {
          const parentPos = getNodePosition(parentIndex, arr.length);
          const childPos = getNodePosition(i, arr.length);
          const svgRect = svgRef.current.getBoundingClientRect();
          const x1 = parentPos.x - svgRect.left;
          const y1 = parentPos.y - svgRect.top;
          const x2 = childPos.x - svgRect.left;
          const y2 = childPos.y - svgRect.top;
          mainTimeline.add(animateEdgeCompress(edge, x1, y1, x2, y2, 0.5));
        }
      }
      {
        const thisStep = stepIndex;
        mainTimeline.addLabel(`step-${thisStep}`);
        mainTimeline.call(() => {
          currentStepRef.current = thisStep;
        });
        stepIndex++;
      }

      mainTimeline.add(pause(0.3));

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

      mainTimeline.add(heapify(arr, i, 0, isMaxHeap, false, 0));
    }

    mainTimeline.add(animateSortedIndicator(0));
    {
      const thisStep = stepIndex;
      mainTimeline.addLabel(`step-${thisStep}`);
      mainTimeline.call(() => {
        currentStepRef.current = thisStep;
      });
      stepIndex++;
    }

    if (arrayNodeRef.current && arrayNodeRef.current[0]) {
      mainTimeline.add(
        rotationHideAnimation(arrayNodeRef.current[0] as HTMLDivElement),
      );
    }
    if (heapTreeLabelRef.current) {
      mainTimeline.add(
        gsap.to(heapTreeLabelRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        }),
      );
    }

    if (arrayElementsRef.current) {
      const elements = arrayElementsRef.current.filter(Boolean);
      mainTimeline.add(
        gsap.to(elements, {
          y: 0,
          duration: 1,
          ease: "power1.inOut",
          stagger: 0.1,
        }),
      );
    }

    mainTimeline.add(
      updatePseudoCodeLine(
        setCurrentPseudoCodeLine,
        setShowPseudoCode,
        8,
        0,
        showPseudoCode,
      ),
      "-=1.5",
    );

    totalStepsRef.current = stepIndex;
    currentStepRef.current = 0;
    mainTimeline.addLabel("end");

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

  const pauseAnimation = (): void => {
    if (timelineRef.current) {
      timelineRef.current.pause();
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

    if (currentStepRef.current === 0 && edgeRefs.current) {
      edgeRefs.current.forEach((edge) => {
        if (edge instanceof SVGLineElement) {
          edge.setAttribute("opacity", "0");
        }
      });
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

  useEffect(() => {
    const svg = document.getElementById(
      "heap-tree-svg",
    ) as SVGSVGElement | null;
    const label = document.getElementById(
      "heap-tree-label",
    ) as HTMLDivElement | null;

    if (svg) {
      const fromLeft = svg.style.left || "50%";
      const toLeft = isOpen ? `calc(50% + ${width / 2}px)` : "50%";
      gsap.fromTo(
        svg,
        { left: fromLeft },
        { left: toLeft, duration: 0.3, ease: "power1.inOut" },
      );
    }

    if (label) {
      const fromLeft = label.style.left || "50%";
      const toLeft = isOpen ? `calc(50% + ${width / 2}px)` : "50%";
      gsap.fromTo(
        label,
        { left: fromLeft },
        { left: toLeft, duration: 0.3, ease: "power1.inOut" },
      );
    }

    if (arrayNodeRef.current.length) {
      arrayNodeRef.current.forEach((node, index) => {
        if (node && node.parentNode) {
          const { x, y } = getNodePosition(index, array.length);

          gsap.to(node, {
            left: `${x - NODE_RADIUS}px`,
            top: `${y - NODE_RADIUS}px`,
            duration: 0,
            ease: "power1.inOut",
          });
        }
      });
    }
  }, [isOpen, width]);

  return (
    <div>
      <div className="mb-8">
        <div
          ref={containerRef}
          className="heapsort-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#1a1a1a",
            minHeight: array.length > 9 ? "400px" : "200px",
            zIndex: 0,
          }}
        >
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
                key={`array-${index}-${value}`}
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
          </div>
        </div>
      </div>

      <div
        ref={heapTreeLabelRef}
        style={{
          position: "absolute",
          left: isOpen ? `calc(50% + ${width / 2}px)` : "50%",
          top: "27%",
          transform: "translateX(-50%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "18px",
          fontWeight: "600",
          color: "#000000",
          opacity: 0,
          zIndex: 1001,
        }}
      >
        Heap Tree
      </div>

      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          left: isOpen ? `calc(50% + ${width / 2}px)` : "50%",
          top: "200px",
          transform: "translateX(-50%)",
          width: "70%",
          height: array.length > 9 ? "60%" : "50%",
          borderRadius: "8px",
          pointerEvents: "none",
          opacity: 1,
        }}
      />

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

export default HeapSort;
