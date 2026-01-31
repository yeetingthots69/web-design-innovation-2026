"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {
    Box,
    Container,
    Title,
    Text,
    Button,
    Stack,
    Group,
    Card,
    Badge,
    SimpleGrid,
} from "@mantine/core";
import {IconPlayerPlay, IconChevronRight, IconInfoCircle} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {motion, AnimatePresence} from "framer-motion";
import {MissionRequest} from "@/data/types";
import {ELEMENT_TYPES} from "@/data/elements";
import {TutorialModal} from "@/components/ui/TutorialModal";
import requests from "@/data/requests.json";
import classes from "./page.module.css";

/**
 * Landing Page - NEO-HÀNH
 * The Gateway with 3D octahedron concept and mission selection
 */
export default function LandingPage() {
    const router = useRouter();
    const [showMissions, setShowMissions] = useState(false);
    const [tutorialOpened, { open: openTutorial, close: closeTutorial }] =
        useDisclosure(false);

    const missions = requests as MissionRequest[];

    const handleInitialize = () => {
        setShowMissions(true);
    };

    const handleSelectMission = (missionId: string) => {
        router.push(`/game/${missionId}`);
    };

    return (
        <Box className={classes.container}>
            {/* Animated background grid */}
            <Box className={classes.gridBackground}/>

            {/* Glow effects */}
            <Box className={classes.glowOrb1}/>
            <Box className={classes.glowOrb2}/>

            {/* Main content */}
            <Container size="lg" className={classes.content}>
                <AnimatePresence mode="wait">
                    {!showMissions ? (
                        // Initial Gateway View
                        <motion.div
                            key="gateway"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0, scale: 0.8}}
                            transition={{duration: 0.5}}
                        >
                            <Stack align="center" gap="xl">
                                {/* Logo/Title */}
                                <Box className={classes.logoContainer}>
                                    <Title order={1} className={classes.mainTitle}>
                                        GEOMANCER
                                    </Title>
                                    <Text className={classes.subtitle}>
                                        THE HARMONY ARCHITECT
                                    </Text>
                                </Box>
                                {/* Tagline */}
                                <Text
                                    size="md"
                                    c="dimmed"
                                    ta="center"
                                    maw={500}
                                    px="md"
                                    className={classes.tagline}
                                >
                                    Neo-Saigon, 2077. Bạn là Thầy Phong Thủy 4.0.
                                    <br/>
                                    Cân bằng Ngũ Hành. Khôi phục dòng chảy Qi.
                                </Text>

                                {/* Element icons preview */}
                                <Group gap="md" className={classes.elementPreview}>
                                    <Box className={classes.elementIcon} data-element="fire">
                                        火
                                    </Box>
                                    <Box className={classes.elementIcon} data-element="water">
                                        水
                                    </Box>
                                    <Box className={classes.elementIcon} data-element="wood">
                                        木
                                    </Box>
                                    <Box className={classes.elementIcon} data-element="metal">
                                        金
                                    </Box>
                                    <Box className={classes.elementIcon} data-element="earth">
                                        土
                                    </Box>
                                </Group>

                                {/* CTA Button */}
                                <Stack gap="sm" mt="xl">
                                    <Button
                                        size="xl"
                                        leftSection={<IconPlayerPlay size={24} />}
                                        onClick={handleInitialize}
                                        className={classes.playButton}
                                    >
                                        Khởi Động Hệ Thống
                                    </Button>
                                    <Button
                                        size="md"
                                        variant="subtle"
                                        color="cyan"
                                        leftSection={<IconInfoCircle size={18} />}
                                        onClick={openTutorial}
                                    >
                                        Hướng Dẫn
                                    </Button>
                                </Stack>

                                {/* Footer text */}
                                <Text size="xs" c="dimmed" mt="xl" className={classes.footer}>
                                    KIM • MỘC • THỦY • HỎA • THỔ
                                </Text>
                            </Stack>
                        </motion.div>
                    ) : (
                        // Mission Select View
                        <motion.div
                            key="missions"
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
                        >
                            <Stack gap="xl" style={{padding: "3rem 0"}}>
                                <Box ta="center">
                                    <Text
                                        size="xs"
                                        c="cyan"
                                        tt="uppercase"
                                        style={{letterSpacing: "0.3em"}}
                                    >
                                        {"// Đang kết nối..."}
                                    </Text>
                                    <Title order={2} c="white" mt="xs">
                                        YÊU CẦU KHÁCH HÀNG
                                    </Title>
                                    <Text size="sm" c="dimmed" mt="xs">
                                        Chọn nhiệm vụ để bắt đầu cân bằng Qi
                                    </Text>
                                </Box>

                                <SimpleGrid cols={{base: 1, sm: 2, md: 3}} spacing="lg">
                                    {missions.map((mission) => (
                                        <Card
                                            key={mission.id}
                                            className={classes.missionCard}
                                            onClick={() => handleSelectMission(mission.id)}
                                        >
                                            <Stack gap="sm">
                                                <Group justify="space-between">
                                                    <Text size="xs" c="cyan" fw={600}>
                                                        {mission.client.role}
                                                    </Text>
                                                    <Badge
                                                        color={
                                                            mission.mission.difficulty === "Dễ"
                                                                ? "green"
                                                                : mission.mission.difficulty === "Trung Bình"
                                                                    ? "yellow"
                                                                    : "magenta"
                                                        }
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        {mission.mission.difficulty}
                                                    </Badge>
                                                </Group>

                                                <Title order={4} c="white">
                                                    {mission.mission.title}
                                                </Title>

                                                <Text size="sm" c="gray.5">
                                                    {mission.client.name}
                                                </Text>

                                                <Text size="xs" c="dimmed" lineClamp={2}>
                                                    &ldquo;{mission.client.description}&rdquo;
                                                </Text>

                                                <Group gap="xs" mt="xs">
                                                    <Text size="xs" c="cyan">
                                                        Cần:
                                                    </Text>
                                                    {mission.requirements.constraints.must_include.map(
                                                        (el) => (
                                                            <Badge
                                                                key={el}
                                                                size="xs"
                                                                variant="dot"
                                                                color="cyan"
                                                            >
                                                                {ELEMENT_TYPES[el].nameVi}
                                                            </Badge>
                                                        )
                                                    )}
                                                </Group>

                                                <Group justify="flex-end" mt="xs">
                                                    <Text size="xs" c="cyan">
                                                        Chọn <IconChevronRight size={12}/>
                                                    </Text>
                                                </Group>
                                            </Stack>
                                        </Card>
                                    ))}
                                </SimpleGrid>

                                <Button
                                    variant="subtle"
                                    color="gray"
                                    onClick={() => setShowMissions(false)}
                                    mt="md"
                                    mx="auto"
                                >
                                    ← Quay Lại
                                </Button>
                            </Stack>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Container>

            {/* Tutorial Modal */}
            <TutorialModal opened={tutorialOpened} onClose={closeTutorial} />
        </Box>
    );
}
