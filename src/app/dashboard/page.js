"use client";

import { Box, Container, Typography, Grid2 } from "@mui/material";
import * as React from "react";
import NavBar from "../components/nav-bar";
import { useRouter } from "next/navigation";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

function CoursesTaken({ user }) {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        console.log(user);
        if (!user) return;
        async function fetchCourses() {
            try {
                const response = await fetch(`/api/userCourses?userId=${user.id}`);
                const data = await response.json();
                setRows(data.map((item, index) => ({
                    id: item.id,
                    index: index + 1,
                    date: new Date(item.date).toLocaleDateString(),
                    startTime: item.start_time,
                    duration: item.duration,
                    status: item.status,
                    courseName: item.course_name,
                    subject: item.subject,
                    teacherId: item.teacher_id,
                })));
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        }
        fetchCourses();
    }, [user]);

    const columns = [
        { field: 'index', headerName: '#', width: 50 },
        { field: 'date', headerName: 'Date', width: 100 },
        { field: 'startTime', headerName: 'Start Time', width: 120 },
        { field: 'duration', headerName: 'Duration', width: 100 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'courseName', headerName: 'Course Name', width: 200 },
        { field: 'subject', headerName: 'Subject', width: 150 },
        { field: 'teacherId', headerName: 'Teacher ID', width: 120 },
    ];

    return (
        <Box
            bgcolor="grey.200"
            p={2}
            textAlign="center"
            borderRadius={2}
            minHeight={300}
        >
            <Typography variant="h6" color="textSecondary" gutterBottom>
                All Courses
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                />
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
                        Dashboard
                    </Typography>
                </Box>
                <Grid2 container spacing={3} sx={{ mt: 5, mb: 10 }}>
                    <Grid2 item="true" size={6}>
                        <Box
                            bgcolor="white"
                            p={2}
                            borderRadius={2}
                            boxShadow={1}
                            textAlign="center"
                        >
                            <Typography variant="h6">
                                Hi! {user ? user.username : ""}
                            </Typography>
                            <Typography variant="h6">
                                ID: {user ? user.id : ""}
                            </Typography>
                            <Typography variant="h6">
                                Email: {user ? user.email : ""}
                            </Typography>
                        </Box>
                    </Grid2>
                    <Grid2 item="true" size={6}>
                        <Box
                            bgcolor="white"
                            p={2}
                            borderRadius={2}
                            boxShadow={1}
                            textAlign="center"
                        >
                            <Typography variant="h6">Recent Classes</Typography>
                            <Typography color="textSecondary">
                                Classes Placeholder
                            </Typography>
                        </Box>
                    </Grid2>
                    <Grid2 item="true" size={12}>
                        <CoursesTaken user={user} />
                    </Grid2>
                </Grid2>
            </Container >
        </>
    );
}
