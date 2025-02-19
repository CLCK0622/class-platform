"use client";

import React, {useEffect, useState} from 'react';
import {Box, Grid2, Button, Typography, LinearProgress, Card, CardContent, Container} from '@mui/material';
import {useRouter} from "next/navigation";
import NavBar from "@/app/components/nav-bar";

function ReciteIndex({user}) {
    const [task, setTask] = useState({total: 10, review: 5}); //TODO
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        async function fetchProgress() {
            if (user) {
                try {
                    const response = await fetch('/api/recite/status', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user: user,
                            book_id: 1,  //TODO
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        setTask({
                            total: data.new_words_total,
                            review: data.review_words_total,
                        });
                        setProgress((data.new_words_learned / data.new_words_total) * 100);
                    } else {
                        console.error('获取进度失败');
                    }
                } catch (error) {
                    console.error('请求错误:', error);
                }
            }
        }

        fetchProgress();
    }, [user]);

    const handleStartRecite = () => {
        console.log('开始背诵任务');
    };

    const handleStartReview = () => {
        console.log('开始复习任务');
    };

    return (
        <Box sx={{mt: 5}}>
            <Typography sx={{textAlign: "center", fontSize: 30}}>
                单词背诵
            </Typography>
            <Grid2 container spacing={3} sx={{mt: 5}}>
                <Grid2 item="true" size={6}>
                    <Box bgcolor="white"
                         p={2}
                         borderRadius={2}
                         boxShadow={1}
                         height={200}
                         align="center">
                        <Typography variant="h6">背诵任务</Typography>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                            <Typography variant="body1">当前背诵词书: 文言实词</Typography>
                            <Button variant="outlined" sx={{height: 30, ml: 1}}>
                                修改
                            </Button>
                        </Box>
                        <Typography variant="body1">待背单词数量: {task.total}</Typography>
                        <Typography variant="body1">复习单词数量: {task.review}</Typography>
                    </Box>
                </Grid2>
                <Grid2 item="true" size={6}>
                    <Box bgcolor="white"
                         p={2}
                         borderRadius={2}
                         boxShadow={1}
                         height={200}>
                        <Typography variant="h6" align="center">学习进度</Typography>
                        <LinearProgress
                            sx={{height: 8, borderRadius: 4, mt: 1}}
                            variant="determinate"
                            value={progress}
                        />
                        <Typography variant="body2" align="center" sx={{mt: 1}}>{progress}% 完成</Typography>
                    </Box>
                </Grid2>
                <Grid2 item="true" size={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{mb: 10}}
                        onClick={handleStartRecite}
                    >
                        背诵新词
                    </Button>
                </Grid2>
                <Grid2 item="true" size={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{mb: 10}}
                        onClick={handleStartReview}
                    >
                        复习旧词
                    </Button>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default function Recite() {
    const router = useRouter();
    const [user, setUser] = React.useState(null);

    useEffect(() => {
        async function fetchSession() {
            const token = localStorage.getItem("token");
            if (!token) {
                setTimeout(() => {
                    alert("您还未登录! ");
                    router.push("/");
                }, 50);
                return;
            }

            const res = await fetch("/api/session", {
                headers: {Authorization: `Bearer ${token}`},
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
            <NavBar/>
            <Container maxWidth="xl" sx={{marginTop: 5}}>
                <ReciteIndex user={user}/>
            </Container>
        </>
    );
}
