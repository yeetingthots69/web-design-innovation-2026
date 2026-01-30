import { create } from "zustand";
import { ElementType, getRelationship } from "@/data/elements";

// Grid cell state
export interface GridCell {
    x: number;
    z: number;
    element: ElementType | null;
    isGlitching: boolean;
    bloomIntensity: number;
    isEnabled: boolean;  // Whether tile can be used
}

// Game state interface
interface GameState {
    // 4x4 grid
    grid: GridCell[][];
    // Grid shape (which cells are enabled)
    gridShape: number[][];
    // Currently selected element to place
    activeElement: ElementType | null;
    // Harmony score (0-100)
    harmonyScore: number;
    // Oracle message
    oracleMessage: string;
    // Hovered tile
    hoveredTile: { x: number; z: number } | null;

    // Actions
    setActiveElement: (element: ElementType | null) => void;
    placeElement: (x: number, z: number, element: ElementType) => void;
    removeElement: (x: number, z: number) => void;
    setHoveredTile: (tile: { x: number; z: number } | null) => void;
    calculateHarmony: () => void;
    resetGrid: () => void;
    setGridShape: (shape: number[][]) => void;
}

// Default full grid shape
const DEFAULT_GRID_SHAPE = [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
];

// Initialize grid with shape
const createGridWithShape = (shape: number[][]): GridCell[][] => {
    const grid: GridCell[][] = [];
    for (let x = 0; x < 4; x++) {
        grid[x] = [];
        for (let z = 0; z < 4; z++) {
            grid[x][z] = {
                x,
                z,
                element: null,
                isGlitching: false,
                bloomIntensity: 1,
                isEnabled: shape[x]?.[z] === 1,
            };
        }
    }
    return grid;
};

// Get adjacent cells (only enabled ones)
const getAdjacentCells = (
    grid: GridCell[][],
    x: number,
    z: number
): GridCell[] => {
    const adjacent: GridCell[] = [];
    const directions = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ];

    for (const [dx, dz] of directions) {
        const nx = x + dx;
        const nz = z + dz;
        if (nx >= 0 && nx < 4 && nz >= 0 && nz < 4 && grid[nx][nz].isEnabled) {
            adjacent.push(grid[nx][nz]);
        }
    }

    return adjacent;
};

