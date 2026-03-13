// @mui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// _mock
import {
  _highRiskDays,
  _ecommerceSalesOverview,
  _analyticTraffic,
  _aiInsightsPredictions,
  _railSettlementReliability,
  _bankOutageProbability ,

} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { MotivationIllustration } from 'src/assets/illustrations';
//

import EcommerceYearlySales from '../ecommerce-yearly-sales';
import BankOutageProbability from '../bank-outage-probability';
import EcommerceWidgetSummary from '../ecommerce-widget-summary';

import AppAreaInstalled from '../app-area-installed';

import HighRiskDaysHighlighted from '../high-risks-days-highlighted';

import AiInsightsPredictions from '../ai-insights-predictions';

import RailSettlementReliability from '../rail-settlement-reliability';

// ----------------------------------------------------------------------

export default function OverviewForecastingView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <EcommerceWidgetSummary
            title="Product Sold"
            percent={2.6}
            total={765}
            chart={{
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <EcommerceWidgetSummary
            title="Total Balance"
            percent={-0.1}
            total={18765}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <EcommerceWidgetSummary
            title="Sales Profit"
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <EcommerceWidgetSummary
            title="Sales Profit"
            percent={0.6}
            total={4876}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <EcommerceYearlySales
            title="7-Day Settlement Prediction"
            subheader="Predicted inflow with confidence intervals"
            chart={{
              categories: ['28 Feb', '1 Mar', '2 Mar', '3 Mar', '4 Mar', '5 Mar', '6 Mar'],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Predicted Inflow (₹)',
                      data: [10, 41, 35, 51, 49, 62, 69],
                    },
                    {
                      name: 'Expected Refunds (₹)',
                      data: [10, 34, 13, 56, 77, 88, 99],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <HighRiskDaysHighlighted title="High Risk Days Highlighted" list={_highRiskDays} />
        </Grid>

        <Grid xs={12} md={6} >
          <RailSettlementReliability
            title="Rail-wise Settlement Reliability"
            list={_railSettlementReliability}
          />
        </Grid>

        <Grid xs={12} md={6} >
          <BankOutageProbability title="Bank Outage Probability" data={_bankOutageProbability} />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <AppAreaInstalled
            title="Seasonality Patterns (6 Months)"
            // subheader="(+43%) than last year"
            chart={{
              categories: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Volume Index',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12}>
          <AiInsightsPredictions title="AI Insights & Predictions" list={_aiInsightsPredictions} />
        </Grid>
      </Grid>
    </Container>
  );
}
