import { Link } from "wouter";
import { Layout } from "@/components/site/Layout";
import { useI18n } from "@/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <Layout>
      <section className="container-w flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="label mb-4">404</p>
        <h1 className="display-1">{t.common.notFound.title}</h1>
        <p className="lead mt-4">{t.common.notFound.text}</p>
        <Link href="/" className="btn btn-primary btn-lg mt-8">{t.common.notFound.home}</Link>
      </section>
    </Layout>
  );
}
