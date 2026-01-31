"use client";

import {use, useState, useEffect} from "react";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";
import {Box, Modal, Stack, Text, Title, Button, Group, Badge, Paper, Collapse, ActionIcon} from "@mantine/core";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";
import {IconCheck, IconAlertTriangle, IconChevronDown, IconChevronUp} from "@tabler/icons-react";
import {GameHUD} from "@/components/ui/GameHUD";
import {useGameStore} from "@/stores/gameStore";
import {MissionRequest} from "@/data/types";
import {ELEMENT_TYPES, ElementType} from "@/data/elements";
import requests from "@/data/requests.json";
import classes from "./page.module.css";

// Dynamic import for Three.js components (no SSR)
const SceneContainer = dynamic(
    () =>
        import("@/components/game/SceneContainer").then(
            (mod) => mod.SceneContainer
        ),
    {ssr: false}
);

interface PageProps {
    params: Promise<{id: string}>;
}

/**
 * Mission Game Page
 * The Architect's Grid - Main gameplay for a specific mission
 */
export default function MissionGamePage({params}: PageProps) {
    const {id} = use(params);
    const router = useRouter();
    const [resultOpened, {open: openResult, close: closeResult}] = useDisclosure(false);
    const [briefingExpanded, {toggle: toggleBriefing}] = useDisclosure(true);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        details: string[];
    } | null>(null);

    const isMobile = useMediaQuery("(max-width: 768px)");
    const {grid, harmonyScore, resetGrid, setGridShape} = useGameStore();

    // Find mission data
    const mission = (requests as MissionRequest[]).find((r) => r.id === id);

    // Set grid shape and reset when mission changes
    useEffect(() => {
        if (mission?.mission.grid_shape) {
            setGridShape(mission.mission.grid_shape);
        } else {
            resetGrid();
        }
    }, [id, mission, resetGrid, setGridShape]);

    if (!mission) {
        return (
            <Box className={classes.container}>
                <Stack align="center" justify="center" h="100vh">
                    <Title c="magenta">LỖI: KHÔNG TÌM THẤY NHIỆM VỤ</Title>
                    <Button onClick={() => router.push("/")}>Quay Lại</Button>
                </Stack>
            </Box>
        );
    }

    // Validate and compile (NẠP KHÍ)
    const handleCompile = () => {
        const details: string[] = [];
        let success = true;

        // Get all placed elements
        const placedElements = new Set<ElementType>();
        for (let x = 0; x < 4; x++) {
            for (let z = 0; z < 4; z++) {
                const cell = grid[x][z];
                if (cell.element) {
                    placedElements.add(cell.element);
                }
            }
        }

        // Check harmony score
        if (harmonyScore >= mission.requirements.min_harmony_score) {
            details.push(`✓ Độ hài hòa: ${harmonyScore}% (yêu cầu: ${mission.requirements.min_harmony_score}%)`);
        } else {
            details.push(`✗ Độ hài hòa: ${harmonyScore}% (yêu cầu: ${mission.requirements.min_harmony_score}%)`);
            success = false;
        }

        // Check must_include
        for (const element of mission.requirements.constraints.must_include) {
            if (placedElements.has(element)) {
                details.push(`✓ Có ${ELEMENT_TYPES[element].nameVi} (${ELEMENT_TYPES[element].name})`);
            } else {
                details.push(`✗ Thiếu ${ELEMENT_TYPES[element].nameVi} (${ELEMENT_TYPES[element].name})`);
                success = false;
            }
        }

        // Check must_avoid
        for (const element of mission.requirements.constraints.must_avoid) {
            if (!placedElements.has(element)) {
                details.push(`✓ Không có ${ELEMENT_TYPES[element].nameVi} (đã tránh)`);
            } else {
                details.push(`✗ Có ${ELEMENT_TYPES[element].nameVi} (phải tránh!)`);
                success = false;
            }
        }

        // Generate result message
        const message = success
            ? `Độ hòa hợp: ${harmonyScore}%. Nhiệm vụ hoàn thành. Qi đã được cân bằng.`
            : `Lỗi nghiêm trọng. Cấu hình chưa đạt yêu cầu.`;

        setResult({success, message, details});
        openResult();
    };

    return (
        <Box className={classes.container}>
            {/* 3D Scene */}
            <SceneContainer/>

            {/* Game HUD with mission info */}
            <GameHUD/>

            {/* Mission Briefing Card - Collapsible on mobile */}
            <Box className={classes.briefingCard}>
                <Paper p={isMobile ? "xs" : "md"} className={classes.briefingPaper}>
                    <Stack gap="xs">
                        {/* Header - always visible, clickable on mobile */}
                        <Group
                            justify="space-between"
                            onClick={isMobile ? toggleBriefing : undefined}
                            style={isMobile ? {cursor: "pointer"} : undefined}
                        >
                            <Group gap="xs">
                                <Text size="xs" c="cyan" tt="uppercase" fw={600}>
                                    {isMobile ? mission.client.name : "Khách Hàng"}
                                </Text>
                                {isMobile && (
                                    <ActionIcon size="xs" variant="subtle" color="cyan">
                                        {briefingExpanded ? <IconChevronUp size={12}/> : <IconChevronDown size={12}/>}
                                    </ActionIcon>
                                )}
                            </Group>
                            <Badge
                                color={
                                    mission.mission.difficulty === "Dễ"
                                        ? "green"
                                        : mission.mission.difficulty === "Trung Bình"
                                            ? "yellow"
                                            : "magenta"
                                }
                                variant="outline"
                                size="xs"
                            >
                                {mission.mission.difficulty}
                            </Badge>
                        </Group>

                        {/* Collapsible content on mobile */}
                        <Collapse in={!isMobile || briefingExpanded}>
                            <Stack gap="xs">
                                {!isMobile && (
                                    <>
                                        <Title order={4} c="white">
                                            {mission.client.name}
                                        </Title>
                                        <Text size="xs" c="dimmed">
                                            {mission.client.role}
                                        </Text>
                                    </>
                                )}
                                <Text size={isMobile ? "xs" : "sm"} c="gray.4">
                                    &ldquo;{mission.client.description}&rdquo;
                                </Text>
                                <Text size="xs" c="cyan" mt={isMobile ? 4 : "sm"}>
                                    {"// Mục tiêu: "}{mission.requirements.min_harmony_score}{"% hài hòa"}
                                </Text>
                                {mission.requirements.constraints.must_include.length > 0 && (
                                    <Text size="xs" c="green">
                                        {"// Cần: "}{mission.requirements.constraints.must_include.map(e => ELEMENT_TYPES[e].nameVi).join(", ")}
                                    </Text>
                                )}
                                {mission.requirements.constraints.must_avoid.length > 0 && (
                                    <Text size="xs" c="magenta">
                                        {"// Cấm: "}{mission.requirements.constraints.must_avoid.map(e => ELEMENT_TYPES[e].nameVi).join(", ")}
                                    </Text>
                                )}
                            </Stack>
                        </Collapse>
                    </Stack>
                </Paper>
            </Box>

            {/* Compile Button */}
            <Box className={classes.compileButton}>
                <Button
                    size="lg"
                    color="cyan"
                    onClick={handleCompile}
                    leftSection={<IconCheck size={20}/>}
                >
                    NẠP KHÍ
                </Button>
            </Box>

            {/* Result Modal */}
            <Modal
                opened={resultOpened}
                onClose={closeResult}
                title={
                    <Group gap="sm">
                        {result?.success ? (
                            <IconCheck size={24} color="#00f2ff"/>
                        ) : (
                            <IconAlertTriangle size={24} color="#ff0055"/>
                        )}
                        <Text
                            fw={700}
                            size="lg"
                            c={result?.success ? "cyan" : "magenta"}
                        >
                            {result?.success ? "NHIỆM VỤ HOÀN THÀNH" : "LỖI HỆ THỐNG"}
                        </Text>
                    </Group>
                }
                size="md"
                fullScreen={false}
                centered
            >
                <Stack gap="md">
                    <Text size="lg" ta="center" c="white">
                        {result?.message}
                    </Text>

                    <Paper p="md" bg="dark.9">
                        <Stack gap="xs">
                            {result?.details.map((detail, idx) => (
                                <Text
                                    key={idx}
                                    size="sm"
                                    c={detail.startsWith("✓") ? "green" : "magenta"}
                                >
                                    {detail}
                                </Text>
                            ))}
                        </Stack>
                    </Paper>

                    <Group justify="center" mt="md">
                        {result?.success ? (
                            <Button color="cyan" onClick={() => router.push("/")}>
                                Nhiệm Vụ Tiếp Theo
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" color="cyan" onClick={closeResult}>
                                    Thử Lại
                                </Button>
                                <Button
                                    variant="subtle"
                                    color="gray"
                                    onClick={() => {
                                        resetGrid();
                                        closeResult();
                                    }}
                                >
                                    Reset Lưới
                                </Button>
                            </>
                        )}
                    </Group>
                </Stack>
            </Modal>
        </Box>
    );
}
