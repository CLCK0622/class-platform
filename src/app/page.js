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

    const handleLogin = async (event) => {
        event.preventDefault();
        setOpenLoginAlert(true);
        setAlertMessage("正在登录……");
        setAlertSeverity("warning");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setAlertMessage("登录成功！");
                setAlertSeverity("success");
                localStorage.setItem("token", data.token);
                setTimeout(() => {
                    router.push("/dashboard");
                }, 500);
            } else {
                setAlertMessage(data.error || "登录失败，请再试一次！");
                setAlertSeverity("error");
            }
        } catch (error) {
            setAlertMessage("发生错误，请稍后重试。\n", error);
            setAlertSeverity("error");
        } finally {
            setOpenLoginAlert(true);
        }
    };

    const [openRegisterAlert, setOpenRegisterAlert] = React.useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();
        setOpenRegisterAlert(true);
        setAlertMessage("正在注册……");
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
                setAlertMessage("注册成功！请登录。");
                setAlertSeverity("success");
            } else {
                setAlertMessage(data.error || "注册失败，请重试。");
                setAlertSeverity("error");
            }
        } catch (error) {
            setAlertMessage("发生错误，请稍后重试。\n", error);
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
            <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    选课报课网站
                </Typography>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="登录" />
                    <Tab label="注册" />
                </Tabs>
                {activeTab === 0 && (
                    <Box component="form" sx={{ mt: 2 }} onSubmit={(e) => { handleLogin(e) }} >
                        <TextField
                            fullWidth
                            label="用户名"
                            margin="normal"
                            value={username}
                            onChange={(e) => {setUsername(e.target.value); setOpenLoginAlert(false);}}
                        />
                        <TextField
                            fullWidth
                            label="密码"
                            type="password"
                            margin="normal"
                            value={password}
                            onChange={(e) => {setPassword(e.target.value); setOpenLoginAlert(false);}}
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
                            <Button type="submit" disabled={openLoginAlert} variant="contained" sx={{ mt: 2 }}>
                                登录
                            </Button>
                        </Grid2>
                    </Box>
                )}
                {activeTab === 1 && (
                    <Box component="form" sx={{ mt: 2 }} onSubmit={(e) => { handleRegister(e); }}>
                        <TextField fullWidth label="用户名" margin="normal" value={username}
                            onChange={(e) => {setUsername(e.target.value); setOpenRegisterAlert(false);}} />
                        <TextField fullWidth label="邮箱地址" type="email" margin="normal" value={email}
                            onChange={(e) => {setEmail(e.target.value); setOpenRegisterAlert(false);}} />
                        <TextField fullWidth label="密码" type="password" margin="normal" value={password}
                            onChange={(e) => {setPassword(e.target.value); setOpenRegisterAlert(false);}} />
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
                            <Button type="submit" disabled={openRegisterAlert} variant="contained" sx={{ mt: 2 }}>
                                注册
                            </Button>
                        </Grid2>
                    </Box>
                )}
            </Container>
        </>
    );
}