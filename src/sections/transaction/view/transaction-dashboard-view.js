import { Container, Grid } from "@mui/material";
import { useSettingsContext } from "src/components/settings";

import WidgetSummaryCard from "../../../components/card/widget-summary-card";


export function TransectionView() {
  const settings = useSettingsContext();
  const DASHBOARD_CARDS=[
  {
    "title": "Total Active Users",
    "percent": 2.6,
    "total": 18765446545,
    "timing": "today",
    "icon": "codicon:pulse"
  },
  {
    "title": "New Users",
    "percent": 3.1,
    "total": 2450,
    "timing": "today",
    "icon": "mdi:trending-up"
  },
  {
    "title": "Total Revenue",
    "percent": 1.8,
    "total": '54.20%',
    "timing": "today",
    "icon": "codicon:pulse"
  },
  {
    "title": "Sales Growth",
    "percent": 4.5,
    "total": 1290,
    "timing": "today",
    "icon": "mdi:trending-up"
  },

  
]
  return (<>
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
       
          {DASHBOARD_CARDS.map((card) => (
             <Grid item xs={12} md={3}>
            <WidgetSummaryCard
              key={card.title}
              title={card.title}
              percent={card.percent}
              total={card.total}
              timing={card.timing}
              icon={card.icon}
               chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
            />
             </Grid>
          ))}
      </Grid>

    </Container>

  </>)
}