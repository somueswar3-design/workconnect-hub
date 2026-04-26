import { useEffect, useRef, useState } from 'react';
import { Loader2, X, Plus, Image as ImageIcon, Trash2, ExternalLink, Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  PortfolioProjectDto,
  getPortfolioProjects,
  savePortfolioProject,
  deletePortfolioProject,
  uploadPortfolioScreenshot,
  deletePortfolioScreenshot,
} from '@/services/freelancerApi';

interface Props {
  freelancerUserId: string;
  onBack: () => void;
  onContinue: () => void;
}

const inputCls = 'w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-orange-500 transition-colors placeholder:text-gray-400';
const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5';

const MAX_FILE_MB = 5;
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

const PortfolioSection = ({ freelancerUserId, onBack, onContinue }: Props) => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<PortfolioProjectDto[]>([]);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [draft, setDraft] = useState<Partial<PortfolioProjectDto>>({ title: '', description: '', projectUrl: '', techStack: '' });
  const [savingDraft, setSavingDraft] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingPortfolioId, setPendingPortfolioId] = useState<number | null>(null);

  const fetchAll = async () => {
    if (!freelancerUserId) return;
    setLoading(true);
    try {
      const data = await getPortfolioProjects(freelancerUserId);
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freelancerUserId]);

  const startNew = () => {
    setDraft({ title: '', description: '', projectUrl: '', techStack: '' });
    setEditingId('new');
  };

  const startEdit = (p: PortfolioProjectDto) => {
    setDraft({ ...p });
    setEditingId(p.id);
  };

  const cancelEdit = () => {
    setDraft({});
    setEditingId(null);
  };

  const saveDraft = async () => {
    if (!draft.title?.trim()) { toast.error('Project title is required'); return; }
    if (!draft.description?.trim()) { toast.error('Project description is required'); return; }
    setSavingDraft(true);
    try {
      const payload: Partial<PortfolioProjectDto> = {
        id: typeof editingId === 'number' ? editingId : 0,
        freelancerUserId: parseInt(freelancerUserId, 10) || 0,
        title: draft.title!.trim(),
        description: draft.description!.trim(),
        projectUrl: draft.projectUrl?.trim() || '',
        techStack: draft.techStack?.trim() || '',
      };
      const saved = await savePortfolioProject(payload);
      toast.success(editingId === 'new' ? 'Project added' : 'Project updated');
      setEditingId(null);
      setDraft({});
      // refresh and prompt to upload screenshots if it's brand new
      await fetchAll();
      if (editingId === 'new' && saved?.id) {
        setPendingPortfolioId(saved.id);
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to save project');
    } finally {
      setSavingDraft(false);
    }
  };

  const removeProject = async (id: number) => {
    if (!window.confirm('Delete this portfolio project? Screenshots will also be removed.')) return;
    try {
      await deletePortfolioProject(id, freelancerUserId);
      toast.success('Project deleted');
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete project');
    }
  };

  const handlePickFile = (portfolioId: number) => {
    setPendingPortfolioId(portfolioId);
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // reset
    if (!pendingPortfolioId || !files.length) return;

    const portfolioId = pendingPortfolioId;
    setPendingPortfolioId(null);
    setUploadingFor(portfolioId);

    for (const file of files) {
      if (!ACCEPTED.includes(file.type)) {
        toast.error(`${file.name}: only PNG, JPEG, WEBP, GIF allowed`);
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        toast.error(`${file.name}: must be under ${MAX_FILE_MB}MB`);
        continue;
      }
      try {
        const screenshot = await uploadPortfolioScreenshot(freelancerUserId, portfolioId, file);
        setProjects(prev => prev.map(p =>
          p.id === portfolioId
            ? { ...p, screenshots: [...(p.screenshots || []), screenshot] }
            : p,
        ));
        toast.success(`Uploaded ${file.name}`);
      } catch (err: any) {
        toast.error(err.message || `Failed to upload ${file.name}`);
      }
    }
    setUploadingFor(null);
  };

  const removeScreenshot = async (portfolioId: number, screenshotId: number) => {
    try {
      await deletePortfolioScreenshot(portfolioId, screenshotId, freelancerUserId);
      setProjects(prev => prev.map(p =>
        p.id === portfolioId
          ? { ...p, screenshots: (p.screenshots || []).filter(s => s.id !== screenshotId) }
          : p,
      ));
      toast.success('Screenshot removed');
    } catch (e: any) {
      toast.error(e.message || 'Failed to remove screenshot');
    }
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-orange-500 mb-1">Step 8 of 9</div>
        <h1 className="text-[30px] font-serif leading-tight text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>Portfolio projects</h1>
        <p className="text-sm text-gray-400 mt-1">Showcase your best work. Add a description, link, and screenshots for each project. Stored securely under your folder.</p>
      </div>

      {/* Projects list */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 flex items-center justify-center">
          <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(p => {
            const isEditing = editingId === p.id;
            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors">
                {isEditing ? (
                  <ProjectEditor
                    draft={draft}
                    setDraft={setDraft}
                    saving={savingDraft}
                    onSave={saveDraft}
                    onCancel={cancelEdit}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="text-[15px] font-semibold text-gray-900 truncate">{p.title}</div>
                        {p.techStack && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {p.techStack.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                              <span key={t} className="px-2 py-0.5 text-[10px] rounded-full bg-orange-50 border border-orange-200 text-orange-600">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {p.projectUrl && (
                          <a href={p.projectUrl} target="_blank" rel="noreferrer"
                            className="p-1.5 rounded-md text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors" title="Open">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button type="button" onClick={() => startEdit(p)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => removeProject(p.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">{p.description}</p>

                    {/* Screenshots grid */}
                    <div className="mt-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Screenshots ({p.screenshots?.length || 0})
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {(p.screenshots || []).map(s => (
                          <div key={s.id} className="group relative aspect-video bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                            <button type="button" onClick={() => setLightbox(s.url)} className="block w-full h-full">
                              <img src={s.url} alt="" loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            </button>
                            <button type="button" onClick={() => removeScreenshot(p.id, s.id)}
                              className="absolute top-1 right-1 p-1 rounded-md bg-white/90 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handlePickFile(p.id)}
                          disabled={uploadingFor === p.id}
                          className="aspect-video flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50/40 rounded-lg text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-60"
                        >
                          {uploadingFor === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              <span className="text-[10px] font-semibold">Add image</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1.5">PNG, JPEG, WEBP, GIF · max {MAX_FILE_MB}MB each</p>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* New project editor */}
          {editingId === 'new' && (
            <div className="bg-white border border-orange-200 rounded-2xl p-5">
              <ProjectEditor
                draft={draft}
                setDraft={setDraft}
                saving={savingDraft}
                onSave={saveDraft}
                onCancel={cancelEdit}
              />
            </div>
          )}

          {editingId !== 'new' && (
            <button
              type="button"
              onClick={startNew}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50/40 rounded-2xl py-6 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add portfolio project
            </button>
          )}
        </div>
      )}

      {/* Empty state hint */}
      {!loading && projects.length === 0 && editingId !== 'new' && (
        <div className="mt-3 text-[12px] text-gray-500 text-center">
          Add at least one project so clients can see your work. Optional but highly recommended.
        </div>
      )}

      {/* Footer nav */}
      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack}
          className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">
          ← Back
        </button>
        <button type="button" onClick={onContinue}
          className="bg-orange-500 text-gray-900 border-none rounded-lg px-5 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors">
          Continue → Links
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-gray-700 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

const ProjectEditor = ({
  draft, setDraft, saving, onSave, onCancel,
}: {
  draft: Partial<PortfolioProjectDto>;
  setDraft: (d: Partial<PortfolioProjectDto>) => void;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label className={labelCls}>Project title *</label>
        <input className={inputCls} placeholder="e.g. E-commerce dashboard for Acme Corp"
          value={draft.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })} maxLength={120} />
      </div>
      <div>
        <label className={labelCls}>Description *</label>
        <textarea className={`${inputCls} min-h-[110px] resize-y`}
          placeholder="What you built, your role, problem solved, outcomes…"
          value={draft.description || ''} onChange={e => setDraft({ ...draft, description: e.target.value })} maxLength={1500} />
        <div className="text-[11px] text-gray-400 text-right mt-1">{(draft.description || '').length} / 1500</div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Live / repo URL</label>
          <input className={inputCls} placeholder="https://…"
            value={draft.projectUrl || ''} onChange={e => setDraft({ ...draft, projectUrl: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Tech stack (comma separated)</label>
          <input className={inputCls} placeholder="React, Node.js, AWS"
            value={draft.techStack || ''} onChange={e => setDraft({ ...draft, techStack: e.target.value })} />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button type="button" onClick={onSave} disabled={saving}
          className="bg-orange-500 text-gray-900 border-none rounded-lg px-4 py-2 text-xs font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 inline-flex items-center gap-1.5">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {saving ? 'Saving…' : 'Save project'}
        </button>
        <button type="button" onClick={onCancel}
          className="bg-transparent border border-gray-200 rounded-lg px-4 py-2 text-[13px] text-gray-500 hover:border-gray-400 transition-colors">
          Cancel
        </button>
        <div className="ml-auto text-[11px] text-gray-400 inline-flex items-center gap-1">
          <ImageIcon className="h-3 w-3" /> Add screenshots after saving
        </div>
      </div>
    </div>
  );
};

export default PortfolioSection;
