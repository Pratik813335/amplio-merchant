// @mui
import { Stack } from '@mui/material';

import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import LiquidityEngineCard from '../liquidity-engine-card';
import LiquidityEngineListView from '../liquidity-engine-list-view';


// ----------------------------------------------------------------------

const DISBURSEMENT_HISTORY = [
  {
    id: 1,
    date: '2024-02-27',
    receivablesFinanced: 245,
    amount: '₹48.2L',
    status: 'Completed',
  },
  {
    id: 2,
    date: '2024-02-26',
    receivablesFinanced: 198,
    amount: '₹39.5L',
    status: 'Completed',
  },
  {
    id: 3,
    date: '2024-02-25',
    receivablesFinanced: 267,
    amount: '₹52.4L',
    status: 'Completed',
  },
];

// ----------------------------------------------------------------------

export default function LiquidityEngineView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
    <Stack spacing={3}>













      
      <LiquidityEngineListView/>
       <LiquidityEngineCard disbursements={DISBURSEMENT_HISTORY} />
       </Stack>
    </Container>
  );
}