"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Grid2, Button, Typography, Paper, Container } from '@mui/material';
import NavBar from '@/app/components/nav-bar';
import AlertDialog from '@/app/components/confirmation';

function CoursesAndLessons() {
    const router = useRouter();
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);

    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await fetch(`/api/userCourses/${id}`);
                if (!res.ok) throw new Error("Failed to fetch course data");

                const data = await res.json();
                setCourseData(data);
            } catch (error) {
                console.error("Error fetching lessons:", error);
            }
        }

        if (id) fetchLessons();
    }, [id]);

    if (!courseData) return <Typography>Loading...</Typography>;

    const { course, lessons } = courseData;

    const handleDropCourse = () => {
        // wip
        alert('Course dropped!');
    };

    const seasonMapping = {
        1: "春季",
        2: "夏季",
        3: "秋季",
        4: "冬季"
    }

    return (
        <Grid2 container spacing={2}>
            <Grid2 item="true" size={12}>
                <Box
                    bgcolor="white"
                    p={2}
                    borderRadius={2}
                    boxShadow={1}
                >
                    <Typography variant="h6">{course.course_name}</Typography>
                    <Typography>科目：{course.subject}</Typography>
                    <Typography>年份：{course.year}</Typography>
                    <Typography>学期：{seasonMapping[course.season]}</Typography>
                    <AlertDialog
                        button={<Button
                            variant="contained"
                            color="error"
                            style={{ marginTop: '16px' }}
                            id='alertButton'
                        >
                            退课
                        </Button>}
                        title={`确定要退出${course.course_name}吗？`}
                        description={<><Typography>退出{course.year}年{course.season}的{course.course_name}后，你将无法继续查看该课程内容。</Typography><Typography>退课后，请及时与管理员协商退费事宜。</Typography></>}
                        agreeAction={handleDropCourse}
                    />
                </Box>
            </Grid2>

            <Grid2 item="true" size={12}>
                <Box
                    bgcolor="white"
                    p={2}
                    borderRadius={2}
                    boxShadow={1}
                >
                    <Typography variant="h6">课程列表</Typography>
                    <Grid2 container spacing={2} marginTop={2}>
                        {lessons.map((lesson) => {
                            const isPast = new Date(lesson.date) < Date.now();
                            const cancelled = lesson.status === "cancelled";
                            const replayAvailable = lesson.replay_link !== null;
                            return (
                                <Grid2
                                    item="true"
                                    size={12}
                                    key={lesson.id}
                                    style={{
                                        color: (isPast || cancelled) ? 'gray' : 'black',
                                    }}
                                >
                                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ wordWrap: 'break-word' }}>
                                        <Grid2 container direction={'column'}>
                                            <Grid2 item="true" size={12}>
                                                <Typography sx={{ justifySelf: "flex-start", textDecoration: (cancelled ? "line-through" : "") }}>
                                                    {lesson.name}
                                                </Typography>
                                            </Grid2>
                                            <Grid2 item="true" size={12}>
                                                <Typography sx={{ justifySelf: "flex-start", textDecoration: (cancelled ? "line-through" : "") }}>
                                                    日期：{new Date(`${lesson.date}`).toLocaleString("zh-CN", { year: "numeric", month: "numeric", day: "numeric" })} 开始时间：{lesson.start_time} 持续时间：{lesson.duration.hours || "00"}:{lesson.duration.minutes || "00"}:{lesson.duration.seconds || "00"}
                                                </Typography>
                                            </Grid2>
                                        </Grid2>
                                        <Box sx={{ justifySelf: "flex-end" }}>
                                            <Button
                                                variant="outlined"
                                                disabled={isPast || cancelled}
                                                style={{ marginRight: '8px' }}
                                            >
                                                请假
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                disabled={isPast || cancelled}
                                                style={{ marginRight: '8px' }}
                                            >
                                                调课
                                            </Button>
                                            <Button variant="outlined" disabled={!replayAvailable || cancelled} href={lesson.replay_link} target='_blank'>
                                                查看回放
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid2>
                            );
                        })}
                    </Grid2>
                </Box>
            </Grid2>
        </Grid2>
    );
}

export default function CoursePage() {
    const router = useRouter();
    const [user, setUser] = React.useState(null);

    useEffect(() => {
        async function fetchSession() {
            const token = localStorage.getItem("token");
            if (!token) {
                setTimeout(() => {
                    router.push("/");
                }, 50);
                return;
            }

            const res = await fetch("/api/session", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
                setTimeout(() => {
                    router.push("/");
                }, 50);
                return;
            }
        }

        fetchSession();
    }, []);

    return (
        <>
            <NavBar />
            <Container maxWidth="xl" sx={{ marginTop: 5 }}>
                <Box>
                    <Typography
                        sx={{ textAlign: "center", fontSize: 30 }}
                    >
                        课程详情
                    </Typography>
                </Box>
                <Box sx={{ mt: 5, mb: 10 }}>
                    <CoursesAndLessons />
                </Box>
            </Container >
        </>
    );
}
