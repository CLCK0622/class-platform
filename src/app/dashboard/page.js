"use client";

import { Box, Container, Typography, Grid2 } from "@mui/material";
import * as React from "react";
import NavBar from "../components/nav-bar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function SchedulePlaceholder() {
    return (
        <Box
            bgcolor="grey.200"
            p={2}
            textAlign="center"
            borderRadius={2}
            minHeight={300}
        >
            <Typography variant="h6" color="textSecondary">
                Class Schedule (WIP)
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar />
            </LocalizationProvider>
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
                        <SchedulePlaceholder />
                    </Grid2>
                </Grid2>
            </Container >
        </>
    );
}
