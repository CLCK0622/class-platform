"use client";

import { Box, Container, Typography, Grid2, Link, Button } from "@mui/material";
import * as React from "react";
import NavBar from "../components/nav-bar";
import { useRouter } from "next/navigation";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { PushPinRounded } from "@mui/icons-material";

function PersonalInfo({ user }) {
    return (
        <>
            <Box
                bgcolor="white"
                p={2}
                borderRadius={2}
                boxShadow={1}
                height={200}
                textAlign="center"
            >
                <Typography variant="h6" color="black">
                    个人信息
                </Typography>
                <Box height={150} alignContent={"center"}>
                    <Typography variant="body1">
                        用户名：{user ? user.username : ""}
                    </Typography>
                    <Typography variant="body1">
                        ID: {user ? user.id : ""}
                    </Typography>
                    <Typography variant="body1">
                        邮箱地址：{user ? user.email : ""}
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

function CoursesTaken({ user }) {
    const [rows, setRows] = useState([]);

    const seasonMapping = {
        1: "春季",
        2: "夏季",
        3: "秋季",
        4: "冬季",
    };

    useEffect(() => {
        if (!user) return;

        async function fetchCourses() {
            try {
                const response = await fetch(`/api/userCourses?userId=${user.id}`);
                const data = await response.json();
                setRows(data.map((item, index) => ({
                    id: item.id,
                    index: index + 1,
                    courseName: item.course_name,
                    subject: item.subject,
                    year: item.year,
                    season: seasonMapping[item.season] || item.season,
                    teacherName: item.teacher_name,
                })));
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourses();
    }, [user]);

    const columns = [
        {
            field: "courseName", headerName: "课程名称", flex: 2, minWidth: 150,
            renderCell: (params) => (
                <Link underline="hover" href={`/courses/${params.row.id}`}>
                    {params.value}
                </Link>
            ),
        },
        { field: "subject", headerName: "科目", flex: 1.5, minWidth: 100 },
        { field: "year", headerName: "年份", flex: 1, minWidth: 80 },
        { field: "season", headerName: "学期", flex: 1, minWidth: 80 },
        { field: "teacherName", headerName: "授课教师", flex: 1, minWidth: 80 },
    ];

    return (
        <Box
            bgcolor="white"
            p={2}
            borderRadius={2}
            boxShadow={1}
            textAlign="center"
        >
            <Typography variant="h6" color="black" gutterBottom>
                我的课程
            </Typography>
            <Box sx={{ width: "100%" }}>
                <Grid2 container sx={{ justifyContent: "flex-end" }}>
                    <Grid2 item="true" size={12}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowHeight={() => 'auto'}
                            pageSizeOptions={[5, 10, 25, 100]}
                            sx={{ minHeight: 200, maxHeight: 400 }}
                            disableRowSelectionOnClick
                        />
                    </Grid2>
                    <Grid2 item="true" sx={{ mt: 1 }}>
                        <Link underline="hover" href="/courses">查看更多→</Link>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    );
}

function AllCourses({ user }) {
    const [rows, setRows] = useState([]);

    const seasonMapping = {
        1: "春季",
        2: "夏季",
        3: "秋季",
        4: "冬季",
    };

    useEffect(() => {
        if (!user) return;

        async function fetchCourses() {
            try {
                const response = await (user.role == "student" ? fetch(`/api/userCourses?userId=${user.id}`) : fetch(`/api/userCourses/all`));
                const data = await response.json();
                setRows(data.map((item, index) => ({
                    id: item.id,
                    index: index + 1,
                    courseName: item.course_name,
                    subject: item.subject,
                    year: item.year,
                    season: seasonMapping[item.season] || item.season,
                    teacherName: item.teacher_name,
                })));
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourses();
    }, [user]);

    const columns = [
        {
            field: "courseName", headerName: "课程名称", flex: 2, minWidth: 150,
            renderCell: (params) => (
                <Link underline="hover" href={`/courses/${params.row.id}`}>
                    {params.value}
                </Link>
            ),
        },
        { field: "subject", headerName: "科目", flex: 1.5, minWidth: 100 },
        { field: "year", headerName: "年份", flex: 1, minWidth: 80 },
        { field: "season", headerName: "学期", flex: 1, minWidth: 80 },
        { field: "teacherName", headerName: "授课教师", flex: 1, minWidth: 80 },
    ];

    return (
        <Box
            bgcolor="white"
            p={2}
            borderRadius={2}
            boxShadow={1}
            textAlign="center"
        >
            <Typography variant="h6" color="black" gutterBottom>
                我的课程
            </Typography>
            <Box sx={{ width: "100%" }}>
                <Grid2 container sx={{ justifyContent: "flex-end" }}>
                    <Grid2 item="true" size={12}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowHeight={() => 'auto'}
                            pageSizeOptions={[5, 10, 25, 100]}
                            sx={{ minHeight: 200, maxHeight: 400 }}
                            disableRowSelectionOnClick
                        />
                    </Grid2>
                    <Grid2 item="true" sx={{ mt: 1 }}>
                        <Link underline="hover" href="/courses">查看更多→</Link>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
    );
}

function Announcement({ user }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('/api/announcements');
                const data = await response.json();
                console.log(data);
                setAnnouncements(data);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    if (loading) {
        return (
            <Box
                bgcolor="white"
                p={2}
                borderRadius={2}
                boxShadow={1}
                textAlign="center"
                height={200}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h6" color="textSecondary">
                    正在加载……
                </Typography>
            </Box>
        );
    }

    if (announcements.length === 0) {
        return (
            <Box
                bgcolor="white"
                p={2}
                borderRadius={2}
                boxShadow={1}
                textAlign="center"
                height={200}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h6" color="textSecondary">
                    暂无公告
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            bgcolor="white"
            p={2}
            borderRadius={2}
            boxShadow={1}
            height={200}
        >
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} sx={{ mb: 1 }}>
                <Typography variant="h6" color="black">
                    公告栏
                </Typography>
                {user.role == "admin" ? <Button variant="outlined" sx={{ height: 30, ml: 1 }} onClick={() => {
                    setTimeout(() => {
                        router.push("/announcement");
                    }, 50);
                }}>管理</Button> : ""}
            </Box>
            <Box
                textAlign="left"
                overflow="auto"
                height={160}
                sx={{ wordWrap: 'break-word' }}
            >
                {announcements.map(({ id, content, valid_until, priority }) => (
                    Date.now() < new Date(valid_until) || valid_until == null ? 
                            <Box item="true" key={id} sx={{ mt: 1, mb: 1 }} flexDirection={"column"}>
                                <Typography justifySelf={"flex-start"} variant="body1" color="black" gutterBottom>
                                    {priority ? <PushPinRounded color="disabled" sx={{fontSize: 15, mr: 1}} /> : <></>}{content}
                                </Typography>
                                <Typography justifySelf={"flex-start"} variant="caption" color="textSecondary">
                                    有效至：{valid_until ? `${new Date(valid_until).toLocaleString()}` : "永久有效"}
                                </Typography>
                            </Box> : <></>
                ))}
            </Box>
        </Box>
    );
}

export default function Dashboard() {
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
                        个人中心
                    </Typography>
                </Box>
                <Grid2 container spacing={3} sx={{ mt: 5, mb: 10 }}>
                    <Grid2 item="true" size={{lg: 6, xs: 12}}>
                        <PersonalInfo user={user} />
                    </Grid2>
                    <Grid2 item="true" size={{lg: 6, xs: 12}}>
                        <Announcement user={user} />
                    </Grid2>
                    <Grid2 item="true" size={12}>
                        {user && user.role === "admin" ?
                            <AllCourses user={user} /> : <CoursesTaken user={user} />
                        }
                    </Grid2>
                </Grid2>
            </Container >
        </>
    );
}
