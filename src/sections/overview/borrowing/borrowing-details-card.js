import React from "react";
import PropTypes from 'prop-types';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Stack,
    useTheme
} from "@mui/material";
import Iconify from "../../../components/iconify";

export default function BorrowingDetailsCard({ title, icon, rows }) {
    const theme = useTheme();

    return (
        <Card>
            <CardContent>
                {/* Card Title */}
                <Stack direction="row" alignItems="center" spacing={1.2} mb={2}>
                    {icon && (
                        <Iconify
                            icon={icon}
                            width={20}
                            color={theme.palette.text.secondary}
                        />
                    )}

                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                </Stack>

                {/* Rows */}
                <Grid container spacing={1.2}>
                    {rows?.map((row, index) => {
                        const isAmount = row.type === "amount";
                        return (
                            <>
                                {/* Label */}
                                <Grid item xs={7} sm={8}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.secondary
                                        }}
                                    >
                                        {row.label}
                                    </Typography>
                                </Grid>

                                {/* Value */}
                                <Grid item xs={5} sm={4}>
                                    <Box
                                        display="flex"
                                        justifyContent="flex-end"
                                        alignItems="center"
                                    >
                                        {isAmount ? (
                                            <Stack direction="row" alignItems="center" spacing={0.3}>
                                                <Iconify
                                                    icon="mdi:currency-inr"
                                                    width={16}
                                                    color={
                                                        row.color || theme.palette.error.main
                                                    }
                                                />

                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color:
                                                            row.color || theme.palette.error.main
                                                    }}
                                                >
                                                    {row.value}
                                                </Typography>
                                            </Stack>
                                        ) : (
                                            <Typography
                                                variant="body2"
                                                textAlign="right"
                                            >
                                                {row.value}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </>
                        );
                    })}
                </Grid>
            </CardContent>
        </Card>
    );
};

BorrowingDetailsCard.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    rows: PropTypes.object,
}