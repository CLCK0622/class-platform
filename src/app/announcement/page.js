"use client";

import { Box, Container, Typography, Grid2, Link, Button, TextField } from "@mui/material";
import * as React from "react";
import NavBar from "../components/nav-bar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import AlertDialog from "../components/confirmation";
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from "@mui/x-date-pickers";
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

function Announcement({ user }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newContent, setNewContent] = useState('');
    const [newValidUntil, setNewValidUntil] = useState(null);

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

    const handleDelete = async (announcementId) => {
        const response = await fetch(`/api/announcements/delete`, {
            method: "PATCH",
            body: JSON.stringify({ id: announcementId }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            window.location.reload();
        } else {
            const data = await response.json();
            console.error('Error deleting announcement:', data.message);
        }
    };

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
            <>
                <Box
                    bgcolor="white"
                    p={2}
                    borderRadius={2}
                    boxShadow={1}
                    sx={{ mb: 3 }}
                >
                    {user.role == "admin" ?
                        <Box>
                            <TextField
                                label="公告内容"
                                multiline
                                fullWidth
                                rows={4}
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                                <DateTimePicker
                                    label="有效至"
                                    value={newValidUntil}
                                    ampm={false}
                                    views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                                    onChange={(newValue) => setNewValidUntil(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2, mb: 2 }} />}
                                />
                            </LocalizationProvider>
                            <Button variant="outlined">创建公告</Button>
                        </Box> : <></>
                    }
                </Box>
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
            </>
        );
    }

    return (
        <>
            <Box
                bgcolor="white"
                p={2}
                borderRadius={2}
                boxShadow={1}
                sx={{ mb: 3 }}
            >
                {user.role == "admin" ?
                    <Box>
                        <TextField
                            label="公告内容"
                            multiline
                            fullWidth
                            rows={4}
                            onChange={(e) => setNewContent(e.target.value)}
                        />
                        <LocalizationProvider dateAdapter={AdapterLuxon}>
                            <DateTimePicker
                                label="有效至"
                                value={newValidUntil}
                                ampm={false}
                                views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                                onChange={(newValue) => setNewValidUntil(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2, mb: 2 }} />}
                            />
                        </LocalizationProvider>
                        <Button variant="outlined">创建公告</Button>
                    </Box> : <></>
                }
            </Box>
            <Box
                bgcolor="white"
                p={2}
                borderRadius={2}
                boxShadow={1}
            >
                {announcements.map(({ id, content, valid_until }) => (
                    Date.now() < new Date(valid_until) || valid_until == null ?
                        <Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
                            <Box item="true" key={id} sx={{ mt: 1, mb: 1 }} flexDirection={"column"}>
                                <Typography justifySelf={"flex-start"} variant="body1" color="black" gutterBottom>
                                    {content}
                                </Typography>
                                <Typography justifySelf={"flex-start"} variant="caption" color="textSecondary">
                                    有效至：{valid_until ? `${new Date(valid_until).toLocaleString()}` : "永久有效"}
                                </Typography>
                            </Box>
                            <Box item="true" justifySelf={"flex-end"} alignContent={"center"} minWidth={128}>
                                <Button>修改</Button>
                                <AlertDialog
                                    button={<Button color="error">删除</Button>}
                                    title={`确定要删除该公告吗？`}
                                    description={<><Typography>请确认操作正确，删除后，该公告将会永久隐藏。</Typography><Typography>公告内容：{content}</Typography></>}
                                    agreeAction={() => handleDelete(id)}
                                />
                            </Box>
                        </Box> : <></>
                ))}
            </Box>
        </>
    );
}

export default function Announcements() {
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
                if (data.user.role != 'admin') {
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 50);
                    return;
                }
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
            <Container maxWidth="xl" sx={{ marginTop: 5, mb: 10 }}>
                <Typography
                    sx={{ textAlign: "center", fontSize: 30, mb: 5 }}
                >
                    管理公告
                </Typography>
                <Announcement user={user} />
            </Container >
        </>
    );
}
