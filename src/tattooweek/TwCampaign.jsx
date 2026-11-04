import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { CampaignContext, loadCampaign, campaignBase } from './twData';
import TwLanding from './TwLanding';
import TwPublic from './TwPublic';
import TwChallenge from './TwChallenge';
import TwNfc from './TwNfc';
import TwRetro from './TwRetro';
import TwResult from './TwResult';
import TwAdmin from './TwAdmin';
import TwTelao from './TwTelao';
import { TwRanking, TwPrizes } from './TwRanking';
import './tattooweek.css';

// Carrega a campanha pela URL e serve todas as páginas dela
export default function CampaignApp({ slug: fixedSlug }) {
  const params = useParams();
  const navigate = useNavigate();
  const slug = fixedSlug || params.campaignSlug;
  const [ctx, setCtx] = useState(undefined);

  const reload = useCallback(async () => {
    const data = await loadCampaign(slug);
    setCtx(data ? { ...data, base: campaignBase(data.campaign) } : null);
  }, [slug]);

  useEffect(() => { reload(); }, [reload]);

  if (ctx === undefined) {
    return <div className="tw"><div className="tw-center-screen"><Loader2 className="tw-spin" /></div></div>;
  }
  if (ctx === null) {
    return (
      <div className="tw"><div className="tw-center-screen"><div>
        <h1 className="tw-h2">Experiência não encontrada</h1>
        <p className="tw-p" style={{ margin: '0.5rem 0 1.25rem' }}>Confira o endereço ou veja as experiências disponíveis.</p>
        <button className="tw-btn" onClick={() => navigate('/experience')}>Ver experiências</button>
      </div></div></div>
    );
  }

  return (
    <CampaignContext.Provider value={{ ...ctx, reload }}>
      <Routes>
        <Route index element={<TwLanding />} />
        <Route path="meu" element={<TwPublic />} />
        <Route path="artist" element={<TwChallenge />} />
        <Route path="nfc/:artistSlug" element={<TwNfc />} />
        <Route path="ranking" element={<TwRanking />} />
        <Route path="retrospectiva" element={<TwRetro />} />
        <Route path="resultado" element={<TwResult />} />
        <Route path="premiacao" element={<TwPrizes />} />
        <Route path="telao" element={<TwTelao />} />
        <Route path="admin" element={<TwAdmin initialCampaignId={ctx.campaign.id} />} />
      </Routes>
    </CampaignContext.Provider>
  );
}