export const useGameStore = create<GameState>((set, get) => ({
    grid: createGridWithShape(DEFAULT_GRID_SHAPE),
    gridShape: DEFAULT_GRID_SHAPE,
    activeElement: null,
    harmonyScore: 50,
    oracleMessage: "HỆ THỐNG ĐANG CHỜ... Đặt nguyên tố để bắt đầu.",
    hoveredTile: null,

    setActiveElement: (element) => set({ activeElement: element }),

    setHoveredTile: (tile) => set({ hoveredTile: tile }),

    placeElement: (x, z, element) => {
        const { grid } = get();
        const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

        // Place the element
        newGrid[x][z].element = element;
        newGrid[x][z].isGlitching = false;
        newGrid[x][z].bloomIntensity = 1;

        // Check relationships with adjacent cells
        const adjacent = getAdjacentCells(newGrid, x, z);

        for (const adj of adjacent) {
            if (adj.element) {
                const relationship = getRelationship(element, adj.element);
                const reverseRelationship = getRelationship(adj.element, element);

                // Generation buff - increase bloom
                if (relationship === "generates") {
                    newGrid[adj.x][adj.z].bloomIntensity = Math.min(
                        newGrid[adj.x][adj.z].bloomIntensity + 0.5,
                        3
                    );
                }
                if (reverseRelationship === "generates") {
                    newGrid[x][z].bloomIntensity = Math.min(
                        newGrid[x][z].bloomIntensity + 0.5,
                        3
                    );
                }

                // Destruction debuff - trigger glitch
                if (relationship === "destroys") {
                    newGrid[adj.x][adj.z].isGlitching = true;
                    // Reset glitch after animation
                    setTimeout(() => {
                        set((state) => {
                            const updatedGrid = state.grid.map((row) =>
                                row.map((cell) => ({ ...cell }))
                            );
                            updatedGrid[adj.x][adj.z].isGlitching = false;
                            return { grid: updatedGrid };
                        });
                    }, 500);
                }
                if (reverseRelationship === "destroys") {
                    newGrid[x][z].isGlitching = true;
                    setTimeout(() => {
                        set((state) => {
                            const updatedGrid = state.grid.map((row) =>
                                row.map((cell) => ({ ...cell }))
                            );
                            updatedGrid[x][z].isGlitching = false;
                            return { grid: updatedGrid };
                        });
                    }, 500);
                }
            }
        }

        set({ grid: newGrid });
        get().calculateHarmony();
    },

    removeElement: (x, z) => {
        const { grid } = get();
        const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
        newGrid[x][z].element = null;
        newGrid[x][z].bloomIntensity = 1;
        newGrid[x][z].isGlitching = false;
        set({ grid: newGrid });
        get().calculateHarmony();
    },

    calculateHarmony: () => {
        const { grid } = get();
        let generationCount = 0;
        let destructionCount = 0;

        // Count element pairs
        const elementCounts: Record<ElementType, number> = {
            fire: 0,
            water: 0,
            wood: 0,
            metal: 0,
            earth: 0,
        };

        // Count elements and check relationships
        for (let x = 0; x < 4; x++) {
            for (let z = 0; z < 4; z++) {
                const cell = grid[x][z];
                if (cell.element) {
                    elementCounts[cell.element]++;

                    // Check right and down neighbors only (to avoid counting twice)
                    const neighbors = [
                        { nx: x + 1, nz: z },
                        { nx: x, nz: z + 1 },
                    ];

                    for (const { nx, nz } of neighbors) {
                        if (nx < 4 && nz < 4 && grid[nx][nz].element) {
                            // Check both directions of the relationship
                            const rel = getRelationship(
                                cell.element,
                                grid[nx][nz].element!
                            );
                            const reverseRel = getRelationship(
                                grid[nx][nz].element!,
                                cell.element
                            );
                            // Count if either direction generates/destroys
                            if (rel === "generates" || reverseRel === "generates") generationCount++;
                            if (rel === "destroys" || reverseRel === "destroys") destructionCount++;
                        }
                    }
                }
            }
        }

        // Calculate harmony score
        let score = 50; // Base score
        score += generationCount * 15; // Bonus for generation
        score -= destructionCount * 10; // Penalty for destruction
        score = Math.max(0, Math.min(100, score));

        // Generate oracle message
        let message = `PHÂN TÍCH: ${score}%. `;

        if (score >= 80) {
            message += "ÂM DƯƠNG CÂN BẰNG. Năng lượng hài hòa.";
        } else if (score >= 60) {
            message += "Trạng thái ổn định. Có thể tối ưu thêm.";
        } else if (score >= 40) {
            message += "CẢNH BÁO: Mất cân bằng được phát hiện.";
        } else {
            message += "NGUY HIỂM: Xung đột nguyên tố nghiêm trọng!";
        }

        // Add specific warnings
        if (elementCounts.fire > elementCounts.water) {
            message += " // HỆ THỐNG QUÁ NHIỆT. Thêm Thủy (Water).";
        }
        if (elementCounts.metal > elementCounts.wood + 1) {
            message += " // Kim quá mạnh. Cần Mộc để cân bằng.";
        }

        set({ harmonyScore: score, oracleMessage: message });
    },

    resetGrid: () => {
        const { gridShape } = get();
        set({
            grid: createGridWithShape(gridShape),
            harmonyScore: 50,
            oracleMessage: "HỆ THỐNG ĐÃ RESET. Sẵn sàng cho cấu hình mới.",
        });
    },

    setGridShape: (shape) => {
        set({
            gridShape: shape,
            grid: createGridWithShape(shape),
            harmonyScore: 50,
            oracleMessage: "HỆ THỐNG ĐANG CHỜ... Đặt nguyên tố để bắt đầu.",
        });
    },
}));
