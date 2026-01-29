import { ElementType } from "./elements";

export interface ClientInfo {
    name: string;
    role: string;
    description: string;
}

export interface MissionInfo {
    title: string;
    difficulty: string;
    locked_elements: ElementType[];
    grid_shape: number[][];  // 0 = disabled, 1 = enabled
}

export interface Requirements {
    min_harmony_score: number;
    constraints: {
        must_include: ElementType[];
        must_avoid: ElementType[];
    };
}

export interface MissionRequest {
    id: string;
    client: ClientInfo;
    mission: MissionInfo;
    requirements: Requirements;
}
