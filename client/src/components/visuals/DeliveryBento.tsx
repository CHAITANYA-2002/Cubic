import { Check, Code2, FileCheck2, GitBranch } from "lucide-react";
import { useI18n } from "@/i18n";
import { Headline } from "@/components/site/blocks";
export function DeliveryBento() {
  const { t } = useI18n();
  return <section className="section-pad"><div className="container-w">
    <p className="label mb-4">{t.home.proofStrip.title}</p><h2 className="display-2 max-w-3xl"><Headline text={t.visuals.bentoTitle}/></h2><p className="lead mt-4">{t.visuals.bentoLead}</p>
    <p className="mt-8 font-mono text-xs t-secondary">{t.visuals.sample}</p>
    <div className="delivery-bento mt-4">
      <article className="card bento-portal"><h3>{t.visuals.bentoTitles[0]}</h3><div className="mock-toolbar"><span/><span/><span/></div><div className="mock-portal"><div className="mock-sidebar" aria-hidden="true"><i/><i/><i/></div><ol>{t.visuals.states.map((s,i)=><li key={s}><span className="step-dot">{i+1}</span>{s}{i<2&&<Check className="h-4 w-4 ms-auto t-brand" aria-hidden="true"/>}</li>)}</ol></div></article>
      <article className="card bento-invoice"><FileCheck2 className="h-7 w-7 t-brand" aria-hidden="true"/><h3>{t.visuals.bentoTitles[1]}</h3><p className="font-mono text-sm t-primary">{t.visuals.invoice}</p><div className="mock-lines" aria-hidden="true"><i/><i/><i/></div></article>
      <article className="card"><GitBranch className="h-7 w-7 t-brand" aria-hidden="true"/><h3>{t.visuals.bentoTitles[2]}</h3><p className="t-secondary">{t.visuals.states[2]}</p><div className="mock-bars" aria-hidden="true">{[40,70,55,85,65,95,80].map((h,i)=><i key={i} style={{height:h+"%"}}/>)}</div></article>
      <article className="card bento-code"><Code2 className="h-7 w-7 t-brand" aria-hidden="true"/><h3>{t.visuals.bentoTitles[3]}</h3><p className="t-secondary">{t.visuals.handover}</p><div className="mock-code" aria-hidden="true"><i/><i/><i/><i/></div></article>
    </div></div></section>;
}
