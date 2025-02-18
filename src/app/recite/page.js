"use client";

import React, {useEffect, useState} from 'react';
import {Box, Grid2, Button, Typography, LinearProgress, Card, CardContent, Container} from '@mui/material';
import {useRouter} from "next/navigation";
import NavBar from "@/app/components/nav-bar";

function ReciteIndex() {
    const [task, setTask] = useState({total: 10, review: 5}); //TODO
    const [progress, setProgress] = useState(50); //TODO

    useEffect(() => {
        // fetchData(); TODO
    }, []);

    const handleStartRecite = () => {
        console.log('开始背诵任务');
    };

    return (
        <Box sx={{mt: 5}}>
            <Typography sx={{textAlign: "center", fontSize: 30}}>
                背记单词
            </Typography>
            <Grid2 container spacing={3} sx={{mt: 5}}>
                <Grid2 item="true" size={6}>
                    <Box bgcolor="white"
                         p={2}
                         borderRadius={2}
                         boxShadow={1}
                         height={200}
                         align="center">
                        <Typography variant="h6">今日背诵任务</Typography>
                        <Typography variant="body1">当前背诵词书: 文言实词</Typography>
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
            </Grid2>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{mt: 4, mb: 10}}
                onClick={handleStartRecite}
            >
                开始背诵
            </Button>
        </Box>
    );
};

export default function Recite() {
    return (
        <>
            <NavBar/>
            <Container maxWidth="xl" sx={{marginTop: 5}}>
                <ReciteIndex/>
            </Container>
        </>
    );
}
