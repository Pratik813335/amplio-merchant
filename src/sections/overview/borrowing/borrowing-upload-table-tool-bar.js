import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

// MUI
import {
    Stack,
    MenuItem,
    Checkbox,
    TextField,
    InputLabel,
    FormControl,
    OutlinedInput,
    InputAdornment,
    Select,
    Button,
    Collapse,
    Box,
} from '@mui/material';

// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function BorrowingUploadTableToolbar({
    filters,
    onFilters,
    statusOptions,
    bankOptions,
}) {
    const [toggle, setToggle] = useState(false);
    const popover = usePopover();

    // ---------------- HANDLERS ----------------
    const handleFilterName = useCallback(
        (event) => {
            onFilters('name', event.target.value);
        },
        [onFilters]
    );

    const handleFilterStatus = useCallback(
        (event) => {
            onFilters(
                'status',
                typeof event.target.value === 'string'
                    ? event.target.value.split(',')
                    : event.target.value
            );
        },
        [onFilters]
    );

    const handleFilterBank = useCallback(
        (event) => {
            onFilters(
                'bank',
                typeof event.target.value === 'string'
                    ? event.target.value.split(',')
                    : event.target.value
            );
        },
        [onFilters]
    );

    // ---------------- UI ----------------
    return (
        <>

            <Stack
                spacing={2}
                direction={{ xs: 'column', md: 'row' }}
                alignItems="center"
                sx={{ p: 2 }}
            >
                {/* Search */}
                <TextField
                    fullWidth

                    value={filters.name}
                    onChange={handleFilterName}
                    placeholder="Search by Transaction ID,Account,Pool ID,Reference..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Date Filter */}
                <FormControl sx={{ width: 200 }}>
                    <InputLabel>
                        <Box  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Iconify icon="material-symbols-light:calendar-today-outline" width={22} />
                            Day
                        </Box>
                    </InputLabel>          <Select
                        multiple
                        sx={{ height: 46 }}
                        value={filters.bank}

                        onChange={handleFilterBank}
                        input={<OutlinedInput label="Date" />}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {bankOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                <Checkbox checked={filters.bank.includes(option.value)} />
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Status Filter */}
                <FormControl sx={{ width: 200 }}>
                    <InputLabel>All Status</InputLabel>
                    <Select
                        multiple
                        value={filters.status}
                        onChange={handleFilterStatus}
                        input={<OutlinedInput label="Status" />}
                        renderValue={(selected) => selected.join(', ')}
                        sx={{ height: 46 }}
                    >
                        {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                <Checkbox checked={filters.status.includes(option.value)} />
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* More Filters Button */}
                <Button
                    startIcon={<Iconify icon="mingcute:filter-line" />}
                    variant="outlined"
                    onClick={() => setToggle(!toggle)}

                    sx={{ height: 46, width: 250 }}
                >
                    More Filters
                </Button>
            </Stack>
            {toggle && (


                <Stack
                    spacing={2}
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{ px: 2, pb: 2 }}
                >
                    {/* Account Filter */}
                    <FormControl sx={{ width: 400 }}>
                        <InputLabel>Account Filter</InputLabel>
                        <Select
                            value={filters.account || ''}
                            onChange={(e) => onFilters('account', e.target.value)}
                            input={<OutlinedInput label="Account" />}
                        >
                            <MenuItem value="source">Source</MenuItem>
                            <MenuItem value="pool">Pool</MenuItem>
                            <MenuItem value="merchant">Merchant</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Min Amount */}
                    <TextField
                        label="Min Amount"
                        type="number"
                        value={filters.min || ''}
                        onChange={(e) => onFilters('min', e.target.value)}
                        sx={{ width: 400 }}
                    />

                    {/* Max Amount */}
                    <TextField
                        label="Max Amount"
                        type="number"
                        value={filters.max || ''}
                        onChange={(e) => onFilters('max', e.target.value)}
                        sx={{ width: 400 }}
                    />
                </Stack>
            )}
            {/* POPOVER */}
            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem onClick={popover.onClose}>
                    <Iconify icon="solar:export-bold" />
                    Export
                </MenuItem>
            </CustomPopover>
        </>
    );
}

BorrowingUploadTableToolbar.propTypes = {
    filters: PropTypes.object,
    onFilters: PropTypes.func,
    statusOptions: PropTypes.array,
    bankOptions: PropTypes.array,
};
