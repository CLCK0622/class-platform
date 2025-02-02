"use client";

import { Box, Container, Typography, Grid2, Link, Button } from "@mui/material";
import * as React from "react";
import NavBar from "../components/nav-bar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

function Announcement({ user }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

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
        >
            {user.role == "admin" ?
                <Button variant="outlined">创建公告</Button> : <></>
            }
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
                        <Button color="error">删除</Button>
                    </Box>
                    </Box> : <></>
            ))}
        </Box>
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
