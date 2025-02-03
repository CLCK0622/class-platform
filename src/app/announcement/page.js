"use client";

import { Box, Container, Typography, Grid2, Link, Button, TextField, FormControlLabel, Switch, Snackbar, Alert } from "@mui/material";
import * as React from "react";
import NavBar from "../components/nav-bar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import AlertDialog from "../components/confirmation";
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from "@mui/x-date-pickers";

function CreateAnnouncement({ user }) {
    const [newContent, setNewContent] = useState('');
    const [newValidUntil, setNewValidUntil] = useState(null);
    const [newStick, setStick] = useState(false);
    const [createSuccessNoti, successNoti] = useState(false);

    const handleCreateAnnouncement = async () => {
        const res = await fetch(`/api/announcements/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newContent, valid_until: newValidUntil, stick: newStick }),
        });
        const data = await res.json();
        if (res.ok) {
            console.log("Announcement created:", data);
            successNoti(true);
        } else {
            console.error("Failed to create announcement:", data.message);
        }
    }

    return (
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
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{ mt: 2 }}>
                        <Box display={"flex"} alignItems={"center"}>
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                                <DateTimePicker
                                    label="有效至"
                                    value={newValidUntil}
                                    ampm={false}
                                    views={['year', 'month', 'day']}
                                    onChange={(newValue) => setNewValidUntil(newValue)}
                                    slotProps={{ textField: { fullWidth: "true" } }}
                                />
                            </LocalizationProvider>
                            <FormControlLabel control={<Switch value={newStick} onChange={(e) => { setStick(e.target.value) }} />} label="置顶公告" labelPlacement="start" />
                        </Box>
                        <AlertDialog
                            button={<Button variant="outlined" onClick={handleCreateAnnouncement}>创建公告</Button>}
                            title={`确定要创建该公告吗？`}
                            description={<><Typography>请确认操作正确，创建后，该公告全体可见。</Typography>
                                <Typography>公告内容：{newContent}</Typography>
                                <Typography>有效期至：{String(newValidUntil)}</Typography>
                                <Typography>置顶：{newStick ? "是" : "否"}</Typography></>}
                            agreeAction={handleCreateAnnouncement}
                        />
                    </Box>
                    <Snackbar open={createSuccessNoti} autoHideDuration={1000} onClose={() => { window.location.reload(); }}>
                        <Alert
                            onClose={() => { window.location.reload(); }}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            公告创建成功！
                        </Alert>
                    </Snackbar>
                </Box> : <></>
            }
        </Box>
    )
}

function Announcement({ user }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteSuccessNoti, setDeleteSuccessNoti] = useState(false);

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
            setDeleteSuccessNoti(true);
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

    console.log(announcements);

    if (announcements.length === 0) {
        return (
            <>
                <CreateAnnouncement user={user} />
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
            <CreateAnnouncement user={user} />
            <Snackbar open={deleteSuccessNoti} autoHideDuration={1000} onClose={() => { window.location.reload(); }}>
                        <Alert
                            onClose={() => { window.location.reload(); }}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            公告删除成功！
                        </Alert>
                    </Snackbar>
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
