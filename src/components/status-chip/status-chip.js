import React from "react";
import { Chip } from "@mui/material";
import Iconify from "src/components/iconify";
import PropTypes from "prop-types";
import { color } from "framer-motion";
import { label } from "yet-another-react-lightbox";

const STATUS_CONFIG = {

    // success, pending, failed
    success: {
        icon: "mdi:check-circle-outline",
        color: "success",
        label: "Success"
    },
    failed: {
        icon: "mdi:close-circle-outline",
        color: "error",
        label: "Failed"
    },
    pending: {
        icon: "mdi:clock-outline",
        color: "warning",
        label: "Pending"
    },

    // approved, processing, reject
    approved: {
        icon: "mdi:check-decagram-outline",
        color: "success",
        label: "Approved"
    },
    processing: {
        icon: "mdi:clock-outline",
        color: "primary",
        label: "Processing"
    },
    rejected: {
        icon: "mdi:close-octagon-outline",
        color: "error",
        label: "Rejected"
    },

    // active, conntected, not connected/disconnected
    active: {
        icon: "",
        color: "success",
        label: "Active"
    },
    connected: {
        icon: "mdi:check-circle-outline",
        color: "success",
        label: "Connected"
    },
    notconnected: {
        icon: "",
        color: "default",
        label: "Not Connected"
    },
    disconnected: {
        icon: "",
        color: "default",
        label: "Disconnected"
    },

    // financed, ineligible
    financed: {
        icon: "mdi:cash-check",
        color: "success",
        label: "Financed"
    },
    ineligible: {
        icon: "mdi:alert-circle-outline",
        color: "error",
        label: "Ineligible"
    },

    // Risk - with icons
    lowrisk:
    {
        icon: "mdi:shield-check-outline",
        color: "success",
        label: "Low Risk"
    },
    mediumrisk:
    {
        icon: "mdi:shield-outline",
        color: "warning",
        label: "Medium Risk"
    },
    highrisk:
    {
        icon: "mdi:shield-alert-outline",
        color: "error",
        label: "High Risk"
    },

    // Risk - without icons
    low: {
        icon: "",
        color: "success",
        label: "Low"
    },
    medium: {
        icon: "",
        color: "warning",
        label: "Medium"
    },
    high: {
        icon: "",
        color: "error",
        label: "High"
    },

    setteled: {
        icon: "mdi:check-circle-outline",
        color: "success",
        label: "Success"
    },
    enabled: {
        icon: "",
        color: "success",
        label: "Enabled"
    },
    completed: {
        icon: "",
        color: "success",
        label: "Completed"
    },
    clear: {
        icon: "",
        color: "success",
        label: "Clear"
    },

    // payement methods - UPI, QR, Card
    upi: {
        icon: "",
        color: "primary",
        label: "UPI"
    },
    qr: {
        icon: "",
        color: "success",
        label: "QR"
    },
    card: {
        icon: "",
        color: "warning",
        label: "Card"
    }

};

const normalizeStatus = (status) =>
    status.toLowerCase().replace(/[\s-_]+/g, "").trim();

export default function StatusChip({ status, variant }) {
    const key = normalizeStatus(status)
    const config = STATUS_CONFIG[key] || STATUS_CONFIG.pending;

    return (
        <Chip
            variant={variant || 'soft'}
            icon={
                <Iconify
                    icon={config.icon}
                    width={14}
                />
            }
            label={config.label}
            color={config.color}
            size="small"
        // sx={{
        //     // p: 1,
        //     fontWeight: 500,
        //     textTransform: "capitalize"
        // }}
        />
    );
};

StatusChip.propTypes = {
    status: PropTypes.string,
    variant: PropTypes.string,
}