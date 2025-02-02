"use client";

import { Box, Container, Typography, Grid2, Link } from "@mui/material";
import * as React from "react";
import NavBar from "../components/nav-bar";
import { useRouter } from "next/navigation";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

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
                <Link underline="hover" href={`/courses/${params.row.id}`} passHref>
                    <a style={{ textDecoration: "none", color: "blue" }}>{params.value}</a>
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
            flex={true}
            flexDirection={'column'}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[10, 25, 100]}
                sx={{ minHeight: 300, maxHeight: 800 }}
                disableRowSelectionOnClick
            />
        </Box>
    );
}

export default function Courses() {
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
                        我的课程
                    </Typography>
                </Box>
                <Grid2 container spacing={3} sx={{ mt: 5, mb: 10 }}>
                    <Grid2 item="true" size={12}>
                        <CoursesTaken user={user} />
                    </Grid2>
                </Grid2>
            </Container >
        </>
    );
}
