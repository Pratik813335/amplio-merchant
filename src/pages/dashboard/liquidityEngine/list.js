import { Helmet } from 'react-helmet-async';
import LiquidityEngineView from 'src/sections/liquidity-engine/view/liquidity-engine-view';
// sections


// ----------------------------------------------------------------------

export default function LiquidityEngineListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Liquidity-Engine List</title>
      </Helmet>

      <LiquidityEngineView />
    </>
  );
}
