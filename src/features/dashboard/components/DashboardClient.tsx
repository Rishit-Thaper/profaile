"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import "@/app/dashboard-theme.css";
import ResumeUploader from "./ResumeUploader";
import ThemePicker from "./ThemePicker";
import UsernameInput from "./UsernameInput";
import DashboardHeader from "./DashboardHeader";
import StepIndicator from "./StepIndicator";
import ParsedDataPreview from "./ParsedDataPreview";
import { PortfolioWorkspace } from "./PortfolioWorkspace";
import { PortfolioVersionPanel } from "./PortfolioVersionPanel";
import { PortfolioShareCard } from "./PortfolioShareCard";
import { PortfolioDetailsEditor } from "./PortfolioDetailsEditor";
import { WelcomeTour } from "./WelcomeTour";
import styles from "@/app/dashboard.module.css";
import { dashboardStepHeadings, dashboardSteps, DashboardStep } from "../constants/onboarding";
import { PortfolioData, PortfolioVersion } from "@/app/types";
import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import { useUpdateProfileMutation } from "@/features/profile/hooks/useUpdateProfileMutation";
import { usePortfolioMutations, usePortfoliosQuery, usePortfolioVersionsQuery, useResumeVersionsQuery } from "@/features/portfolio/hooks/usePortfolioQueries";
import { routes } from "@/config/routes";
import type { Appearance } from "../card/card-themes";
import { updatePortfolio } from "@/features/portfolio/api/portfolio-client";

