// NEO-HÀNH Element Types and Ngũ Hành (Five Elements) Data

export type ElementType = "fire" | "water" | "wood" | "metal" | "earth";

export interface ElementConfig {
    id: ElementType;
    name: string;
    nameVi: string;
    color: string;
    emissiveIntensity: number;
    shape: "tetrahedron" | "sphere" | "box" | "octahedron" | "cylinder";
}

export const ELEMENT_TYPES: Record<ElementType, ElementConfig> = {
    fire: {
        id: "fire",
        name: "Fire",
        nameVi: "Hỏa",
        color: "#ff0055",
        emissiveIntensity: 2,
        shape: "tetrahedron",
    },
    water: {
        id: "water",
        name: "Water",
        nameVi: "Thủy",
        color: "#4d4dff",
        emissiveIntensity: 1.5,
        shape: "sphere",
    },
    wood: {
        id: "wood",
        name: "Wood",
        nameVi: "Mộc",
        color: "#00ff9d",
        emissiveIntensity: 1.2,
        shape: "box",
    },
    metal: {
        id: "metal",
        name: "Metal",
        nameVi: "Kim",
        color: "#e0e0e0",
        emissiveIntensity: 1,
        shape: "octahedron",
    },
    earth: {
        id: "earth",
        name: "Earth",
        nameVi: "Thổ",
        color: "#ffaa00",
        emissiveIntensity: 0.8,
        shape: "cylinder",
    },
} as const;

// Generation cycle (Buffs): Water -> Wood -> Fire -> Earth -> Metal -> Water
export const GENERATION_CYCLE: Record<ElementType, ElementType> = {
    water: "wood",
    wood: "fire",
    fire: "earth",
    earth: "metal",
    metal: "water",
};

// Destruction cycle (Debuffs): Water -> Fire, Fire -> Metal, Metal -> Wood, Wood -> Earth, Earth -> Water
export const DESTRUCTION_CYCLE: Record<ElementType, ElementType> = {
    water: "fire",
    fire: "metal",
    metal: "wood",
    wood: "earth",
    earth: "water",
};

/**
 * Check if source element generates (buffs) target element
 */
export function isGenerating(source: ElementType, target: ElementType): boolean {
    return GENERATION_CYCLE[source] === target;
}

/**
 * Check if source element destroys (debuffs) target element
 */
export function isDestroying(source: ElementType, target: ElementType): boolean {
    return DESTRUCTION_CYCLE[source] === target;
}

/**
 * Get the relationship between two elements
 */
export function getRelationship(
    source: ElementType,
    target: ElementType
): "generates" | "destroys" | "neutral" {
    if (isGenerating(source, target)) return "generates";
    if (isDestroying(source, target)) return "destroys";
    return "neutral";
}
