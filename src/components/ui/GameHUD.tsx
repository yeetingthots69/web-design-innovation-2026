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
    Box,
    Collapse,
} from "@mantine/core";
import { IconRefresh, IconHelp, IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useGameStore } from "@/stores/gameStore";
import { ELEMENT_TYPES, ElementType } from "@/data/elements";
import { TutorialModal } from "./TutorialModal";
import classes from "./GameHUD.module.css";

/**
 * Element selector button
 */
function ElementButton({ type, compact = false }: { type: ElementType; compact?: boolean }) {
    const { activeElement, setActiveElement } = useGameStore();
    const config = ELEMENT_TYPES[type];
    const isActive = activeElement === type;

    return (
        <Tooltip label={`${config.nameVi} (${config.name})`} position="top">
            <ActionIcon
                size={compact ? "md" : "xl"}
                variant={isActive ? "filled" : "outline"}
                color="cyan"
                className={compact ? classes.elementButtonCompact : classes.elementButton}
                style={{
                    borderColor: config.color,
                    backgroundColor: isActive ? config.color : "transparent",
                    boxShadow: isActive
                        ? `0 0 15px ${config.color}`
                        : "none",
                }}
                onClick={() =>
                    setActiveElement(isActive ? null : type)
                }
            >
                <Text
                    size={compact ? "sm" : "lg"}
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
 * Mobile HUD Component
 * Compact, game-style HUD for mobile devices
 */
function MobileHUD() {
    const { harmonyScore, resetGrid, activeElement } = useGameStore();
    const [tutorialOpened, { open: openTutorial, close: closeTutorial }] = useDisclosure(false);
    const [inventoryOpen, { toggle: toggleInventory }] = useDisclosure(true);

    const getHarmonyColor = () => {
        if (harmonyScore >= 80) return "cyan";
        if (harmonyScore >= 60) return "teal";
        if (harmonyScore >= 40) return "yellow";
        return "magenta";
    };

    return (
        <>
            {/* Mobile Top Bar - Compact header with essential info */}
            <Box className={classes.mobileTopBar}>
                <Group justify="space-between" align="center" h="100%">
                    {/* Left: Title */}
                    <Text
                        size="sm"
                        fw={700}
                        c="cyan"
                        style={{
                            letterSpacing: "0.15em",
                            textShadow: "0 0 10px rgba(0, 242, 255, 0.5)",
                        }}
                    >
                        GEOMANCER
                    </Text>

                    {/* Center: Harmony Score */}
                    <Group gap={6} className={classes.mobileHarmonyGroup}>
                        <Text size="sm" fw={700} c={getHarmonyColor()}>
                            {harmonyScore}%
                        </Text>
                        <Progress
                            value={harmonyScore}
                            color={getHarmonyColor()}
                            size="xs"
                            className={classes.mobileProgress}
                        />
                    </Group>

                    {/* Right: Action buttons */}
                    <Group gap={4}>
                        <ActionIcon
                            variant="subtle"
                            color="cyan"
                            size="sm"
                            onClick={openTutorial}
                        >
                            <IconHelp size={16} />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            color="cyan"
                            size="sm"
                            onClick={resetGrid}
                        >
                            <IconRefresh size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Box>

            {/* Mobile Bottom Bar - Element Inventory */}
            <Box className={classes.mobileBottomBar}>
                {/* Toggle button */}
                <ActionIcon
                    variant="subtle"
                    color="cyan"
                    size="xs"
                    className={classes.inventoryToggle}
                    onClick={toggleInventory}
                >
                    {inventoryOpen ? <IconChevronDown size={14} /> : <IconChevronUp size={14} />}
                </ActionIcon>

                <Collapse in={inventoryOpen}>
                    <Stack gap={6} align="center" py={6}>
                        {/* Selected element indicator */}
                        <Text size="xs" c={activeElement ? "cyan" : "dimmed"} fw={500}>
                            {activeElement
                                ? ELEMENT_TYPES[activeElement].nameVi
                                : "Chọn Nguyên Tố"}
                        </Text>

                        {/* Element buttons in compact row */}
                        <Group gap={8} justify="center">
                            <ElementButton type="fire" compact />
                            <ElementButton type="water" compact />
                            <ElementButton type="wood" compact />
                            <ElementButton type="metal" compact />
                            <ElementButton type="earth" compact />
                        </Group>

                        {/* Mobile hint */}
                        <Text size="xs" c="dimmed">
                            Chạm để đặt • Giữ để xóa
                        </Text>
                    </Stack>
                </Collapse>
            </Box>

            {/* Tutorial Modal */}
            <TutorialModal opened={tutorialOpened} onClose={closeTutorial} />
        </>
    );
}

/**
 * Desktop HUD Component
 * Full-featured HUD for larger screens
 */
function DesktopHUD() {
    const { harmonyScore, oracleMessage, resetGrid, activeElement } =
        useGameStore();
    const [tutorialOpened, { open: openTutorial, close: closeTutorial }] =
        useDisclosure(false);

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
                        <Group gap="sm">
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
                        size="lg"
                        fw={700}
                        c="cyan"
                        className={classes.gameTitle}
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
                    <Paper className={classes.cameraHint} p="xs">
                        <Text size="xs" c="dimmed">
                            🖱️ Kéo để xoay • Cuộn để zoom
                        </Text>
                    </Paper>

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

/**
 * GameHUD Component
 * Responsive HUD that switches between mobile and desktop layouts
 */
export function GameHUD() {
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Return null during SSR, then render appropriate HUD
    if (isMobile === undefined) {
        return null;
    }

    return isMobile ? <MobileHUD /> : <DesktopHUD />;
}
