"use client";

import {
    Modal,
    Stack,
    Title,
    Text,
    Group,
    Box,
    Divider,
    List,
    Badge,
    ThemeIcon,
} from "@mantine/core";
import {
    IconArrowsMove,
    IconZoomIn,
    IconClick,
    IconHandClick,
} from "@tabler/icons-react";
import classes from "./TutorialModal.module.css";

interface TutorialModalProps {
    opened: boolean;
    onClose: () => void;
}

/**
 * TutorialModal Component
 * Shows players how to play the game with Ngũ Hành rules
 */
export function TutorialModal({ opened, onClose }: TutorialModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Text fw={700} size="lg" c="cyan" tt="uppercase" style={{ letterSpacing: "0.15em" }}>
                    Hướng Dẫn Chơi
                </Text>
            }
            size="lg"
        >
            <Stack gap="md">
                {/* Lore intro */}
                <Box className={classes.loreBox}>
                    <Text size="sm" c="dimmed" fs="italic">
                        Neo-Saigon, 2077. Bạn là Thầy Phong Thủy 4.0 - một Digital Geomancer.
                        Khách hàng gửi đến những bố cục bị hỏng. Nhiệm vụ của bạn là đặt các node
                        nguyên tố để khôi phục dòng chảy Qi.
                    </Text>
                </Box>

                <Divider color="cyan.9" />

                {/* Controls */}
                <Box>
                    <Title order={5} c="cyan" mb="sm">
                        Điều Khiển
                    </Title>
                    <List spacing="xs" size="sm">
                        <List.Item
                            icon={
                                <ThemeIcon color="cyan" variant="light" size="sm">
                                    <IconClick size={14} />
                                </ThemeIcon>
                            }
                        >
                            <Text size="sm">
                                <strong>Click ô lưới:</strong> Đặt nguyên tố đã chọn
                            </Text>
                        </List.Item>
                        <List.Item
                            icon={
                                <ThemeIcon color="cyan" variant="light" size="sm">
                                    <IconHandClick size={14} />
                                </ThemeIcon>
                            }
                        >
                            <Text size="sm">
                                <strong>Ctrl + Click:</strong> Xóa nguyên tố
                            </Text>
                        </List.Item>
                        <List.Item
                            icon={
                                <ThemeIcon color="cyan" variant="light" size="sm">
                                    <IconArrowsMove size={14} />
                                </ThemeIcon>
                            }
                        >
                            <Text size="sm">
                                <strong>Kéo chuột:</strong> Xoay camera
                            </Text>
                        </List.Item>
                        <List.Item
                            icon={
                                <ThemeIcon color="cyan" variant="light" size="sm">
                                    <IconZoomIn size={14} />
                                </ThemeIcon>
                            }
                        >
                            <Text size="sm">
                                <strong>Cuộn chuột:</strong> Phóng to/thu nhỏ
                            </Text>
                        </List.Item>
                    </List>
                </Box>

                <Divider color="cyan.9" />

                {/* Ngũ Hành Rules */}
                <Box>
                    <Title order={5} c="cyan" mb="sm">
                        Quy Tắc Ngũ Hành
                    </Title>

                    {/* Generation cycle */}
                    <Box mb="md">
                        <Group gap="xs" mb="xs">
                            <Badge color="green" variant="light">
                                Tương Sinh (Buff)
                            </Badge>
                        </Group>
                        <Text size="sm" c="dimmed" mb="xs">
                            Khi đặt nguyên tố cạnh nguyên tố nó sinh ra, cả hai sẽ sáng hơn:
                        </Text>
                        <Text size="sm" c="neonGreen" className={classes.cycleText}>
                            Thủy → Mộc → Hỏa → Thổ → Kim → Thủy
                        </Text>
                        <Text size="xs" c="dimmed" mt="xs">
                            (Nước nuôi Gỗ, Gỗ nuôi Lửa, Lửa tạo Đất, Đất sinh Kim, Kim sinh Nước)
                        </Text>
                    </Box>

                    {/* Destruction cycle */}
                    <Box>
                        <Group gap="xs" mb="xs">
                            <Badge color="magenta" variant="light">
                                Tương Khắc (Debuff)
                            </Badge>
                        </Group>
                        <Text size="sm" c="dimmed" mb="xs">
                            Khi đặt nguyên tố cạnh nguyên tố nó khắc, sẽ có hiệu ứng glitch:
                        </Text>
                        <Text size="sm" c="magenta" className={classes.cycleText}>
                            Thủy ⊗ Hỏa • Hỏa ⊗ Kim • Kim ⊗ Mộc • Mộc ⊗ Thổ • Thổ ⊗ Thủy
                        </Text>
                        <Text size="xs" c="dimmed" mt="xs">
                            (Nước dập Lửa, Lửa chảy Kim, Kim chặt Gỗ, Gỗ hút Đất, Đất ngăn Nước)
                        </Text>
                    </Box>
                </Box>

                <Divider color="cyan.9" />

                {/* Win Condition */}
                <Box>
                    <Title order={5} c="cyan" mb="sm">
                        Điều Kiện Thắng
                    </Title>
                    <List spacing="xs" size="sm">
                        <List.Item>
                            <Text size="sm">
                                Đạt điểm hài hòa tối thiểu theo yêu cầu nhiệm vụ
                            </Text>
                        </List.Item>
                        <List.Item>
                            <Text size="sm">
                                Sử dụng các nguyên tố bắt buộc (nếu có)
                            </Text>
                        </List.Item>
                        <List.Item>
                            <Text size="sm">
                                Tránh các nguyên tố bị cấm (nếu có)
                            </Text>
                        </List.Item>
                    </List>
                    <Text size="sm" c="cyan" mt="sm">
                        Nhấn <strong>NẠP KHÍ</strong> khi hoàn tất để kiểm tra kết quả!
                    </Text>
                </Box>

                {/* Element Legend */}
                <Divider color="cyan.9" />
                <Box>
                    <Title order={5} c="cyan" mb="sm">
                        Ký Hiệu Nguyên Tố
                    </Title>
                    <Group gap="md">
                        <Badge leftSection="🔥" color="red" variant="outline">Hỏa</Badge>
                        <Badge leftSection="💧" color="blue" variant="outline">Thủy</Badge>
                        <Badge leftSection="🌲" color="green" variant="outline">Mộc</Badge>
                        <Badge leftSection="⚙️" color="gray" variant="outline">Kim</Badge>
                        <Badge leftSection="🏔️" color="yellow" variant="outline">Thổ</Badge>
                    </Group>
                </Box>
            </Stack>
        </Modal>
    );
}
