"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Grid2, Button, Typography, Paper, Container, Snackbar, Alert, Slide, TextField, MenuItem } from '@mui/material';
import NavBar from '@/app/components/nav-bar';
import AlertDialog from '@/app/components/confirmation';

function CoursesAndLessons({ setnoti }) {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [user, setUser] = React.useState(null);
    const [infoChanged, setInfoChanged] = React.useState(false);
    const router = useRouter();

    const [cName, setCName] = React.useState(null);
    const [cSubject, setCSubject] = React.useState(null);
    const [cYear, setCYear] = React.useState(null);
    const [cSeason, setCSeason] = React.useState(null);

    useEffect(() => {
        async function fetchSessionLessons() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setTimeout(() => {
                        router.push("/");
                    }, 50);
                    return;
                }

                const sessionRes = await fetch("/api/session", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!sessionRes.ok) {
                    setUser(null);
                    setTimeout(() => {
                        router.push("/");
                    }, 50);
                    return;
                }

                const sessionData = await sessionRes.json();
                setUser(sessionData.user);

                const courseRes = await fetch(`/api/userCourses/${id}`);
                if (!courseRes.ok) throw new Error("Failed to fetch course data");

                const courseData = await courseRes.json();
                console.log(courseData.course.student_list);
                console.log(sessionData.user.id);
                console.log(sessionData.user);
                if (!courseData.course.student_list.includes(sessionData.user.id) && sessionData.user.role === "student") {
                    setnoti(true);
                } else {
                    setCourseData(courseData);
                }
            } catch (error) {
                console.error("Error fetching session or lessons:", error);
            }
        }

        fetchSessionLessons();
    }, [id, router]);


    if (!courseData) return <Typography>正在加载……</Typography>;

    const { course, lessons } = courseData;

    const handleDropCourse = () => {
        // wip
        alert('Course dropped!');
    };

    const changeCourseInfo = async () => {
        const res = await fetch(`/api/userCourses/modify?name=${cName}&subject=${cSubject}&year=${cYear}&season=${cSeason}`);
        if (res.ok) {
            alert('Course changed!');
            window.location.reload();
        } else {
            alert('Course change failed. Please try again later.');
            console.log(res.error);
            window.location.reload();
        }
    }

    const seasonMapping = {
        1: "春季",
        2: "夏季",
        3: "秋季",
        4: "冬季"
    }

    const seasonChoices = [
        { label: "春季", value: 1 },
        { label: "夏季", value: 2 },
        { label: "秋季", value: 3 },
        { label: "冬季", value: 4 },
    ]

    return (
        <>
            <Grid2 container spacing={2}>
                <Grid2 item="true" size={12}>
                    <Box
                        bgcolor="white"
                        p={2}
                        borderRadius={2}
                        boxShadow={1}
                    >
                        {user.role === "student" ?
                            <>
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
                                    description={<><Typography>退出{course.year}年{seasonMapping[course.season]}的{course.course_name}后，你将无法继续查看该课程内容。</Typography><Typography>退课后，请及时与管理员协商退费事宜。</Typography></>}
                                    agreeAction={handleDropCourse}
                                /></> : <>
                                <Box component="form">
                                    <Grid2 container>
                                        <Grid2 item="true" size={12} sx={{ mb: 1 }}>
                                            <TextField required={true} variant='standard' label="课程名称" defaultValue={course.course_name} onChange={(e) => { setInfoChanged(true); setCName(e.target.value); }} />
                                        </Grid2>
                                        <Grid2 item="true" size={12} sx={{ mt: 1, mb: 1 }}>
                                            <TextField required={true} variant='standard' label="科目" defaultValue={course.subject} onChange={(e) => { setInfoChanged(true); setCSubject(e.target.value); }} />
                                        </Grid2>
                                        <Grid2 item="true" size={12} sx={{ mt: 1, mb: 1 }}>
                                            <TextField required={true} variant='standard' label="年份" defaultValue={course.year} onChange={(e) => { setInfoChanged(true); setCYear(e.target.value); }} />
                                        </Grid2>
                                        <Grid2 item="true" size={12} sx={{ mt: 1, mb: 1 }}>
                                            <TextField required={true} select variant='standard' label="学期" defaultValue={course.season} onChange={(e) => { setInfoChanged(true); setCSeason(e.target.value); }} >
                                                {seasonChoices.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid2>
                                        <Grid2 item="true" size={12}>
                                            <AlertDialog
                                                button={<Button
                                                    variant="outlined"
                                                    style={{ marginTop: '16px' }}
                                                    id='alertButton'
                                                    onSubmit={() => { }}
                                                    disabled={!infoChanged}
                                                >
                                                    确认
                                                </Button>}
                                                title={`确定要修改该课程信息吗？`}
                                                description={<><Typography>请确认填写的信息正确，修改后，所有人可见。</Typography></>}
                                                agreeAction={changeCourseInfo}
                                            />
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                style={{ marginTop: '16px' }}
                                                disabled={!infoChanged}
                                                onClick={() => { window.location.reload(); }}
                                            >
                                                取消
                                            </Button>
                                        </Grid2>
                                    </Grid2>
                                </Box>
                            </>
                        }
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
        </>
    );
}

export default function CoursePage() {
    const [notiOpen, setNoti] = React.useState(false);
    const router = useRouter();

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
                    <CoursesAndLessons setnoti={setNoti} />
                </Box>
                <Snackbar
                    open={notiOpen}
                    autoHideDuration={3000}
                    TransitionComponent={props => <Slide {...props} direction="right" />}
                    onClose={() => { setNoti(false); router.push("/dashboard"); return; }}
                >
                    <Alert severity='error' variant='filled' sx={{ width: '100%' }}>
                        你没有报名这节课！
                    </Alert>
                </Snackbar>
            </Container >
        </>
    );
}