export default function DashboardClient({ userEmail }: { userEmail: string }) {
  const { data: account, isLoading: accountLoading } = useProfileQuery();
  const { data: portfolios = [], isLoading: portfoliosLoading, refetch: refetchPortfolios } = usePortfoliosQuery();
  const { data: resumes = [] } = useResumeVersionsQuery();
  const profileMutation = useUpdateProfileMutation();
  const portfolioMutations = usePortfolioMutations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<DashboardStep>("upload");
  const [tourRestart, setTourRestart] = useState(0);
  const [manageOpen, setManageOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [origin, setOrigin] = useState("");
  const manageDialog = useRef<HTMLDialogElement>(null);
  const generatedFor = useRef(new Set<string>());
  const photoSyncedFor = useRef(new Set<string>());

  useEffect(() => { setOrigin(window.location.origin); }, []);
  useEffect(() => {
    if (!selectedId && portfolios[0]) setSelectedId(portfolios[0].id);
    if (selectedId && !portfolios.some((portfolio) => portfolio.id === selectedId)) setSelectedId(portfolios[0]?.id ?? null);
  }, [portfolios, selectedId]);
  useEffect(() => {
    const dialog = manageDialog.current;
    if (!dialog) return;
    if (manageOpen && !dialog.open) dialog.showModal();
    if (!manageOpen && dialog.open) dialog.close();
  }, [manageOpen]);

  const currentPortfolio = portfolios.find((portfolio) => portfolio.id === selectedId) ?? portfolios[0] ?? null;
  const currentPortfolioId = currentPortfolio?.id;
  const hasDraftData = Boolean(currentPortfolio?.draft_data && Object.keys(currentPortfolio.draft_data).length);
  const { data: versions = [], refetch: refetchVersions } = usePortfolioVersionsQuery(currentPortfolio?.id ?? null);
  const currentData = currentPortfolio?.draft_data ?? null;
  const sharedPhoto = portfolios.find((portfolio) => portfolio.draft_data?.personal_info?.photo && portfolio.draft_data.personal_info.photo_visible !== false)?.draft_data?.personal_info.photo
    ?? account?.portfolio_data?.personal_info?.photo;
  const needsSharedPhoto = Boolean(currentData?.personal_info && !currentData.personal_info.photo && currentData.personal_info.photo_visible !== false && sharedPhoto);

  useEffect(() => {
    if (!currentPortfolioId || !currentData || !sharedPhoto || !needsSharedPhoto || photoSyncedFor.current.has(currentPortfolioId)) return;
    photoSyncedFor.current.add(currentPortfolioId);
    void updatePortfolio(currentPortfolioId, { draft_data: { ...currentData, personal_info: { ...currentData.personal_info, photo: sharedPhoto, photo_visible: true } } })
      .then(() => refetchPortfolios())
      .catch(() => { photoSyncedFor.current.delete(currentPortfolioId); });
    // Bring an existing profile photo into portfolio drafts created from resumes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPortfolioId, needsSharedPhoto, sharedPhoto]);

  useEffect(() => {
    if (currentPortfolioId) setCurrentStep(hasDraftData ? "preview" : "upload");
  }, [currentPortfolioId, hasDraftData]);

  const generateHeadline = async (id: string, regenerate = false) => {
    const response = await fetch(`/api/portfolios/${id}/headline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regenerate }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not generate a headline");
    await refetchPortfolios();
  };
  useEffect(() => {
    const existingHeadline = currentData?.personal_info?.headline;
    const malformedHeadline = Boolean(existingHeadline && (/[:,;/]|-$/.test(existingHeadline) || /\b(engineer|developer|full-stack|react|next\.js)\b/i.test(existingHeadline)));
    if (!currentPortfolioId || !currentData?.personal_info?.name || needsSharedPhoto || (existingHeadline && !malformedHeadline) || generatedFor.current.has(currentPortfolioId)) return;
    generatedFor.current.add(currentPortfolioId);
    void generateHeadline(currentPortfolioId, malformedHeadline).catch(() => { generatedFor.current.delete(currentPortfolioId); });
    // Generate once for each existing portfolio that predates the headline field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPortfolioId, currentData?.personal_info?.name, currentData?.personal_info?.headline, needsSharedPhoto]);

  const publishedVersion = versions.find((version) => version.id === currentPortfolio?.published_version_id);
  const shareReady = Boolean(currentPortfolio?.published_version_id && publishedVersion && currentData && publishedVersion.theme === currentPortfolio?.draft_theme && JSON.stringify(publishedVersion.data) === JSON.stringify(currentData));
  const publicUrl = currentPortfolio && account?.username && origin
    ? `${origin}${routes.portfolioBySlug(account.username, currentPortfolio.slug)}`
    : "";

  const withSharedPhoto = (data: PortfolioData): PortfolioData =>
    sharedPhoto && data.personal_info && !data.personal_info.photo && data.personal_info.photo_visible !== false
      ? { ...data, personal_info: { ...data.personal_info, photo: sharedPhoto, photo_visible: true } }
      : data;
  const persistDraft = async (data: PortfolioData, theme = currentPortfolio?.draft_theme) => {
    if (!currentPortfolio) return;
    await portfolioMutations.saveDraft.mutateAsync({ id: currentPortfolio.id, data: withSharedPhoto(data), theme });
    await refetchPortfolios();
  };
  const updatePersonal = async (change: Partial<PortfolioData["personal_info"]>) => {
    if (!currentData) return;
    await persistDraft({ ...currentData, personal_info: { ...currentData.personal_info, ...change } });
  };

  const handleCreatePortfolio = async ({ name, slug, resumeId }: { name: string; slug: string; resumeId?: string }) => {
    const resume = resumes.find((item) => item.id === resumeId);
    const initialData = resume?.parsed_data && sharedPhoto && !resume.parsed_data.personal_info.photo
      ? { ...resume.parsed_data, personal_info: { ...resume.parsed_data.personal_info, photo: sharedPhoto, photo_visible: true } }
      : resume?.parsed_data;
    const created = await portfolioMutations.create.mutateAsync({ name, slug, draft_data: initialData });
    setSelectedId(created.id);
    setCurrentStep(resume ? "preview" : "upload");
    setEditing(true);
    setEditingDetails(false);
  };
  const createVersion = async (label?: string, publish = false) => {
    if (!currentPortfolio || !currentData) return;
    const versionData = withSharedPhoto(currentData);
    if (versionData !== currentData) await persistDraft(versionData);
    const version = await portfolioMutations.snapshot.mutateAsync({ id: currentPortfolio.id, label, data: versionData, theme: currentPortfolio.draft_theme });
    if (publish) await portfolioMutations.publish.mutateAsync({ id: currentPortfolio.id, versionId: version.id });
    await Promise.all([refetchPortfolios(), refetchVersions()]);
    if (publish) { setEditing(false); setManageOpen(false); }
  };
  const restoreVersion = async (version: PortfolioVersion) => {
    if (!currentPortfolio) return;
    await persistDraft(version.data, version.theme);
    setCurrentStep("preview");
  };

  const steps = useMemo(() => dashboardSteps.map((key) => ({ key, label: dashboardStepHeadings[key].eyebrow.replace("Step ", "").replace(" of 5", "") })), []);
  const currentStepIndex = dashboardSteps.indexOf(currentStep);
  const meta = dashboardStepHeadings[currentStep];
  if (accountLoading || portfoliosLoading) return <div className={styles.loadingScreen}><div className={styles.loadingMark} /><div className={styles.loadingSpinner} /><p className={styles.loadingText}>Setting up your workspace...</p></div>;

  return <div className={styles.dashboard}>
    <DashboardHeader email={userEmail} isPublished={Boolean(currentPortfolio?.published_version_id)} username={account?.username ?? null} portfolioSlug={currentPortfolio?.slug} editProfileHref={currentPortfolio ? routes.editProfileForPortfolio(currentPortfolio.id) : routes.editProfile} onTakeTour={() => { localStorage.removeItem("profaile-onboarding-tour-v1"); setTourRestart((value) => value + 1); }} />
    <WelcomeTour key={tourRestart} manual={tourRestart > 0} />
    <main className={styles.main}>
      <div data-tour="portfolio-card">
        <PortfolioShareCard
          portfolioName={currentPortfolio?.name ?? "Your portfolio"}
          data={currentData}
          theme={currentPortfolio?.draft_theme ?? "minimal"}
          publicUrl={publicUrl}
          draftUrl={currentPortfolio && hasDraftData ? routes.portfolioDraft(currentPortfolio.id) : null}
          shareReady={shareReady && Boolean(publicUrl)}
          onThemeChange={async (theme) => { if (currentData) await persistDraft(currentData, theme); }}
          onAppearanceChange={async (appearance: Appearance) => updatePersonal({ appearance })}
          onHeadlineSave={async (headline) => updatePersonal({ headline })}
          onGenerateHeadline={async () => { if (currentPortfolioId) await generateHeadline(currentPortfolioId, true); }}
          onGoLive={async () => {
            if (!account?.username) {
              setCurrentStep("username"); setEditing(true); setManageOpen(true);
              throw new Error("Choose your public username, then go live.");
            }
            await createVersion(undefined, true);
          }}
        />
      </div>
      <div className={styles.manageEntry}>
        <div><h2>Manage portfolios</h2><p>Open your drafts, edit details, and publish a version when it is ready.</p></div>
        <button data-tour="manage-portfolios" className={styles.primaryButton} onClick={() => setManageOpen(true)}>Manage portfolios <FiArrowRight aria-hidden /></button>
      </div>
    </main>
    <dialog ref={manageDialog} className={styles.manageDialog} onClose={() => { setManageOpen(false); setEditing(false); setEditingDetails(false); }} onClick={(event) => { if (event.target === event.currentTarget) setManageOpen(false); }} aria-labelledby="manage-portfolios-title">
      <div className={styles.manageShell}>
        <div className={styles.manageHeader}>
          <div><span className={styles.eyebrow}>Your workspace</span><h2 id="manage-portfolios-title">Manage portfolios</h2><p>Keep versions private, edit your draft, and go live when ready.</p></div>
          <button className={styles.manageClose} type="button" onClick={() => setManageOpen(false)} aria-label="Close portfolio manager">×</button>
        </div>
        <PortfolioWorkspace portfolios={portfolios} currentId={currentPortfolio?.id ?? null} resumes={resumes} draftUrl={null} onSelect={(id) => { setSelectedId(id); setEditing(false); setEditingDetails(false); }} onCreate={handleCreatePortfolio} />
        {!currentPortfolio ? <div className={styles.manageEmpty}><h3>Create your first portfolio</h3><p>Start with a blank draft or a saved resume using New portfolio above.</p></div> : <>
          <div className={styles.manageTabs}>
            <button type="button" className={!editing ? styles.activeTab : ""} onClick={() => { setEditing(false); setEditingDetails(false); }}>Versions</button>
            <button type="button" className={editing ? styles.activeTab : ""} onClick={() => setEditing(true)}>Edit draft</button>
          </div>
          {editing ? <div className={styles.wizard}>
            <StepIndicator steps={steps} currentStep={currentStep} onStepClick={(step) => { if (dashboardSteps.indexOf(step as DashboardStep) <= currentStepIndex) setCurrentStep(step as DashboardStep); }} />
            <div className={styles.stepContent}><div className={styles.stepCard}>
              <div className={styles.eyebrow}><span className={styles.eyebrowDot} />{meta.eyebrow}</div>
              <h2 className={styles.stepTitle}>{editingDetails ? "Update portfolio details" : meta.title}</h2><p className={styles.stepDescription}>{editingDetails ? "Edit your content here. Changes remain private until you go live." : meta.desc}</p>
              {currentStep === "upload" && <ResumeUploader onComplete={async (data) => { await persistDraft(data); setCurrentStep("preview"); }} />}
              {currentStep === "preview" && currentData && (editingDetails
                ? <PortfolioDetailsEditor key={currentPortfolio.id} initialData={currentData} onSave={async (data) => { await persistDraft(data); setEditingDetails(false); }} onCancel={() => setEditingDetails(false)} />
                : <div className="animate-fade-in-up"><ParsedDataPreview data={currentData} /><div className={styles.previewActions}><button className={styles.secondaryButton} onClick={() => setCurrentStep("upload")}>Use another resume</button><button className={styles.secondaryButton} onClick={() => setEditingDetails(true)}>Edit details</button><button className={styles.primaryButton} onClick={() => setCurrentStep("theme")}>Looks good, pick a theme</button></div></div>)}
              {currentStep === "theme" && currentData && <ThemePicker key={currentPortfolio.id} currentTheme={currentPortfolio.draft_theme} onSelect={async (theme) => { await persistDraft(currentData, theme); setCurrentStep("username"); }} />}
              {currentStep === "username" && <UsernameInput currentUsername={account?.username ?? ""} onSet={async (username) => { await profileMutation.mutateAsync({ username }); setCurrentStep("publish"); }} />}
              {currentStep === "publish" && currentData && <PortfolioVersionPanel versions={versions} publishedVersionId={currentPortfolio.published_version_id} publicUrl={publicUrl} draftUrl={routes.portfolioDraft(currentPortfolio.id)} onSaveVersion={createVersion} onPublish={async (versionId) => { await portfolioMutations.publish.mutateAsync({ id: currentPortfolio.id, versionId }); await refetchPortfolios(); }} onRestore={restoreVersion} />}
            </div></div>
          </div> : <div className={styles.manageVersions}>
            <div className={styles.manageVersionsIntro}><div><h3>{currentPortfolio.name}</h3><p>{hasDraftData ? "Your latest draft and saved versions" : "Add details to this portfolio to create its first version."}</p></div><button className={styles.primaryButton} onClick={() => { setCurrentStep(hasDraftData ? "preview" : "upload"); setEditingDetails(hasDraftData); setEditing(true); }}>{hasDraftData ? "Update details" : "Build portfolio"}</button></div>
            {hasDraftData && <PortfolioVersionPanel versions={versions} publishedVersionId={currentPortfolio.published_version_id} publicUrl={publicUrl} draftUrl={routes.portfolioDraft(currentPortfolio.id)} onSaveVersion={createVersion} onPublish={async (versionId) => { await portfolioMutations.publish.mutateAsync({ id: currentPortfolio.id, versionId }); await refetchPortfolios(); }} onRestore={restoreVersion} />}
          </div>}
        </>}
      </div>
    </dialog>
  </div>;
}
