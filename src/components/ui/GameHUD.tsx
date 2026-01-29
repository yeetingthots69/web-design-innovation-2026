"use client";

import {
    Affix,
    Paper,
    Group,
    Stack,
    Text,
    ActionIcon,
    Tooltip,
    Progress,
} from "@mantine/core";
import { IconRefresh, IconHelp } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useGameStore } from "@/stores/gameStore";
import { ELEMENT_TYPES, ElementType } from "@/data/elements";
import { TutorialModal } from "./TutorialModal";
import classes from "./GameHUD.module.css";

/**
 * Element selector button
 */
function ElementButton({ type }: { type: ElementType }) {
    const { activeElement, setActiveElement } = useGameStore();
    const config = ELEMENT_TYPES[type];
    const isActive = activeElement === type;

    return (
        <Tooltip label={`${config.nameVi} (${config.name})`} position="top">
            <ActionIcon
                size="xl"
                variant={isActive ? "filled" : "outline"}
                color="cyan"
                className={classes.elementButton}
                style={{
                    borderColor: config.color,
                    backgroundColor: isActive ? config.color : "transparent",
                    boxShadow: isActive
                        ? `0 0 20px ${config.color}`
                        : "none",
                }}
                onClick={() =>
                    setActiveElement(isActive ? null : type)
                }
            >
                <Text
                    size="lg"
                    fw={700}
                    c={isActive ? "dark.9" : "white"}
                >
                    {config.nameVi.charAt(0)}
                </Text>
            </ActionIcon>
        </Tooltip>
    );
}

/**
 * GameHUD Component
 * UI overlay displayed on top of the 3D canvas.
 * Includes element inventory, oracle messages, and harmony score.
 */
export function GameHUD() {
    const { harmonyScore, oracleMessage, resetGrid, activeElement } =
        useGameStore();
    const [tutorialOpened, { open: openTutorial, close: closeTutorial }] =
        useDisclosure(false);

    // Determine harmony color
    const getHarmonyColor = () => {
        if (harmonyScore >= 80) return "cyan";
        if (harmonyScore >= 60) return "teal";
        if (harmonyScore >= 40) return "yellow";
        return "magenta";
    };

    return (
        <>
            {/* Oracle/Briefing Card - Top Right */}
            <Affix position={{ top: 20, right: 20 }}>
                <Paper className={classes.oracleCard} p="md">
                    <Stack gap="xs">
                        <Group justify="space-between">
                            {/* Oracle Analysis */}
                            <Text
                                size="xs"
                                tt="uppercase"
                                c="cyan"
                                fw={600}
                                style={{ letterSpacing: "0.2em" }}
                            >
                                Oracle Analysis
                            </Text>
                            <Group gap="xs">
                                <Tooltip label="Hướng dẫn">
                                    <ActionIcon
                                        variant="subtle"
                                        color="cyan"
                                        size="sm"
                                        onClick={openTutorial}
                                    >
                                        <IconHelp size={14} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Reset Grid">
                                    <ActionIcon
                                        variant="subtle"
                                        color="cyan"
                                        size="sm"
                                        onClick={resetGrid}
                                    >
                                        <IconRefresh size={14} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>

                        {/* Harmony Score */}
                        <Group gap="xs" align="center">
                            <Text size="xl" fw={700} c={getHarmonyColor()}>
                                {harmonyScore}%
                            </Text>
                            <Progress
                                value={harmonyScore}
                                color={getHarmonyColor()}
                                size="sm"
                                style={{ flex: 1 }}
                                className={classes.progressBar}
                            />
                        </Group>

                        {/* Oracle Message - split lines starting with // */}
                        <Stack gap={4} className={classes.oracleMessage}>
                            {oracleMessage.split(/(?=\/\/)/).map((line, idx) => (
                                <Text
                                    key={idx}
                                    size="sm"
                                    c={line.trim().startsWith("//") ? "cyan" : "dimmed"}
                                    fw={line.trim().startsWith("//") ? 500 : 400}
                                >
                                    {line.trim()}
                                </Text>
                            ))}
                        </Stack>
                    </Stack>
                </Paper>
            </Affix>

            {/* Element Inventory - Bottom Center */}
            <Affix position={{ bottom: 20, left: "50%" }} className={classes.inventoryAffix}>
                <Paper className={classes.inventoryBar} p="md">
                    <Stack gap="sm" align="center">
                        <Text
                            size="xs"
                            tt="uppercase"
                            c="dimmed"
                            style={{ letterSpacing: "0.15em" }}
                        >
                            {activeElement
                                ? `Đã chọn: ${ELEMENT_TYPES[activeElement].nameVi}`
                                : "Chọn Nguyên Tố"}
                        </Text>
                        <Group gap="md">
                            <ElementButton type="fire" />
                            <ElementButton type="water" />
                            <ElementButton type="wood" />
                            <ElementButton type="metal" />
                            <ElementButton type="earth" />
                        </Group>
                        <Text size="xs" c="dimmed">
                            Click ô lưới để đặt • Ctrl+Click để xóa
                        </Text>
                    </Stack>
                </Paper>
            </Affix>

            {/* Title - Top Left */}
            <Affix position={{ top: 20, left: 20 }}>
                <Stack gap={4}>
                    <Text
                        size="xl"
                        fw={700}
                        c="cyan"
                        style={{
                            letterSpacing: "0.3em",
                            textShadow: "0 0 20px rgba(0, 242, 255, 0.5)",
                        }}
                    >
                        GEOMANCER
                    </Text>
                    <Text size="xs" c="dimmed" style={{ letterSpacing: "0.15em" }}>
                        THE HARMONY ARCHITECT
                    </Text>
                </Stack>
            </Affix>

            {/* Camera Controls Hint - Bottom Left */}
            <Affix position={{ bottom: 20, left: 20 }}>
                <Stack gap="xs">
                    {/* Camera hint */}
                    <Paper className={classes.cameraHint} p="xs">
                        <Text size="xs" c="dimmed">
                            🖱️ Kéo để xoay • Cuộn để zoom
                        </Text>
                    </Paper>

                    {/* Instructions Card */}
                    <Paper className={classes.instructionCard} p="sm">
                        <Stack gap={4}>
                            <Text size="xs" c="cyan" fw={600}>
                                NGŨ HÀNH TƯƠNG SINH
                            </Text>
                            <Text size="xs" c="dimmed">
                                Thủy → Mộc → Hỏa → Thổ → Kim → Thủy
                            </Text>
                            <Text size="xs" c="magenta" fw={600} mt={4}>
                                NGŨ HÀNH TƯƠNG KHẮC
                            </Text>
                            <Text size="xs" c="dimmed">
                                Thủy ⊗ Hỏa • Hỏa ⊗ Kim • Kim ⊗ Mộc
                            </Text>
                        </Stack>
                    </Paper>
                </Stack>
            </Affix>

            {/* Tutorial Modal */}
            <TutorialModal opened={tutorialOpened} onClose={closeTutorial} />
        </>
    );
}
