"use client";

import React from "react";
import { useRouter } from "next/navigation.js";
import { Container, Typography, Box, Tabs, Tab, TextField, Button, Collapse, Alert, IconButton, Grid2 } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import NavBar from "./components/nav-bar.js";

export default function Home() {
    const router = useRouter();

    const [activeTab, setActiveTab] = React.useState(0);

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [openLoginAlert, setOpenLoginAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");
    const [alertSeverity, setAlertSeverity] = React.useState("warning");

    const handleLogin = async () => {
        setOpenLoginAlert(true);
        setAlertMessage("Login in progress...");
        setAlertSeverity("warning");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setAlertMessage("Login successful!");
                setAlertSeverity("success");
                localStorage.setItem("token", data.token);
                setTimeout(() => {
                    router.push("/dashboard");
                }, 500);
            } else {
                setAlertMessage(data.error || "Login failed. Please try again.");
                setAlertSeverity("error");
            }
        } catch (error) {
            setAlertMessage("An error occurred. Please try again later.\n", error);
            setAlertSeverity("error");
        } finally {
            setOpenLoginAlert(true);
        }
    };

    const [openRegisterAlert, setOpenRegisterAlert] = React.useState(false);

    const handleRegister = async () => {
        setOpenRegisterAlert(true);
        setAlertMessage("Register in progress...");
        setAlertSeverity("warning");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            })

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                setAlertMessage("Register successful! Please log in.");
                setAlertSeverity("success");
            } else {
                setAlertMessage(data.error || "Register failed, please try again.");
                setAlertSeverity("error");
            }
        } catch (error) {
            setAlertMessage("An error occurred. Please try again later.\n", error);
            setAlertSeverity("error");
        } finally {
            setOpenLoginAlert(true);
        }
    }

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setOpenLoginAlert(false);
        setOpenRegisterAlert(false);
    };

    return (
        <>
            <NavBar />
            <Container maxWidth="sm" sx={{ marginTop: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Class Selection Demo
                </Typography>
                <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                    <Typography variant="body1" color="textSecondary">
                        Notice: xxx
                    </Typography>
                </Box>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="Log In" />
                    <Tab label="Register" />
                </Tabs>
                {activeTab === 0 && (
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Username"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Collapse in={openLoginAlert}>
                            <Alert
                                severity={alertSeverity}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpenLoginAlert(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mt: 2 }}
                            >
                                {alertMessage}
                            </Alert>
                        </Collapse>
                        <Grid2
                            container
                            direction="row"
                            sx={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button onClick={() => { handleLogin(); }} disabled={openLoginAlert} variant="contained" sx={{ mt: 2 }}>
                                Log In
                            </Button>
                        </Grid2>
                    </Box>
                )}
                {activeTab === 1 && (
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField fullWidth label="Username" margin="normal" value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                        <TextField fullWidth label="Email" type="email" margin="normal" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <TextField fullWidth label="Password" type="password" margin="normal" value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <Collapse in={openRegisterAlert}>
                            <Alert
                                severity={alertSeverity}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpenRegisterAlert(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mt: 2 }}
                            >
                                {alertMessage}
                            </Alert>
                        </Collapse>
                        <Grid2
                            container
                            direction="row"
                            sx={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Button onClick={() => { handleRegister(); }} disabled={openRegisterAlert} variant="contained" sx={{ mt: 2 }}>
                                Register
                            </Button>
                        </Grid2>
                    </Box>
                )}
            </Container>
        </>
    );
}