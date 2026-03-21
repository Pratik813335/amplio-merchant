// @mui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';

// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// _mock
import {
  _highRiskDays,
  _ecommerceSalesOverview,
  _analyticTraffic,
  _aiInsightsPredictions,
  _railSettlementReliability,
  _bankOutageProbability,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
// assets
import { MotivationIllustration } from 'src/assets/illustrations';
//
import WidgetSummaryCard from 'src/components/card/widget-summary-card';
import ForecastingYearlySales from '../forecasting-yearly-sales';
import ForecastingBankOutage from '../forecasting-bank-outage';
import ForecastingAppAreaInstalled from '../forecasting-app-area-installed';
import ForecastingHighRisk from '../forecasting-high-risks';
import ForecastingAiInsights from '../forecasting-ai-insights';
import ForecastingRail from '../forecasting-rail';

// ----------------------------------------------------------------------

export default function OverviewForecastingView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  const DASHBOARD_DATA = [
    {
      forecastAccuracyPercent: 3,
      forecastAccuracyTotal: '94.2',
      // settlementConfidencePercent: 6,
      settlementConfidenceTotal: '85.7',
      // highRiskDaysPercent: 4,
      highRiskDaysTotal: 2,
      netInflowPercent: 8,
      netInflowTotal: 4400000,
    },
  ];

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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {DASHBOARD_DATA.map((card, index) => (
            <>
              <Grid xs={12} md={3} key={index}>
                <WidgetSummaryCard
                  title="7-Day Forecast Accuracy"
                  percent={card.forecastAccuracyPercent}
                  total={`${formatNumber(card.forecastAccuracyTotal)}%`}
                  timing="Based on last 30 days"
                  icon="mdi:target"
                />
              </Grid>

              <Grid xs={12} md={3} key={index}>
                <WidgetSummaryCard
                  title="Avg Settlement Confidence"
                  percent={card.settlementConfidencePercent}
                  total={`${formatNumber(card.settlementConfidenceTotal)}%`}
                  timing="Weighted by amount"
                  icon="mdi:trending-up"
                />
              </Grid>

              <Grid xs={12} md={3} key={index}>
                <WidgetSummaryCard
                  title="High Risk Days"
                  percent={card.highRiskDaysPercent}
                  total={card.highRiskDaysTotal}
                  timing="Next 7 days"
                  icon="mdi:alert-outline"
                />
              </Grid>

              <Grid xs={12} md={3} key={index}>
                <WidgetSummaryCard
                  title="Expected Net Inflow"
                  percent={card.netInflowPercent}
                  total={`₹${formatNumber(card.netInflowTotal)}`}
                  timing="Next 7 days (after refunds)"
                  icon="mdi:trending-up"
                />
              </Grid>
            </>
          ))}

          <Grid xs={12} md={12} lg={12}>
            <ForecastingYearlySales
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
            <ForecastingHighRisk title="High Risk Days Highlighted" list={_highRiskDays} />
          </Grid>

          <Grid xs={12} md={6}>
            <ForecastingRail
              title="Rail-wise Settlement Reliability"
              list={_railSettlementReliability}
            />
          </Grid>

          <Grid xs={12} md={6}>
            <ForecastingBankOutage title="Bank Outage Probability" data={_bankOutageProbability} />
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <ForecastingAppAreaInstalled
              title="Seasonality Patterns (6 Months)"
              // subheader="(+43%) than last year"
              chart={{
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
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
            <ForecastingAiInsights
              title="AI Insights & Predictions"
              list={_aiInsightsPredictions}
            />
          </Grid>
        </Grid>
    </Container>
  );
}
