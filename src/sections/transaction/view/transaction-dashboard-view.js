import { Container, Grid, Stack } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import WidgetSummaryCard from '../../../components/card/widget-summary-card';
import TransactionGraph from '../transaction-graph';
import TransactionTable from '../transaction-table';

export function TransactionView() {
  const settings = useSettingsContext();

  const categories = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

    const DASHBOARD_CARDS = [
        {
            "title": "Today's TransactionToday's Transaction Today's TransactionToday's Transaction",
            "percent": -1.6,
            "total": 187,
            "timing": "Live Count",
            "icon": "codicon:pulse"
        },
        {
            "title": "Total Volume",
            "percent": 3.1,
            "total": 2450,
            "timing": "Today",
            "icon": "mdi:trending-up"
        },
        {
            "title": "Success Rate",
            "total": 54.20,
            "timing": "Last 24 hours",
            "icon": "codicon:pulse"
        },
        {
            "title": "Avg Transaction",
            "percent": 4.5,
            "total": 1290,
            "timing": "Today",
            "icon": "mdi:trending-up"
        },


    ]

   function formatNumber(num) {
  const number = Number(num);

  if (number >= 10000000) {
    return `${(number / 10000000).toFixed(2)} Cr`;
  }

  if (number >= 100000) {
    return `${(number / 100000).toFixed(2)} L`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(2)} K`;
  }

  return number;
}

const formatTotal = (value, index) => {
  const formattedNumber = formatNumber(value);

  if (index === 1 || index === 3) {
    return `₹${formattedNumber}`;
  }

  if (index === 2) {
    return `${formattedNumber}%`;
  }

  return formattedNumber;
};
    return (<>
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Stack spacing={3}>
                <Grid container spacing={3}>
                    {DASHBOARD_CARDS.filter((card) => card.total !== undefined && card.total !== null).map((card, i) => (
                        <Grid key={i} item xs={12} md={3}>
                            <WidgetSummaryCard
                                title={card.title}
                                percent={card.percent}
                                total={formatTotal(card.total, i)}
                                timing={card.timing}
                                icon={card.icon}
                            />
                        </Grid>
                    ))}
                </Grid>
                <TransactionGraph
                    title="Transaction Volume Timeline (Last 5 Hours)"
                    chart={{
                        categories,
                        series: [
                            {
                                data: [
                                    {
                                        name: 'Transaction Count',
                                        data: [10, 41, 35, 51, 49, 100,],
                                    },

                                ],
                            },
                        ],
                    }}
                />
                <TransactionTable />
            </Stack>
        </Container>

    </>)
}
