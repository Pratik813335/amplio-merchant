import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function BorrowingTransactionsTableToolbar({
  filters,
  onFilters,
  //
  dateError,
  serviceOptions,
  allRailOptions,
  allBankOptions,
  allTimingOptions,
  allStatusesOptions,
}) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterAllRail = useCallback(
    (event) => {
      onFilters(
        'allrail',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterAllBanks = useCallback(
    (event) => {
      onFilters(
        'allbanks',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterAllTimings = useCallback(
    (event) => {
      onFilters(
        'alltimings',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  const handleFilterAllStatuses = useCallback(
    (event) => {
      onFilters(
        'allstatuses',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 180 },
          }}
        >
          <InputLabel>All Rail</InputLabel>

          <Select
            multiple
            value={filters.allrail}
            onChange={handleFilterAllRail}
            input={<OutlinedInput label="All Rail" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            sx={{ textTransform: 'capitalize' }}
          >
            {allRailOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size="small" checked={filters.allrail.includes(option)} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 180 },
          }}
        >
          <InputLabel>All Banks</InputLabel>

          <Select
            multiple
            value={filters.allbanks}
            onChange={handleFilterAllBanks}
            input={<OutlinedInput label="All Banks" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            sx={{ textTransform: 'capitalize' }}
          >
            {allBankOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size="small" checked={filters.allbanks.includes(option)} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
                  sx={{
                    flexShrink: 0,
                    width: { xs: 1, md: 180 },
                  }}
                >
          <InputLabel>All Timings</InputLabel>

          <Select
            multiple
            value={filters.alltimings}
            onChange={handleFilterAllTimings}
            input={<OutlinedInput label="All Timings" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            sx={{ textTransform: 'capitalize' }}
          >
            {allTimingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.alltimings.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 180 },
          }}
        >
          <InputLabel>All Statuses</InputLabel>

          <Select
            multiple
            value={filters.allstatuses}
            onChange={handleFilterAllStatuses}
            input={<OutlinedInput label="All Statuses" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            sx={{ textTransform: 'capitalize' }}
          >
            {allStatusesOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.allstatuses.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Search Transaction ID or Bank..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}

BorrowingTransactionsTableToolbar.propTypes = {
  dateError: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  serviceOptions: PropTypes.array,
  allRailOptions: PropTypes.array,
  allBankOptions: PropTypes.array,
  allTimingOptions: PropTypes.array,
  allStatusesOptions: PropTypes.array,
};
